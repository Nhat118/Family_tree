// import api from './api';

const STORAGE_KEY = 'cgp_trees';
const STORAGE_VER_KEY = 'cgp_trees_version';
const STORAGE_VERSION = 2; // bump when we change demo seed

function seedIfEmpty() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const verRaw = localStorage.getItem(STORAGE_VER_KEY);
  const version = verRaw ? Number(verRaw) : 0;
  if (!raw || version < STORAGE_VERSION) {
    const now = new Date().toISOString();
    const seed = [
      {
        id: 1,
        title: 'Gia phả họ Ngô',
        coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop',
        description: 'Gia phả chi họ Ngô tại Hà Nội.',
        ownerName: 'Admin',
        createdAt: now,
        members: [
          { id: 1, name: 'Ngô Văn A', gender: 'male', birthDate: '1965-03-12' }, // Bố
          { id: 2, name: 'Trần Thị B', gender: 'female', birthDate: '1968-07-21' }, // Mẹ
          { id: 3, name: 'Ngô Quý Long Nhật', gender: 'male', birthDate: '1990-01-01' }, // Con trai
          { id: 4, name: 'Ngô Thị C', gender: 'female', birthDate: '1993-05-11' }, // Con gái (chị/em)
          { id: 5, name: 'Nguyễn Thị D', gender: 'female', birthDate: '1991-09-09' }, // Vợ của 3
          { id: 6, name: 'Ngô Bé E', gender: 'male', birthDate: '2020-12-01' } // Con của (3,5)
        ],
        relations: [
          { from: 1, to: 2, type: 'spouse' },
          // Quan hệ bố/mẹ -> con
          { from: 1, to: 3, type: 'parent' },
          { from: 2, to: 3, type: 'parent' },
          { from: 1, to: 4, type: 'parent' },
          { from: 2, to: 4, type: 'parent' },
          // Anh chị em ruột
          { from: 3, to: 4, type: 'sibling' },
          // Vợ chồng và con
          { from: 3, to: 5, type: 'spouse' },
          { from: 3, to: 6, type: 'parent' },
          { from: 5, to: 6, type: 'parent' }
        ]
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    localStorage.setItem(STORAGE_VER_KEY, String(STORAGE_VERSION));
  }
}

function readAll() {
  seedIfEmpty();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeAll(trees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
}

export async function fetchTrees() {
  // return await api.get('/trees');
  return readAll();
}

export async function fetchTree(treeId) {
  // return await api.get(`/trees/${treeId}`);
  const trees = readAll();
  return trees.find(t => String(t.id) === String(treeId)) || null;
}

export async function createTree(payload) {
  // return await api.post('/trees', payload);
  const trees = readAll();
  const nextId = trees.length ? Math.max(...trees.map(t => t.id)) + 1 : 1;
  const now = new Date().toISOString();
  const newTree = {
    id: nextId,
    title: payload.title,
    coverUrl: payload.coverUrl || '',
    description: payload.description || '',
    ownerName: payload.ownerName || 'Bạn',
    createdAt: now,
    members: payload.members || [],
    relations: payload.relations || []
  };
  trees.push(newTree);
  writeAll(trees);
  return newTree;
}

export async function updateTree(treeId, payload) {
  // return await api.put(`/trees/${treeId}`, payload);
  const trees = readAll();
  const idx = trees.findIndex(t => String(t.id) === String(treeId));
  if (idx === -1) return null;
  trees[idx] = { ...trees[idx], ...payload, id: trees[idx].id };
  writeAll(trees);
  return trees[idx];
}

export async function deleteTree(treeId) {
  // return await api.delete(`/trees/${treeId}`);
  const trees = readAll();
  const next = trees.filter(t => String(t.id) !== String(treeId));
  writeAll(next);
  return { ok: true };
}

// --- Validation helpers for relations logic (legal/basic constraints) ---
function toDate(d) {
  if (!d) return null;
  try { return new Date(d); } catch { return null; }
}

export function validateRelations(members, relations) {
  const errors = [];
  const idSet = new Set(members.map(m => m.id));
  const byId = new Map(members.map(m => [m.id, m]));

  // basic referential checks
  relations.forEach((r, idx) => {
    if (r.from === r.to) errors.push(`Quan hệ tự tham chiếu ở dòng ${idx + 1}`);
    if (!idSet.has(r.from) || !idSet.has(r.to)) errors.push(`Quan hệ tham chiếu ID không tồn tại ở dòng ${idx + 1}`);
    if (r.type !== 'parent' && r.type !== 'spouse' && r.type !== 'sibling') errors.push(`Loại quan hệ không hợp lệ ở dòng ${idx + 1}`);
  });

  // parent -> child should respect birth dates
  relations.filter(r => r.type === 'parent').forEach((r) => {
    const p = byId.get(r.from);
    const c = byId.get(r.to);
    const pd = toDate(p?.birthDate);
    const cd = toDate(c?.birthDate);
    if (pd && cd && pd >= cd) {
      errors.push(`Cha/Mẹ (${p?.name}) phải sinh trước con (${c?.name})`);
    }
  });

  // no more than two parents per child
  const childParentCount = new Map();
  relations.filter(r => r.type === 'parent').forEach(r => {
    childParentCount.set(r.to, (childParentCount.get(r.to) || 0) + 1);
  });
  childParentCount.forEach((count, childId) => {
    if (count > 2) errors.push(`Con (${byId.get(childId)?.name}) có hơn 2 cha/mẹ`);
  });

  // spouse cannot duplicate and cannot be with oneself
  const seenSpouse = new Set();
  relations.filter(r => r.type === 'spouse').forEach(r => {
    const key = [Math.min(r.from, r.to), Math.max(r.from, r.to)].join('-');
    if (seenSpouse.has(key)) errors.push(`Trùng quan hệ vợ/chồng giữa ${byId.get(r.from)?.name} và ${byId.get(r.to)?.name}`);
    seenSpouse.add(key);
    if (r.from === r.to) errors.push(`Một người không thể là vợ/chồng của chính mình`);
  });

  // check for sibling marriage (same parents)
  const parentsByChild = new Map();
  relations.filter(r => r.type === 'parent').forEach(r => {
    const list = parentsByChild.get(r.to) || [];
    list.push(r.from);
    parentsByChild.set(r.to, list);
  });
  relations.filter(r => r.type === 'spouse').forEach(r => {
    const p1Parents = parentsByChild.get(r.from) || [];
    const p2Parents = parentsByChild.get(r.to) || [];
    const commonParents = p1Parents.filter(p => p2Parents.includes(p));
    if (commonParents.length > 0) {
      errors.push(`Anh chị em ruột không thể kết hôn: ${byId.get(r.from)?.name} và ${byId.get(r.to)?.name}`);
    }
  });

  return { ok: errors.length === 0, errors };
}