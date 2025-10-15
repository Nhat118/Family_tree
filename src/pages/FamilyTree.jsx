import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTree } from "../contexts/TreeContext";
import BinaryTreeCanvas from "../components/BinaryTreeCanvas";
import MemberList from "../components/MemberList";
import { ArrowLeft, Edit3, Trash2, Users, Plus, Settings, List, TreePine } from "lucide-react";

export default function FamilyTree() {
  const { treeId } = useParams();
  const navigate = useNavigate();
  const { trees, activeTree, loading, selectTreeById, editTree, removeTree } = useTree();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", coverUrl: "", description: "" });
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'list'

  // Load tree data when treeId changes
  useEffect(() => {
    if (treeId && trees.length > 0) {
      const tree = trees.find(t => t.id === parseInt(treeId));
      if (tree) {
        selectTreeById(tree.id);
      } else {
        navigate("/tree");
      }
    }
  }, [treeId, trees, selectTreeById, navigate]);

  // Update edit form when activeTree changes
  useEffect(() => {
    if (activeTree) {
      setEditForm({
        title: activeTree.title || "",
        coverUrl: activeTree.coverUrl || "",
        description: activeTree.description || ""
      });
    }
  }, [activeTree]);

  const handleEditTree = async (e) => {
    e.preventDefault();
    if (activeTree) {
      await editTree(activeTree.id, editForm);
      setShowEditForm(false);
    }
  };

  const handleDeleteTree = async () => {
    if (activeTree) {
      await removeTree(activeTree.id);
      navigate("/tree");
    }
  };

  const handleEditMember = async (memberId, memberData) => {
    if (!activeTree) return;
    
    const updatedMembers = activeTree.members.map(member => 
      member.id === memberId ? { ...member, ...memberData } : member
    );
    
    await editTree(activeTree.id, { members: updatedMembers });
  };

  const handleDeleteMember = async (memberId) => {
    if (!activeTree) return;
    
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này? Tất cả quan hệ liên quan cũng sẽ bị xóa.')) {
      const updatedMembers = activeTree.members.filter(member => member.id !== memberId);
      const updatedRelations = activeTree.relations.filter(relation => 
        relation.from !== memberId && relation.to !== memberId
      );
      
      await editTree(activeTree.id, { 
        members: updatedMembers, 
        relations: updatedRelations 
      });
    }
  };

  const handleAddMember = async (memberData) => {
    if (!activeTree) return;
    
    const nextId = activeTree.members.length ? Math.max(...activeTree.members.map(m => m.id)) + 1 : 1;
    const newMember = { 
      id: nextId, 
      name: memberData.name || 'Thành viên mới', 
      gender: memberData.gender || '', 
      birthDate: memberData.birthDate || '' 
    };
    
    const updatedMembers = [...activeTree.members, newMember];
    await editTree(activeTree.id, { members: updatedMembers });
  };

  const memberCount = activeTree?.members?.length || 0;
  const relationCount = activeTree?.relations?.length || 0;

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!activeTree) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          <h4>Không tìm thấy gia phả</h4>
          <p>Gia phả bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/tree" className="btn btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Link to="/tree" className="btn btn-outline-secondary me-3">
                <ArrowLeft size={16} className="me-1" />
                Quay lại
              </Link>
              <div>
                <h1 className="h3 mb-1">{activeTree.title}</h1>
                <div className="text-muted small">
                  Chủ sở hữu: {activeTree.ownerName} • 
                  Tạo ngày: {new Date(activeTree.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
            <div className="btn-group">
              <button 
                className={`btn ${viewMode === 'tree' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('tree')}
                title="Xem sơ đồ cây"
              >
                <TreePine size={16} className="me-1" />
                Sơ đồ
              </button>
              <button 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
                title="Xem danh sách thành viên"
              >
                <List size={16} className="me-1" />
                Danh sách
              </button>
            </div>
            <div className="btn-group ms-2">
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setShowEditForm(true)}
                title="Chỉnh sửa thông tin gia phả"
              >
                <Edit3 size={16} className="me-1" />
                Chỉnh sửa
              </button>
              <button 
                className="btn btn-outline-danger" 
                onClick={() => setShowDeleteConfirm(true)}
                title="Xóa gia phả"
              >
                <Trash2 size={16} className="me-1" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <Users size={24} className="me-2" />
                <div>
                  <div className="h4 mb-0">{memberCount}</div>
                  <div className="small">Thành viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <Settings size={24} className="me-2" />
                <div>
                  <div className="h4 mb-0">{relationCount}</div>
                  <div className="small">Quan hệ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Mô tả</h6>
              <p className="card-text text-muted">
                {activeTree.description || "Chưa có mô tả cho gia phả này."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          {viewMode === 'tree' ? (
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Sơ đồ gia phả</h5>
                <div className="text-muted small">
                  Nhấn vào dấu + để thêm thành viên mới
                </div>
              </div>
              <div className="card-body p-0">
                <BinaryTreeCanvas 
                  members={activeTree.members || []} 
                  relations={activeTree.relations || []} 
                />
              </div>
            </div>
          ) : (
            <MemberList
              members={activeTree.members || []}
              relations={activeTree.relations || []}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onAddMember={handleAddMember}
            />
          )}
        </div>
      </div>

      {/* Edit Tree Modal */}
      {showEditForm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa gia phả</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditForm(false)}></button>
              </div>
              <form onSubmit={handleEditTree}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input 
                      className="form-control" 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL ảnh bìa</label>
                    <input 
                      className="form-control" 
                      value={editForm.coverUrl} 
                      onChange={(e) => setEditForm({ ...editForm, coverUrl: e.target.value })} 
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mô tả</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={editForm.description} 
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                      placeholder="Mô tả về gia phả này..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditForm(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Xác nhận xóa</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa gia phả <strong>"{activeTree.title}"</strong>?</p>
                <div className="alert alert-warning">
                  <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả dữ liệu về thành viên và quan hệ sẽ bị xóa vĩnh viễn.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Hủy
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteTree}>
                  <Trash2 size={16} className="me-1" />
                  Xóa gia phả
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
