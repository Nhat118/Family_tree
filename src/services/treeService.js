// import api from './api';

const STORAGE_KEY = 'cgp_trees';
const STORAGE_VER_KEY = 'cgp_trees_version';
const STORAGE_VERSION = 3; // tăng version để seed lại

function seedIfEmpty() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const verRaw = localStorage.getItem(STORAGE_VER_KEY);
  const version = verRaw ? Number(verRaw) : 0;
  if (!raw || version < STORAGE_VERSION) {
    const now = new Date().toISOString();

    const seed = [
      // ===================== GIA PHẢ HỌ NGÔ =====================
      {
        id: 1,
        title: 'Gia phả họ Ngô',
        coverUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop',
        description: 'Gia phả chi họ Ngô tại Hà Nội.',
        ownerName: 'Admin',
        createdAt: now,
        members: [
          { id: 1, name: 'Ngô Văn Hòa', gender: 'male', birthDate: '1940-03-01' },
          { id: 2, name: 'Phạm Thị Lan', gender: 'female', birthDate: '1943-07-15' },
          { id: 3, name: 'Ngô Văn A', gender: 'male', birthDate: '1965-03-12' },
          { id: 4, name: 'Trần Thị B', gender: 'female', birthDate: '1968-07-21' },
          { id: 5, name: 'Ngô Quý Long Nhật', gender: 'male', birthDate: '1990-01-01' },
          { id: 6, name: 'Ngô Thị C', gender: 'female', birthDate: '1993-05-11' },
          { id: 7, name: 'Nguyễn Thị D', gender: 'female', birthDate: '1991-09-09' },
          { id: 8, name: 'Ngô Bé E', gender: 'male', birthDate: '2020-12-01' },
          { id: 9, name: 'Ngô Nhí F', gender: 'female', birthDate: '2023-06-15' }
        ],
        relations: [
          { from: 1, to: 2, type: 'spouse' },
          { from: 1, to: 3, type: 'parent' },
          { from: 2, to: 3, type: 'parent' },
          { from: 1, to: 4, type: 'parent' },
          { from: 2, to: 4, type: 'parent' },
          { from: 3, to: 4, type: 'sibling' },
          { from: 3, to: 4, type: 'sibling' },
          { from: 3, to: 5, type: 'parent' },
          { from: 4, to: 5, type: 'parent' },
          { from: 3, to: 6, type: 'parent' },
          { from: 4, to: 6, type: 'parent' },
          { from: 5, to: 7, type: 'spouse' },
          { from: 5, to: 8, type: 'parent' },
          { from: 7, to: 8, type: 'parent' },
          { from: 5, to: 9, type: 'parent' },
          { from: 7, to: 9, type: 'parent' }
        ]
      },

      // ===================== GIA PHẢ HỌ NGUYỄN =====================
      {
        id: 2,
        title: 'Gia phả họ Nguyễn',
        coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop',
        description: 'Gia phả dòng họ Nguyễn ở Huế.',
        ownerName: 'Nguyễn Văn Hưng',
        createdAt: now,
        members: [
          { id: 1, name: 'Nguyễn Văn Minh', gender: 'male', birthDate: '1935-04-12' },
          { id: 2, name: 'Trần Thị Hoa', gender: 'female', birthDate: '1938-09-10' },
          { id: 3, name: 'Nguyễn Văn Hùng', gender: 'male', birthDate: '1960-01-22' },
          { id: 4, name: 'Phan Thị Lệ', gender: 'female', birthDate: '1962-03-15' },
          { id: 5, name: 'Nguyễn Văn Hưng', gender: 'male', birthDate: '1985-07-09' },
          { id: 6, name: 'Nguyễn Thị Hồng', gender: 'female', birthDate: '1988-10-11' },
          { id: 7, name: 'Ngô Thị Thu', gender: 'female', birthDate: '1986-02-05' },
          { id: 8, name: 'Nguyễn Văn Nam', gender: 'male', birthDate: '2015-09-01' },
          { id: 9, name: 'Nguyễn Văn Phúc', gender: 'male', birthDate: '2019-04-13' }
        ],
        relations: [
          { from: 1, to: 2, type: 'spouse' },
          { from: 1, to: 3, type: 'parent' },
          { from: 2, to: 3, type: 'parent' },
          { from: 3, to: 4, type: 'spouse' },
          { from: 3, to: 5, type: 'parent' },
          { from: 4, to: 5, type: 'parent' },
          { from: 3, to: 6, type: 'parent' },
          { from: 4, to: 6, type: 'parent' },
          { from: 5, to: 7, type: 'spouse' },
          { from: 5, to: 8, type: 'parent' },
          { from: 7, to: 8, type: 'parent' },
          { from: 5, to: 9, type: 'parent' },
          { from: 7, to: 9, type: 'parent' }
        ]
      },

      // ===================== GIA PHẢ HỌ TRẦN =====================
      {
        id: 3,
        title: 'Gia phả họ Trần',
        coverUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&auto=format&fit=crop',
        description: 'Gia phả họ Trần tại Nam Định, 4 đời kế tiếp.',
        ownerName: 'Trần Văn Nam',
        createdAt: now,
        members: [
          { id: 1, name: 'Trần Văn Quang', gender: 'male', birthDate: '1920-02-05' },
          { id: 2, name: 'Nguyễn Thị Tâm', gender: 'female', birthDate: '1925-09-09' },
          { id: 3, name: 'Trần Văn Sơn', gender: 'male', birthDate: '1950-06-15' },
          { id: 4, name: 'Phạm Thị Nhung', gender: 'female', birthDate: '1954-10-12' },
          { id: 5, name: 'Trần Văn Nam', gender: 'male', birthDate: '1980-07-22' },
          { id: 6, name: 'Trần Thị Hương', gender: 'female', birthDate: '1983-12-03' },
          { id: 7, name: 'Đỗ Thị Mai', gender: 'female', birthDate: '1982-05-20' },
          { id: 8, name: 'Trần Quốc Anh', gender: 'male', birthDate: '2008-04-30' },
          { id: 9, name: 'Trần Minh Châu', gender: 'female', birthDate: '2010-11-22' },
          { id: 10, name: 'Trần Tuấn Kiệt', gender: 'male', birthDate: '2013-02-14' }
        ],
        relations: [
          { from: 1, to: 2, type: 'spouse' },
          { from: 1, to: 3, type: 'parent' },
          { from: 2, to: 3, type: 'parent' },
          { from: 3, to: 4, type: 'spouse' },
          { from: 3, to: 5, type: 'parent' },
          { from: 4, to: 5, type: 'parent' },
          { from: 3, to: 6, type: 'parent' },
          { from: 4, to: 6, type: 'parent' },
          { from: 5, to: 7, type: 'spouse' },
          { from: 5, to: 8, type: 'parent' },
          { from: 7, to: 8, type: 'parent' },
          { from: 5, to: 9, type: 'parent' },
          { from: 7, to: 9, type: 'parent' },
          { from: 5, to: 10, type: 'parent' },
          { from: 7, to: 10, type: 'parent' }
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
  return readAll();
}

export async function fetchTree(treeId) {
  const trees = readAll();
  return trees.find(t => String(t.id) === String(treeId)) || null;
}

export async function createTree(payload) {
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
  const trees = readAll();
  const idx = trees.findIndex(t => String(t.id) === String(treeId));
  if (idx === -1) return null;
  trees[idx] = { ...trees[idx], ...payload, id: trees[idx].id };
  writeAll(trees);
  return trees[idx];
}

export async function deleteTree(treeId) {
  const trees = readAll();
  const next = trees.filter(t => String(t.id) !== String(treeId));
  writeAll(next);
  return { ok: true };
}

// --- Validation helpers ---
function toDate(d) {
  if (!d) return null;
  try { return new Date(d); } catch { return null; }
}

export function validateRelations(members, relations) {
  const errors = [];
  const idSet = new Set(members.map(m => m.id));
  const byId = new Map(members.map(m => [m.id, m]));

  relations.forEach((r, idx) => {
    if (r.from === r.to) errors.push(`Quan hệ tự tham chiếu ở dòng ${idx + 1}`);
    if (!idSet.has(r.from) || !idSet.has(r.to)) errors.push(`Quan hệ tham chiếu ID không tồn tại ở dòng ${idx + 1}`);
    if (r.type === 'parent') {
      const p = byId.get(r.from);
      const c = byId.get(r.to);
      const py = p?.birthDate ? Number(String(p.birthDate).slice(0,4)) : NaN;
      const cy = c?.birthDate ? Number(String(c.birthDate).slice(0,4)) : NaN;
      if (!isNaN(py) && !isNaN(cy) && py > cy - 12) {
        errors.push(`Quan hệ cha/mẹ không hợp lệ (tuổi) ở dòng ${idx + 1}`);
      }
    }
  });

  return { ok: errors.length === 0, errors };
}
