import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTree } from "../contexts/TreeContext";
import AsyncContent from "../components/AsyncContent";
import useAsyncTask from "../hooks/useAsyncTask";

export default function TreeView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trees, loading: initialLoading, addTree, editTree, removeTree } = useTree();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", coverUrl: "", description: "" });
  const memberCounts = useMemo(() => Object.fromEntries(trees.map(t => [t.id, t.members?.length || 0])), [trees]);
  
  const { isLoading: isSubmitting, error: submitError, execute: submitForm } = useAsyncTask(
    async (e) => {
      e.preventDefault();
      if (editing) {
        await editTree(editing.id, form);
      } else {
        await addTree(form);
      }
      setShowForm(false);
    }
  );

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
  const { isLoading: isDeleting, error: deleteError, execute: executeDelete } = useAsyncTask(
    async (tree) => {
      if (window.confirm(`Xóa gia phả "${tree.title}"?`)) {
        await removeTree(tree.id);
      }
    }
  );

  const q = new URLSearchParams(location.search).get('search') || '';
  const filteredTrees = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return trees;
    return trees.filter(t =>
      (t.title || '').toLowerCase().includes(keyword) ||
      (t.description || '').toLowerCase().includes(keyword) ||
      (t.ownerName || '').toLowerCase().includes(keyword)
    );
  }, [trees, q]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 mb-0">Danh sách gia phả</h2>
        <button 
          className="btn btn-primary" 
          onClick={openAdd}
          disabled={isSubmitting}
        >
          Thêm gia phả
        </button>
      </div>

      <AsyncContent
        isLoading={initialLoading}
        error={submitError || deleteError}
        onRetry={() => window.location.reload()}
        loadingText="Đang tải danh sách gia phả..."
        errorText="Không thể tải danh sách gia phả"
      >
        <div className="row g-3">
          {filteredTrees.map((t) => (
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
                    <button className="btn btn-sm btn-outline-danger" onClick={() => executeDelete(t)}>Xóa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
  </div>
  </AsyncContent>

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
