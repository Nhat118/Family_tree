// Lightweight relation utilities aligned with SQL schema design
// Tables mapped conceptually:
// - ThanhVien => member { id, name, gender, birthDate, deathDate, ... }
// - MoiQuanHe => relation types: CHA, ME, CON, VOCHONG, ANH, EM
// - TV_MQH => edges { from, to, type }

export const RelationType = {
  CHA: 'CHA',
  ME: 'ME',
  CON: 'CON',
  VOCHONG: 'VOCHONG',
  ANH: 'ANH',
  EM: 'EM'
};

// Normalize our UI relations to SQL-like codes
export function toSqlCode(uiType) {
  switch (uiType) {
    case 'parent': return RelationType.CHA; // generic parent as CHA; UI can infer ME by gender
    case 'spouse': return RelationType.VOCHONG;
    case 'sibling': return RelationType.ANH; // simplified
    default: return uiType;
  }
}

export function fromSqlCode(code) {
  switch (code) {
    case RelationType.CHA:
    case RelationType.ME:
    case RelationType.CON:
      return 'parent';
    case RelationType.VOCHONG: return 'spouse';
    case RelationType.ANH:
    case RelationType.EM:
      return 'sibling';
    default: return code;
  }
}

export function findParentsOf(memberId, relations) {
  return relations.filter(r => r.type === 'parent' && r.to === memberId).map(r => r.from);
}

export function findChildrenOf(memberId, relations) {
  return relations.filter(r => r.type === 'parent' && r.from === memberId).map(r => r.to);
}

export function findSpouseOf(memberId, relations) {
  const r = relations.find(r => r.type === 'spouse' && (r.from === memberId || r.to === memberId));
  if (!r) return null;
  return r.from === memberId ? r.to : r.from;
}

export function upsertRelation(relations, edge) {
  const exists = relations.findIndex(r => r.from === edge.from && r.to === edge.to && r.type === edge.type);
  if (exists >= 0) {
    const next = relations.slice();
    next[exists] = edge;
    return next;
  }
  return [...relations, edge];
}

export function removeRelation(relations, edge) {
  return relations.filter(r => !(r.from === edge.from && r.to === edge.to && r.type === edge.type));
}

export function searchMembers(members, keyword) {
  const q = (keyword || '').trim().toLowerCase();
  if (!q) return members;
  return members.filter(m =>
    (m.name || '').toLowerCase().includes(q) ||
    (m.birthDate || '').toLowerCase().includes(q) ||
    (m.deathDate || '').toLowerCase().includes(q) ||
    (m.gender || '').toLowerCase().includes(q)
  );
}


