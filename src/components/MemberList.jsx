import React, { useMemo, useState } from "react";
import { Edit3, Trash2, UserPlus, Users } from "lucide-react";
import { searchMembers } from "../services/relationService";

export default function MemberList({ members = [], relations = [], onEditMember, onDeleteMember, onAddMember }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({ name: "", gender: "", birthDate: "" });
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => searchMembers(members, query), [members, query]);

  const getMemberRelations = (memberId) => {
    const memberRelations = relations.filter(r => r.from === memberId || r.to === memberId);
    const spouseRelations = memberRelations.filter(r => r.type === 'spouse');
    const parentRelations = memberRelations.filter(r => r.type === 'parent' && r.to === memberId);
    const childRelations = memberRelations.filter(r => r.type === 'parent' && r.from === memberId);
    
    return {
      spouses: spouseRelations.map(r => members.find(m => m.id === (r.from === memberId ? r.to : r.from))).filter(Boolean),
      parents: parentRelations.map(r => members.find(m => m.id === r.from)).filter(Boolean),
      children: childRelations.map(r => members.find(m => m.id === r.to)).filter(Boolean)
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMember) {
      onEditMember(editingMember.id, form);
    } else {
      onAddMember(form);
    }
    setShowAddForm(false);
    setEditingMember(null);
    setForm({ name: "", gender: "", birthDate: "" });
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name || "",
      gender: member.gender || "",
      birthDate: member.birthDate || ""
    });
    setShowAddForm(true);
  };

  const openAdd = () => {
    setEditingMember(null);
    setForm({ name: "", gender: "", birthDate: "" });
    setShowAddForm(true);
  };

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="mb-0">
          <Users size={20} className="me-2" />
          Danh sách thành viên ({members.length})
        </h5>
        <button className="btn btn-primary btn-sm" onClick={openAdd}>
          <UserPlus size={16} className="me-1" />
          Thêm thành viên
        </button>
      </div>
      <div className="card-body p-0">
        <div className="p-3 border-bottom bg-light">
          <input className="form-control" placeholder="Tìm kiếm theo tên, ngày sinh, giới tính..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {members.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <Users size={48} className="mb-2" />
            <p>Chưa có thành viên nào trong gia phả này.</p>
            <button className="btn btn-primary" onClick={openAdd}>
              <UserPlus size={16} className="me-1" />
              Thêm thành viên đầu tiên
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Tên</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>Quan hệ</th>
                  <th width="120">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member) => {
                  const relations = getMemberRelations(member.id);
                  return (
                    <tr key={member.id}>
                      <td>
                        <div className="fw-semibold">{member.name}</div>
                      </td>
                      <td>
                        <span className={`badge ${member.gender === 'male' ? 'bg-primary' : 'bg-pink'}`}>
                          {member.gender === 'male' ? 'Nam' : member.gender === 'female' ? 'Nữ' : 'Chưa xác định'}
                        </span>
                      </td>
                      <td>
                        {member.birthDate ? new Date(member.birthDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </td>
                      <td>
                        <div className="small">
                          {relations.spouses.length > 0 && (
                            <div className="text-success">
                              <strong>Vợ/Chồng:</strong> {relations.spouses.map(s => s.name).join(', ')}
                            </div>
                          )}
                          {relations.parents.length > 0 && (
                            <div className="text-info">
                              <strong>Cha/Mẹ:</strong> {relations.parents.map(p => p.name).join(', ')}
                            </div>
                          )}
                          {relations.children.length > 0 && (
                            <div className="text-warning">
                              <strong>Con:</strong> {relations.children.map(c => c.name).join(', ')}
                            </div>
                          )}
                          {relations.spouses.length === 0 && relations.parents.length === 0 && relations.children.length === 0 && (
                            <span className="text-muted">Chưa có quan hệ</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-outline-primary" 
                            onClick={() => openEdit(member)}
                            title="Chỉnh sửa"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            className="btn btn-outline-danger" 
                            onClick={() => onDeleteMember(member.id)}
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Member Modal */}
      {showAddForm && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowAddForm(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Họ và tên *</label>
                    <input 
                      className="form-control" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      required 
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Giới tính</label>
                    <select 
                      className="form-select" 
                      value={form.gender} 
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ngày sinh</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={form.birthDate} 
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddForm(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMember ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
