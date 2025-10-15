import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTree } from "../contexts/TreeContext";

export default function TreeView() {
  const navigate = useNavigate();
  const { trees, loading, addTree, editTree, removeTree } = useTree();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", coverUrl: "", description: "" });
  const memberCounts = useMemo(() => Object.fromEntries(trees.map(t => [t.id, t.members?.length || 0])), [trees]);

  function openAdd() {
    setEditing(null);
    setForm({ title: "", coverUrl: "", description: "" });
    setShowForm(true);
  }
  function openEdit(t) {
    setEditing(t);
    setForm({ title: t.title || "", coverUrl: t.coverUrl || "", description: t.description || "" });
    setShowForm(true);
  }
  async function submitForm(e) {
    e.preventDefault();
    if (editing) {
      await editTree(editing.id, form);
    } else {
      await addTree(form);
    }
    setShowForm(false);
  }
  async function confirmDelete(t) {
    if (window.confirm(`Xóa gia phả "${t.title}"?`)) {
      await removeTree(t.id);
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 mb-0">Danh sách gia phả</h2>
        <button className="btn btn-primary" onClick={openAdd}>Thêm gia phả</button>
      </div>

      {loading && <div className="alert alert-info">Đang tải...</div>}

      <div className="row g-3">
        {trees.map((t) => (
          <div className="col-12 col-md-6 col-lg-4" key={t.id}>
            <div className="card h-100">
              {t.coverUrl ? (
                <img src={t.coverUrl} className="card-img-top" alt={t.title} style={{ objectFit: 'cover', height: 160 }} />
              ) : (
                <div className="bg-light" style={{ height: 160 }} />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-1">{t.title}</h5>
                <div className="text-muted small mb-2">Chủ sở hữu: {t.ownerName} • {new Date(t.createdAt).toLocaleDateString()}</div>
                <p className="card-text flex-grow-1">{t.description}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="badge bg-secondary">{memberCounts[t.id]} thành viên</span>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/tree/${t.id}`)}>Phả đồ</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(t)}>Sửa</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(t)}>Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {showForm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? 'Sửa gia phả' : 'Thêm gia phả'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <form onSubmit={submitForm}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ảnh bìa URL</label>
                    <input className="form-control" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
