import React, { useEffect, useMemo, useState, useCallback } from "react";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import { useTree } from "../contexts/TreeContext";

function MemberNode({ id, data }) {
  const { onAddClick, isMarried } = data;
  return (
    <div className="card shadow-sm" style={{ width: 180 }}>
      <div className="card-body p-2">
        <div className="d-flex align-items-center">
          {/* -- THAY ĐỔI BẮT ĐẦU -- */}
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.label} className="rounded-circle me-2" style={{ width: 32, height: 32, objectFit: 'cover' }} />
          ) : (
            <div className={`rounded-circle bg-light me-2 d-flex align-items-center justify-content-center text-muted`} style={{ width: 32, height: 32, fontSize: '1.2rem' }}>
              {data.gender === 'male' ? '👨' : data.gender === 'female' ? '👩' : '👤'}
            </div>
          )}
          <div className="flex-grow-1">
            <div className="fw-semibold small text-truncate" title={data.label}>{data.label}</div>
            {(data.birthDate || data.deathDate) && (
              <div className="text-muted small" style={{ lineHeight: 1.2 }}>
                {data.birthDate ? data.birthDate : '?'}
                {data.deathDate ? ` - ${data.deathDate}` : ''}
              </div>
            )}
          </div>
          {/* -- THAY ĐỔI KẾT THÚC -- */}
        </div>
        {!isMarried && (
          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-sm btn-outline-primary" onClick={() => onAddClick(id)} title="Thêm thành viên">+</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TreeCanvas({ members = [], relations = [] }) {
  const { activeTree, editTree } = useTree();
  const [showForm, setShowForm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [relationType, setRelationType] = useState("child"); // child | spouse | parent
  const [form, setForm] = useState({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
  const [layoutMode] = useState('binary'); // fixed binary layout per request

  const onAddClick = useCallback((memberId) => {
    setTargetId(Number(memberId));
    setRelationType("child");
    setForm({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
    setShowForm(true);
  }, []);

  const computeBinaryLayout = useCallback(() => {
    // ... (logic layout không đổi) ...
    const parentToChildren = new Map();
    const childHasParent = new Set();
    relations.filter(r => r.type === 'parent').forEach(r => {
      const list = parentToChildren.get(r.from) || [];
      list.push(r.to);
      parentToChildren.set(r.from, list);
      childHasParent.add(r.to);
    });
    const allIds = members.map(m => m.id);
    const roots = allIds.filter(id => !childHasParent.has(id));
    const levelGap = 150;
    const nodeGap = 240;
    let nextX = 0;
    const pos = new Map();

    function dfs(nodeId, depth) {
      const children = (parentToChildren.get(nodeId) || []).slice(0, 2); // limit to 2 for binary style
      if (children.length === 0) {
        const x = nextX;
        nextX += nodeGap;
        pos.set(nodeId, { x, y: depth * levelGap });
        return x;
      }
      const childXs = children.map(childId => dfs(childId, depth + 1));
      const x = Math.round((Math.min(...childXs) + Math.max(...childXs)) / 2);
      pos.set(nodeId, { x, y: depth * levelGap });
      return x;
    }

    if (roots.length === 0) {
      // fallback: treat first as root
      roots.push(allIds[0]);
    }
    roots.forEach(rootId => dfs(rootId, 0));
    // place spouses next to their partner if missing position
    relations.filter(r => r.type === 'spouse').forEach(({ from, to }) => {
      if (pos.has(from) && !pos.has(to)) {
        const p = pos.get(from);
        pos.set(to, { x: p.x + 160, y: p.y });
      } else if (!pos.has(from) && pos.has(to)) {
        const p = pos.get(to);
        pos.set(from, { x: p.x - 160, y: p.y });
      }
    });
    return pos;
  }, [members, relations]);

  const nodes = useMemo(() => {
    // Tạo map để kiểm tra ai đã kết hôn
    const marriedMembers = new Set();
    relations.filter(r => r.type === 'spouse').forEach(r => {
      marriedMembers.add(r.from);
      marriedMembers.add(r.to);
    });

    if (layoutMode === 'binary') {
      const pos = computeBinaryLayout();
      return members.map((m) => ({
        id: String(m.id),
        type: 'member',
        data: {
          label: m.name,
          birthDate: m.birthDate,
          deathDate: m.deathDate,   // <-- THÊM MỚI
          gender: m.gender,       // <-- THÊM MỚI
          avatarUrl: m.avatarUrl, // <-- THÊM MỚI
          onAddClick,
          isMarried: marriedMembers.has(m.id)
        },
        position: pos.get(m.id) || { x: 0, y: 0 }
      }));
    }
    return members.map((m, idx) => ({
      id: String(m.id),
      type: 'member',
      data: {
        label: m.name,
        birthDate: m.birthDate,
        deathDate: m.deathDate,   // <-- THÊM MỚI
        gender: m.gender,       // <-- THÊM MỚI
        avatarUrl: m.avatarUrl, // <-- THÊM MỚI
        onAddClick,
        isMarried: marriedMembers.has(m.id)
      },
      position: { x: idx * 220, y: 60 },
    }));
  }, [members, onAddClick, layoutMode, relations, computeBinaryLayout]);

  const edges = useMemo(() => relations
    .filter(r => r.type === 'parent' || r.type === 'spouse')
    .map((r, idx) => ({
      id: "e" + idx,
      source: String(r.from),
      target: String(r.to),
      type: r.type === 'parent' ? 'smoothstep' : 'straight',
      animated: false,
      style: r.type === 'spouse' ? { strokeDasharray: '4 4' } : undefined
    })), [relations]);

  const nodeTypes = useMemo(() => ({ member: MemberNode }), []);

  async function submit(e) {
    e.preventDefault();
    if (!activeTree) return;
    const nextId = members.length ? Math.max(...members.map(m => m.id)) + 1 : 1;
    const newMember = {
      id: nextId,
      name: form.name || 'Thành viên mới',
      gender: form.gender || '',
      birthDate: form.birthDate || '',
      deathDate: form.deathDate || '', // <-- THÊM MỚI
      avatarUrl: form.avatarUrl || ''   // <-- THÊM MỚI
    };
    const nextMembers = [...members, newMember];
    let nextRelations = [...relations];
    if (relationType === 'child') {
      nextRelations.push({ from: targetId, to: newMember.id, type: 'parent' });
    } else if (relationType === 'spouse') {
      nextRelations.push({ from: targetId, to: newMember.id, type: 'spouse' });
    } else if (relationType === 'parent') {
      nextRelations.push({ from: newMember.id, to: targetId, type: 'parent' });
    }
    await editTree(activeTree.id, { members: nextMembers, relations: nextRelations });
    setShowForm(false);
  }

  useEffect(() => { }, [members, relations]);

  return (
    <div className="border rounded bg-white" style={{ height: 540 }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
      </ReactFlow>

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
                      <option value="child">Con cái</option>
                      <option value="spouse">Vợ/Chồng</option>
                      <option value="parent">Ba/Mẹ</option>
                    </select>
                  </div>
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