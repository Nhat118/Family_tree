import React, { useState } from 'react';

export default function ShareDialog({ onShare, onClose }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view'); // 'view' or 'edit'
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onShare({
      email,
      permission,
      message
    });
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chia sẻ cây gia phả</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email người nhận</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="permission" className="form-label">Quyền truy cập</label>
                <select
                  className="form-select"
                  id="permission"
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                >
                  <option value="view">Chỉ xem</option>
                  <option value="edit">Chỉnh sửa</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">Lời nhắn (tùy chọn)</label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập lời nhắn cho người nhận..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Chia sẻ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}