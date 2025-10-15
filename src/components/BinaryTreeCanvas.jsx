import React, { useMemo, useState, useCallback } from "react";
import { useTree } from "../contexts/TreeContext";
import { validateRelations } from "../services/treeService";

// Simple binary-tree layout and rendering using absolute HTML nodes + SVG edges
export default function BinaryTreeCanvas({ members = [], relations = [] }) {
  const { activeTree, editTree } = useTree();
  const [showForm, setShowForm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [relationType, setRelationType] = useState("child");
  const [form, setForm] = useState({ name: "", gender: "", birthDate: "" });
  const [selectedPersons, setSelectedPersons] = useState({ person1: null, person2: null });

  const parentToChildren = useMemo(() => {
    const map = new Map();
    relations.filter(r => r.type === 'parent').forEach(r => {
      const list = map.get(r.from) || [];
      list.push(r.to);
      // order children by birthDate ascending for clearer top-down
      const unique = Array.from(new Set(list));
      unique.sort((a, b) => {
        const da = members.find(m => m.id === a)?.birthDate || '';
        const db = members.find(m => m.id === b)?.birthDate || '';
        return String(da).localeCompare(String(db));
      });
      map.set(r.from, unique);
    });
    return map;
  }, [relations, members]);

  const positions = useMemo(() => {
    const childHasParent = new Set();
    parentToChildren.forEach(list => list.forEach(id => childHasParent.add(id)));
    const allIds = members.map(m => m.id);
    const roots = allIds.filter(id => !childHasParent.has(id));
    // spouse map for pairing
    const spouseOf = new Map();
    relations.filter(r => r.type === 'spouse').forEach(r => {
      spouseOf.set(r.from, r.to);
      spouseOf.set(r.to, r.from);
    });
    const levelGap = 170;
    const nodeGap = 260;
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
    const coupleGap = 24; // horizontal gap between spouses
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

    let cursor = 60;
    (roots.length ? roots : [allIds[0]]).forEach(r => {
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
    setForm({ name: "", gender: "", birthDate: "" });
    setSelectedPersons({ person1: null, person2: null });
    setShowForm(true);
  }, []);

  const onAddAtIntersection = useCallback((parentIds) => {
    setTargetId(parentIds);
    setRelationType('child');
    setForm({ name: "", gender: "", birthDate: "" });
    setSelectedPersons({ person1: null, person2: null });
    setShowForm(true);
  }, []);

  const onAddRelation = useCallback(() => {
    setTargetId(null);
    setRelationType('spouse');
    setForm({ name: "", gender: "", birthDate: "" });
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
      const newMember = { id: nextId, name: form.name || 'Thành viên mới', gender: form.gender || '', birthDate: form.birthDate || '' };
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

  const width = Math.max(...Array.from(positions.values()).map(p => p.x + nodeSize.w/2), 800) + 240;
  const height = Math.max(...Array.from(positions.values()).map(p => p.y + nodeSize.h), 480) + 160;

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
        <div className="btn-group-vertical btn-group-sm">
          <button className="btn btn-outline-secondary" onClick={() => setScale(clamp(scale + 0.2))} title="Phóng to">+</button>
          <button className="btn btn-outline-secondary" onClick={() => setScale(clamp(scale - 0.2))} title="Thu nhỏ">-</button>
          <button className="btn btn-outline-primary" onClick={onAddRelation} title="Thêm quan hệ">👥</button>
        </div>
      </div>
      <div className="position-absolute" style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
      <svg width={width} height={height}>
        {/* Parent-child connectors. If a child has two parents that are spouses, draw from midpoint between parents. */}
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
            const y2 = childPos.y;
            const x2 = childPos.x + nodeSize.w / 2;
            if (parents.length === 2) {
              const a = parents[0], b = parents[1];
              const key = [Math.min(a, b), Math.max(a, b)].join('-');
              const pa = positions.get(a), pb = positions.get(b);
              if (pa && pb && spousePairs.has(key)) {
                const midX = Math.round((pa.x + nodeSize.w / 2 + pb.x + nodeSize.w / 2) / 2);
                const y1 = Math.max(pa.y, pb.y) + nodeSize.h;
                const midY = Math.round((y1 + y2) / 2);
                const d = `M ${midX} ${y1} L ${midX} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
                segments.push(<path key={`pc-${childId}`} d={d} stroke="#5c636a" strokeWidth="2" fill="none" />);
                return;
              }
            }
            // fallback: single parent edge
            const p = positions.get(parents[0]);
            if (!p) return;
            const x1 = p.x + nodeSize.w / 2;
            const y1 = p.y + nodeSize.h;
            const midY = Math.round((y1 + y2) / 2);
            const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
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
            const midX = Math.round((pa.x + nodeSize.w / 2 + pb.x + nodeSize.w / 2) / 2);
            const y = Math.max(pa.y, pb.y) + nodeSize.h;
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
        {relations.filter(r => r.type === 'spouse').map((r, idx) => {
          const p1 = positions.get(r.from);
          const p2 = positions.get(r.to);
          if (!p1 || !p2) return null;
          const x1 = p1.x + nodeSize.w;
          const y1 = p1.y + nodeSize.h / 2;
          const x2 = p2.x;
          const y2 = p2.y + nodeSize.h / 2;
          return <line key={`s-${idx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5c636a" strokeWidth="2" />;
        })}
      </svg>
      </div>

      {members.map((m) => {
        const p = positions.get(m.id) || { x: 0, y: 0 };
        // Kiểm tra xem người này đã kết hôn chưa
        const isMarried = relations.some(r => r.type === 'spouse' && (r.from === m.id || r.to === m.id));
        
        return (
          <div key={m.id} className="card shadow-sm position-absolute" style={{ width: nodeSize.w, height: nodeSize.h, left: p.x * scale, top: p.y * scale, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <div className="card-body p-2">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-light me-2" style={{ width: 32, height: 32 }} />
                <div className="flex-grow-1">
                  <div className="fw-semibold small text-truncate" title={m.name}>{m.name}</div>
                  {m.birthDate && <div className="text-muted small">{m.birthDate}</div>}
                </div>
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
                        <select className="form-select" value={selectedPersons.person1 || ''} onChange={(e) => setSelectedPersons({...selectedPersons, person1: Number(e.target.value)})}>
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
                        <select className="form-select" value={selectedPersons.person2 || ''} onChange={(e) => setSelectedPersons({...selectedPersons, person2: Number(e.target.value)})}>
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


