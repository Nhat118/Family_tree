import React, { useMemo, useState, useCallback } from "react";
import { useTree } from "../contexts/TreeContext";
import { validateRelations } from "../services/treeService";

// Simple binary-tree layout and rendering using absolute HTML nodes + SVG edges
export default function BinaryTreeCanvas({ members = [], relations = [] }) {
  const { activeTree, editTree } = useTree();
  const [showForm, setShowForm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [relationType, setRelationType] = useState("child");
  const [form, setForm] = useState({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
  const [selectedPersons, setSelectedPersons] = useState({ person1: null, person2: null });
  const [hoverMemberId, setHoverMemberId] = useState(null);
  const [quickMenu, setQuickMenu] = useState({ open: false, x: 0, y: 0, memberId: null });

  const parentToChildren = useMemo(() => {
    const byId = new Map(members.map(m => [m.id, m]));
    const map = new Map();
    relations.filter(r => r.type === 'parent').forEach(r => {
      const parent = byId.get(r.from);
      const child = byId.get(r.to);
      // Sanity: only accept if parent is older than child by at least 12 years
      function parseYear(d) { return d ? Number(String(d).slice(0,4)) : NaN; }
      const py = parseYear(parent?.birthDate);
      const cy = parseYear(child?.birthDate);
      if (!isNaN(py) && !isNaN(cy) && py > cy - 12) return; // discard implausible relation

      const list = map.get(r.from) || [];
      list.push(r.to);
      const unique = Array.from(new Set(list));
      unique.sort((a, b) => {
        const da = byId.get(a)?.birthDate || '';
        const db = byId.get(b)?.birthDate || '';
        return String(da).localeCompare(String(db));
      });
      map.set(r.from, unique);
    });
    return map;
  }, [relations, members]);

  const positions = useMemo(() => {
    // Xác định gốc ưu tiên: người lớn tuổi nhất không có cha/mẹ
    const childHasParent = new Set();
    parentToChildren.forEach(list => list.forEach(id => childHasParent.add(id)));
    const allIds = members.map(m => m.id);
    let roots = allIds.filter(id => !childHasParent.has(id));
    if (roots.length > 1) {
      roots = roots.sort((a, b) => {
        const da = members.find(m => m.id === a)?.birthDate || '';
        const db = members.find(m => m.id === b)?.birthDate || '';
        return String(da).localeCompare(String(db));
      });
    }
    // spouse map for pairing
    const spouseOf = new Map();
    relations.filter(r => r.type === 'spouse').forEach(r => {
      spouseOf.set(r.from, r.to);
      spouseOf.set(r.to, r.from);
    });
    // Tinh chỉnh khoảng cách cho bố cục thoáng hơn
    const levelGap = 190;
    const nodeGap = 300;
    const pos = new Map();

    // 1) compute subtree width
    const widthMemo = new Map();
    function unionChildren(nodeId) {
      const partner = spouseOf.get(nodeId);
      const a = parentToChildren.get(nodeId) || [];
      const b = partner ? (parentToChildren.get(partner) || []) : [];
      return Array.from(new Set([...a, ...b]));
    }
    const cardW = 200; // card width used for spacing calc
    const coupleGap = 36; // horizontal gap between spouses
    function subtreeWidth(nodeId) {
      if (widthMemo.has(nodeId)) return widthMemo.get(nodeId);
      const children = unionChildren(nodeId);
      const partner = spouseOf.get(nodeId);
      if (children.length === 0) {
        const coupleWidth = partner ? cardW * 2 + coupleGap : cardW;
        const w = Math.max(coupleWidth, nodeGap);
        widthMemo.set(nodeId, w);
        return w;
      }
      let sum = 0;
      children.forEach((c, i) => {
        sum += subtreeWidth(c);
        if (i < children.length - 1) sum += nodeGap;
      });
      const coupleWidth = partner ? cardW * 2 + coupleGap : cardW;
      const w = Math.max(sum, coupleWidth);
      widthMemo.set(nodeId, w);
      return w;
    }

    // 2) place nodes without overlap using startX window
    function place(nodeId, depth, startX) {
      const partner = spouseOf.get(nodeId);
      const children = unionChildren(nodeId);
      const myWidth = subtreeWidth(nodeId);
      const center = startX + Math.floor(myWidth / 2);
      if (partner) {
        const halfGap = coupleGap / 2;
        pos.set(nodeId, { x: center - halfGap - cardW, y: 40 + depth * levelGap });
        pos.set(partner, { x: center + halfGap, y: 40 + depth * levelGap });
      } else {
        pos.set(nodeId, { x: center - cardW / 2, y: 40 + depth * levelGap });
      }
      if (children.length === 0) return myWidth;
      let childStart = startX;
      children.forEach((c, i) => {
        const cw = subtreeWidth(c);
        place(c, depth + 1, childStart);
        childStart += cw + nodeGap;
      });
      return myWidth;
    }

    // căn giữa toàn bộ cây theo tổng chiều rộng
    let totalWidth = 0;
    const rootList = (roots.length ? roots : [allIds[0]]);
    rootList.forEach(r => { totalWidth += subtreeWidth(r); });
    totalWidth += nodeGap * Math.max(0, rootList.length - 1);
    let cursor = Math.max(60, Math.floor((window.innerWidth || 1200 - totalWidth) / 2));
    rootList.forEach(r => {
      const w = subtreeWidth(r);
      place(r, 0, cursor);
      cursor += w + nodeGap;
    });

    return pos;
  }, [members, parentToChildren, relations]);

  const nodeSize = { w: 200, h: 80 };

  const onAddClick = useCallback((id) => {
    setTargetId(Number(id));
    setRelationType('child');
    setForm({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
    setSelectedPersons({ person1: null, person2: null });
    setShowForm(true);
  }, []);

  const onAddAtIntersection = useCallback((parentIds) => {
    setTargetId(parentIds);
    setRelationType('child');
    setForm({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
    setSelectedPersons({ person1: null, person2: null });
    setShowForm(true);
  }, []);

  const onAddRelation = useCallback(() => {
    setTargetId(null);
    setRelationType('spouse');
    setForm({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
    setSelectedPersons({ person1: null, person2: null });
    setShowForm(true);
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!activeTree) return;

    let nextMembers = [...members];
    let nextRelations = [...relations];

    if (relationType === 'spouse' && selectedPersons.person1 && selectedPersons.person2) {
      // Add spouse relation between existing members
      nextRelations.push({ from: selectedPersons.person1, to: selectedPersons.person2, type: 'spouse' });
    } else {
      // Add new member
      const nextId = members.length ? Math.max(...members.map(m => m.id)) + 1 : 1;
      const newMember = {
        id: nextId,
        name: form.name || 'Thành viên mới',
        gender: form.gender || '',
        birthDate: form.birthDate || '',
        deathDate: form.deathDate || '', // <-- THÊM MỚI
        avatarUrl: form.avatarUrl || ''   // <-- THÊM MỚI
      };
      nextMembers = [...members, newMember];

      if (relationType === 'child') {
        if (Array.isArray(targetId)) {
          // child of multiple parents
          targetId.forEach(parentId => nextRelations.push({ from: parentId, to: newMember.id, type: 'parent' }));
        } else {
          nextRelations.push({ from: targetId, to: newMember.id, type: 'parent' });
        }
      }
      else if (relationType === 'spouse') nextRelations.push({ from: targetId, to: newMember.id, type: 'spouse' });
      else if (relationType === 'parent') nextRelations.push({ from: newMember.id, to: targetId, type: 'parent' });
    }

    const check = validateRelations(nextMembers, nextRelations);
    if (!check.ok) {
      alert(check.errors[0]);
      return;
    }
    await editTree(activeTree.id, { members: nextMembers, relations: nextRelations });
    setShowForm(false);
  }

  // Normalize canvas to content bounds with padding and apply offset when rendering
  const pad = 100;
  const allPos = Array.from(positions.values());
  const minX = allPos.length ? Math.min(...allPos.map(p => p.x)) : 0;
  const maxX = allPos.length ? Math.max(...allPos.map(p => p.x)) : 800;
  const minY = allPos.length ? Math.min(...allPos.map(p => p.y)) : 0;
  const maxY = allPos.length ? Math.max(...allPos.map(p => p.y)) : 400;
  const offsetX = pad - minX;
  const offsetY = pad - minY;
  const width = (maxX - minX) + nodeSize.w + pad * 2;
  const height = (maxY - minY) + nodeSize.h + pad * 2;

  // Zoom controls
  const [scale, setScale] = useState(1);
  const clamp = (v) => Math.max(0.3, Math.min(3, v));
  function onWheel(e) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => clamp(s + delta));
  }

  return (
    <div className="position-relative border rounded bg-white" style={{ height, minHeight: 480, overflow: 'auto' }} onWheel={onWheel}>
      <div className="position-absolute top-0 end-0 p-2">
        {/* ... (Nút zoom và thêm quan hệ không đổi) ... */}
      </div>
      <div className="position-absolute" style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
        <svg width={width} height={height}>
          {/* ... (Logic vẽ SVG không đổi) ... */}
          {(() => {
            const spousePairs = new Set(relations.filter(r => r.type === 'spouse').map(r => [Math.min(r.from, r.to), Math.max(r.from, r.to)].join('-')));
            const parentsByChild = new Map();
            relations.filter(r => r.type === 'parent').forEach(r => {
              const list = parentsByChild.get(r.to) || [];
              list.push(r.from);
              parentsByChild.set(r.to, list);
            });
            const segments = [];
            parentsByChild.forEach((parents, childId) => {
              const childPos = positions.get(childId);
              if (!childPos) return;
              const y2 = childPos.y + offsetY;
              const x2 = childPos.x + nodeSize.w / 2 + offsetX;
              if (parents.length >= 2) {
                // Only use spouse tee when there are exactly two parents and they are spouses.
                if (parents.length === 2) {
                  const a = parents[0], b = parents[1];
                  const key = [Math.min(a, b), Math.max(a, b)].join('-');
                  if (spousePairs.has(key)) {
                    const pa = positions.get(a), pb = positions.get(b);
                    if (pa && pb) {
                      const midX = Math.round((pa.x + nodeSize.w / 2 + pb.x + nodeSize.w / 2) / 2) + offsetX;
                      const y1 = Math.max(pa.y, pb.y) + nodeSize.h + offsetY;
                      const junctionY = y1 + 28;
                      const d = `M ${midX} ${y1} L ${midX} ${junctionY} L ${x2} ${junctionY} L ${x2} ${y2}`;
                      segments.push(<path key={`pc-${childId}`} d={d} stroke="#5c636a" strokeWidth="2" fill="none" />);
                      return;
                    }
                  }
                }
                // Otherwise draw from each listed parent individually (strictly)
                parents.forEach((pid) => {
                  const p = positions.get(pid);
                  if (!p) return;
                  const x1 = p.x + nodeSize.w / 2 + offsetX;
                  const y1 = p.y + nodeSize.h + offsetY;
                  const junctionY = y1 + 28;
                  const d = `M ${x1} ${y1} L ${x1} ${junctionY} L ${x2} ${junctionY} L ${x2} ${y2}`;
                  segments.push(<path key={`p-${pid}-${childId}`} d={d} stroke="#5c636a" strokeWidth="2" fill="none" />);
                });
                return;
              }
              // Single parent edge
              const p = positions.get(parents[0]);
              if (!p) return;
              const x1 = p.x + nodeSize.w / 2 + offsetX;
              const y1 = p.y + nodeSize.h + offsetY;
              const junctionY = y1 + 28; // fixed drop
              const d = `M ${x1} ${y1} L ${x1} ${junctionY} L ${x2} ${junctionY} L ${x2} ${y2}`;
              segments.push(<path key={`p-${parents[0]}-${childId}`} d={d} stroke="#5c636a" strokeWidth="2" fill="none" />);
            });
            return segments;
          })()}

          {/* Add buttons at intersection points for couples */}
          {(() => {
            const spousePairs = new Set(relations.filter(r => r.type === 'spouse').map(r => [Math.min(r.from, r.to), Math.max(r.from, r.to)].join('-')));
            const addButtons = [];
            spousePairs.forEach(pairKey => {
              const [a, b] = pairKey.split('-').map(Number);
              const pa = positions.get(a), pb = positions.get(b);
              if (!pa || !pb) return;
              const midX = Math.round((pa.x + nodeSize.w / 2 + pb.x + nodeSize.w / 2) / 2) + offsetX;
              const yBase = Math.max(pa.y, pb.y) + nodeSize.h + offsetY;
              const y = yBase + 28; // align plus at junction
              addButtons.push(
                <circle key={`add-${pairKey}`} cx={midX} cy={y} r="12" fill="#007bff" stroke="white" strokeWidth="2"
                  style={{ cursor: 'pointer' }} onClick={() => onAddAtIntersection([a, b])} />
              );
              addButtons.push(
                <text key={`add-text-${pairKey}`} x={midX} y={y + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold"
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}>+</text>
              );
            });
            return addButtons;
          })()}
          {/* Hover quick add for single member */}
          {hoverMemberId && (() => {
            const p = positions.get(hoverMemberId);
            if (!p) return null;
            const cx = p.x + nodeSize.w / 2 + offsetX;
            const cy = p.y + nodeSize.h + offsetY + 28;
            return (
              <g onClick={(e) => { e.stopPropagation(); setQuickMenu({ open: true, x: cx, y: cy, memberId: hoverMemberId }); }} style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r="12" fill="#0d6efd" stroke="white" strokeWidth="2" />
                <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">+</text>
              </g>
            );
          })()}
          {quickMenu.open && (
            <foreignObject x={quickMenu.x - 70} y={quickMenu.y + 16} width="140" height="120">
              <div className="card shadow-sm" style={{ pointerEvents: 'auto' }}>
                <div className="list-group list-group-flush">
                  <button className="list-group-item list-group-item-action" onClick={() => {
                    setTargetId(quickMenu.memberId);
                    setRelationType('child');
                    setForm({ name: '', gender: '', birthDate: '', deathDate: '', avatarUrl: '' });
                    setSelectedPersons({ person1: null, person2: null });
                    setQuickMenu({ open: false, x: 0, y: 0, memberId: null });
                    setShowForm(true);
                  }}>Thêm Con</button>
                  <button className="list-group-item list-group-item-action" onClick={() => {
                    setTargetId(quickMenu.memberId);
                    setRelationType('spouse');
                    setForm({ name: '', gender: '', birthDate: '', deathDate: '', avatarUrl: '' });
                    setSelectedPersons({ person1: null, person2: null });
                    setQuickMenu({ open: false, x: 0, y: 0, memberId: null });
                    setShowForm(true);
                  }}>Thêm Vợ/Chồng</button>
                  <button className="list-group-item list-group-item-action" onClick={() => {
                    setTargetId(quickMenu.memberId);
                    setRelationType('parent');
                    setForm({ name: '', gender: '', birthDate: '', deathDate: '', avatarUrl: '' });
                    setSelectedPersons({ person1: null, person2: null });
                    setQuickMenu({ open: false, x: 0, y: 0, memberId: null });
                    setShowForm(true);
                  }}>Thêm Ba/Mẹ</button>
                </div>
              </div>
            </foreignObject>
          )}
          {relations.filter(r => r.type === 'spouse').map((r, idx) => {
            const p1 = positions.get(r.from);
            const p2 = positions.get(r.to);
            if (!p1 || !p2) return null;
            const x1 = p1.x + nodeSize.w + offsetX;
            const y1 = p1.y + nodeSize.h / 2 + offsetY;
            const x2 = p2.x + offsetX;
            const y2 = p2.y + nodeSize.h / 2 + offsetY;
            return <line key={`s-${idx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5c636a" strokeWidth="2" />;
          })}
        </svg>
      </div>

      {members.map((m) => {
        const p = positions.get(m.id) || { x: 0, y: 0 };
        // Kiểm tra xem người này đã kết hôn chưa
        const isMarried = relations.some(r => r.type === 'spouse' && (r.from === m.id || r.to === m.id));

        return (
          <div key={m.id} className="card shadow-sm position-absolute" style={{ width: nodeSize.w, height: nodeSize.h, left: (p.x + offsetX) * scale, top: (p.y + offsetY) * scale, transform: `scale(${scale})`, transformOrigin: 'top left' }} onMouseEnter={() => setHoverMemberId(m.id)} onMouseLeave={() => setHoverMemberId(prev => prev === m.id ? null : prev)}>
            <div className="card-body p-2">
              <div className="d-flex align-items-center">
                {/* -- THAY ĐỔI BẮT ĐẦU -- */}
                {m.avatarUrl ? (
                  <img src={m.avatarUrl} alt={m.name} className="rounded-circle me-2" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                ) : (
                  <div className={`rounded-circle bg-light me-2 d-flex align-items-center justify-content-center text-muted`} style={{ width: 32, height: 32, fontSize: '1.2rem' }}>
                    {m.gender === 'male' ? '👨' : m.gender === 'female' ? '👩' : '👤'}
                  </div>
                )}
                <div className="flex-grow-1">
                  <div className="fw-semibold small text-truncate" title={m.name}>{m.name}</div>
                  {(m.birthDate || m.deathDate) && (
                    <div className="text-muted small" style={{ lineHeight: 1.2 }}>
                      {m.birthDate ? m.birthDate : '?'}
                      {m.deathDate ? ` - ${m.deathDate}` : ''}
                    </div>
                  )}
                </div>
                {/* -- THAY ĐỔI KẾT THÚC -- */}
                {!isMarried && (
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onAddClick(m.id)} title="Thêm">+</button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {showForm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm thành viên</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <form onSubmit={submit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Quan hệ</label>
                    <select className="form-select" value={relationType} onChange={(e) => setRelationType(e.target.value)}>
                      <option value="child">
                        {Array.isArray(targetId) ? `Con của ${targetId.map(id => members.find(m => m.id === id)?.name).join(' & ')}` : 'Con cái'}
                      </option>
                      <option value="spouse">Vợ/Chồng</option>
                      <option value="parent">Ba/Mẹ</option>
                    </select>
                  </div>

                  {relationType === 'spouse' && !targetId ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Người 1</label>
                        <select className="form-select" value={selectedPersons.person1 || ''} onChange={(e) => setSelectedPersons({ ...selectedPersons, person1: Number(e.target.value) })}>
                          <option value="">Chọn người 1</option>
                          {members.map(m => (
                            <option key={m.id} value={m.id} disabled={selectedPersons.person2 === m.id}>
                              {m.name} {selectedPersons.person2 === m.id ? '(đã chọn)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Người 2</label>
                        <select className="form-select" value={selectedPersons.person2 || ''} onChange={(e) => setSelectedPersons({ ...selectedPersons, person2: Number(e.target.value) })}>
                          <option value="">Chọn người 2</option>
                          {members.map(m => (
                            <option key={m.id} value={m.id} disabled={selectedPersons.person1 === m.id}>
                              {m.name} {selectedPersons.person1 === m.id ? '(đã chọn)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Họ và tên</label>
                        <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Giới tính</label>
                        <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Ngày sinh</label>
                        <input type="date" className="form-control" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
                      </div>
                      {/* -- THAY ĐỔI BẮT ĐẦU -- */}
                      <div className="mb-3">
                        <label className="form-label">Ngày mất</label>
                        <input type="date" className="form-control" value={form.deathDate} onChange={(e) => setForm({ ...form, deathDate: e.target.value })} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">URL Hình ảnh</label>
                        <input type="text" className="form-control" placeholder="https://example.com/avatar.png" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
                      </div>
                      {/* -- THAY ĐỔI KẾT THÚC -- */}
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}