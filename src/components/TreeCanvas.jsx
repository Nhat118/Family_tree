import React, { useEffect, useMemo, useState, useCallback } from "react";
import ReactFlow, { Background, MarkerType, Handle } from "reactflow";
import "reactflow/dist/style.css";
import { useTree } from "../contexts/TreeContext";

function MemberNode({ id, data }) {
  const { onAddClick, isMarried, onDivorceClick } = data;
  const isMale = data.gender === 'male';
  const accent = isMale ? '#0d6efd' : '#d63384'; // blue / pink
  const accentSoft = isMale ? '#e7f1ff' : '#fde7f3';
  const avatarBg = isMale ? '#cfe2ff' : '#ffd6e7';

  // Render full dates (DD/MM/YYYY - DD/MM/YYYY)
  const fmt = (d) => {
    if (!d) return '';
    // Expecting ISO yyyy-mm-dd; fallback to raw string
    const s = String(d);
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const [y, m, day] = s.split('T')[0].split('-');
      return `${day}/${m}/${y}`;
    }
    return s;
  };
  const dateLine = `${fmt(data.birthDate) || '?'}` + (data.deathDate ? ` - ${fmt(data.deathDate)}` : '');

  return (
    <div
      className="shadow-sm"
      style={{
        width: 200,
        background: '#fff',
        borderRadius: 12,
        border: `2px solid ${accentSoft}`,
      }}
    >
      <div className="p-2">
        <div className="d-flex align-items-center">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt={data.label} className="rounded-circle me-2" style={{ width: 36, height: 36, objectFit: 'cover', border: `2px solid ${accentSoft}` }} />
          ) : (
            <div
              className="rounded-circle me-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, background: avatarBg, color: '#fff', fontSize: '1.1rem' }}
            >
              {isMale ? '👨' : data.gender === 'female' ? '👩' : '👤'}
            </div>
          )}
          <div className="flex-grow-1">
            <div className="fw-semibold text-truncate" title={data.label} style={{ fontSize: 14 }}>{data.label}</div>
            <div className="small" style={{ color: '#6c757d', lineHeight: 1.2 }}>{dateLine}</div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2">
          <span
            className="badge rounded-pill"
            style={{ background: accentSoft, color: accent, border: `1px solid ${accent}`, fontWeight: 600 }}
          >
            {isMale ? 'Nam' : data.gender === 'female' ? 'Nữ' : 'Khác'}
          </span>
          <div className="d-flex gap-2">
            {!isMarried && (
              <button className="btn btn-sm btn-outline-primary" onClick={() => onAddClick(id)} title="Thêm thành viên">+</button>
            )}
            {isMarried && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDivorceClick(id)} title="Ly hôn">Ly hôn</button>
            )}
          </div>
        </div>
      </div>
      {/* Nút/điểm kết nối để kéo dây nối sang người khác */}
      <Handle type="source" position="right" id="out" style={{ background: accent, width: 10, height: 10 }} />
      <Handle type="target" position="left" id="in" style={{ background: accent, width: 10, height: 10 }} />
    </div>
  );
}

export default function TreeCanvas({ members = [], relations = [] }) {
  const { activeTree, editTree } = useTree();
  const [showForm, setShowForm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [relationType, setRelationType] = useState("child"); // child | spouse | parent
  const [form, setForm] = useState({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
  const [recentEdge, setRecentEdge] = useState(null); // { from, to, type }
  const [manualEdges, setManualEdges] = useState([]); // các cạnh vẽ thủ công bằng kéo thả

  const onAddClick = useCallback((memberId) => {
    setTargetId(Number(memberId));
    setRelationType("child");
    setForm({ name: "", gender: "", birthDate: "", deathDate: "", avatarUrl: "" });
    setShowForm(true);
  }, []);

  const computeBinaryLayout = useCallback(() => {
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
      // If node already positioned (e.g., shared child with two parents), reuse its x to avoid re-traversal
      if (pos.has(nodeId)) {
        return pos.get(nodeId).x;
      }
      const children = (parentToChildren.get(nodeId) || []);
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

    if (roots.length === 0 && allIds.length) {
      roots.push(allIds[0]);
    }
    roots.forEach(rootId => dfs(rootId, 0));
    // place spouses near their partner if missing
    relations.filter(r => r.type === 'spouse' || r.type === 'divorced').forEach(({ from, to }) => {
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

  const handleDivorce = useCallback(async (memberId) => {
    if (!activeTree) return;
    if (!window.confirm('Xác nhận ly hôn?')) return;
    const nextRelations = relations.map(r => {
      if (r.type === 'spouse' && (r.from === memberId || r.to === memberId)) {
        return { ...r, type: 'divorced' };
      }
      return r;
    });
    await editTree(activeTree.id, { relations: nextRelations });
  }, [relations, editTree, activeTree]);

  const nodes = useMemo(() => {
    const marriedMembers = new Set();
    relations.filter(r => r.type === 'spouse').forEach(r => {
      marriedMembers.add(r.from);
      marriedMembers.add(r.to);
    });

    const pos = computeBinaryLayout();
    return members.map((m) => ({
      id: String(m.id),
      type: 'member',
      data: {
        label: m.name,
        birthDate: m.birthDate,
        deathDate: m.deathDate,
        gender: m.gender,
        avatarUrl: m.avatarUrl,
        onAddClick,
        isMarried: marriedMembers.has(m.id),
        onDivorceClick: handleDivorce
      },
      // Ưu tiên vị trí đã lưu, nếu chưa có thì dùng layout tự động
      position: (activeTree?.positions && activeTree.positions[m.id]) || pos.get(m.id) || { x: 0, y: 0 }
    }));
  }, [members, relations, computeBinaryLayout, onAddClick, handleDivorce, activeTree]);

  const handleNodeDragStop = useCallback(async (_e, node) => {
    if (!activeTree) return;
    const memberId = Number(node.id);
    const nextPositions = { ...(activeTree.positions || {}) };
    nextPositions[memberId] = { x: node.position.x, y: node.position.y };
    await editTree(activeTree.id, { positions: nextPositions });
  }, [activeTree, editTree]);

  const onConnect = useCallback((params) => {
    const from = Number(params.source);
    const to = Number(params.target);
    // Vẽ đường chỉ thủ công (không lưu vào dữ liệu cây)
    const e = { from, to, type: 'manual' };
    setManualEdges((prev) => [...prev, e]);
    setRecentEdge(e);
    setTimeout(() => setRecentEdge(null), 2500);
  }, []);

  const edges = useMemo(() => {
    // Bắt đầu từ danh sách quan hệ hiện có
    const base = relations.filter(r => r.type === 'parent' || r.type === 'spouse' || r.type === 'divorced');
    // Thêm các cạnh thủ công (manual) để hiển thị cùng
    const extended = [...base, ...manualEdges];
    // Đảm bảo cạnh vừa tạo luôn được render ngay cả khi state chưa kịp cập nhật
    const list = recentEdge && !extended.some(r => r.from === recentEdge.from && r.to === recentEdge.to && r.type === recentEdge.type)
      ? [...extended, recentEdge]
      : extended;

    return list.map((r, idx) => ({
      id: "e" + idx,
      source: String(r.from),
      target: String(r.to),
      type: r.type === 'parent' ? 'smoothstep' : 'straight',
      // Nếu là cạnh vừa tạo, tô nổi bật và animate trong thời gian ngắn
      animated: recentEdge && recentEdge.from === r.from && recentEdge.to === r.to && recentEdge.type === r.type ? true : false,
      style: (() => {
        // Ưu tiên highlight cạnh vừa tạo (mọi loại)
        if (recentEdge && recentEdge.from === r.from && recentEdge.to === r.to && recentEdge.type === r.type) {
          return { stroke: '#0d6efd', strokeWidth: 4 };
        }
        // Mặc định các loại cạnh khác
        if (r.type === 'spouse') return { strokeDasharray: '4 4', stroke: '#6c757d' };
        if (r.type === 'divorced') return { stroke: '#dc3545', strokeDasharray: '6 4' };
        if (r.type === 'manual') return { stroke: '#0d6efd', strokeWidth: 2.5 };
        if (r.type === 'parent') return { stroke: '#6c757d', strokeWidth: 2 };
        return { stroke: '#6c757d' };
      })(),
      markerEnd: (() => {
        // Gắn mũi tên cho quan hệ cha–con để dễ nhận biết hướng
        if (r.type === 'parent' || r.type === 'manual' || (recentEdge && recentEdge.from === r.from && recentEdge.to === r.to && recentEdge.type === r.type)) {
          return { type: MarkerType.ArrowClosed, color: '#0d6efd' };
        }
        return undefined;
      })()
    }));
  }, [relations, manualEdges, recentEdge]);

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
      deathDate: form.deathDate || '',
      avatarUrl: form.avatarUrl || ''
    };
    const nextMembers = [...members, newMember];
    let nextRelations = [...relations];
    let createdEdge = null;
    if (relationType === 'child') {
      createdEdge = { from: targetId, to: newMember.id, type: 'parent' };
      nextRelations.push(createdEdge);
    } else if (relationType === 'spouse') {
      createdEdge = { from: targetId, to: newMember.id, type: 'spouse' };
      nextRelations.push(createdEdge);
    } else if (relationType === 'parent') {
      createdEdge = { from: newMember.id, to: targetId, type: 'parent' };
      nextRelations.push(createdEdge);
    }
    await editTree(activeTree.id, { members: nextMembers, relations: nextRelations });
    if (createdEdge) {
      setRecentEdge(createdEdge);
      // Xóa highlight sau 2.5 giây
      setTimeout(() => setRecentEdge(null), 2500);
    }
    setShowForm(false);
  }

  useEffect(() => { }, [members, relations]);

  return (
    <div className="border rounded bg-white" style={{ height: 540 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeDragStop={handleNodeDragStop}
        onConnect={onConnect}
      >
        <Background color="#eee" gap={16} />
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
                  <div className="mb-3">
                    <label className="form-label">Ngày mất</label>
                    <input type="date" className="form-control" value={form.deathDate} onChange={(e) => setForm({ ...form, deathDate: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL Hình ảnh</label>
                    <input type="text" className="form-control" placeholder="https://example.com/avatar.png" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
                  </div>
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
