import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 col-lg-8">
          <div className="card mb-3">
            <div className="card-header">Trang cá nhân</div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <img src={user?.avatarUrl || 'https://i.pravatar.cc/80'} alt="avatar" className="rounded-circle" width="64" height="64" />
                <div>
                  <div className="h5 mb-1">{user?.name}</div>
                  <div className="text-muted small">{user?.email}</div>
                </div>
                <div className="ms-auto">
                  <button className="btn btn-primary btn-sm" onClick={() => nav('/profile')}>Chỉnh sửa hồ sơ</button>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Hành động nhanh</div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button className="btn btn-outline-primary" onClick={() => nav('/tree')}>Quản lý gia phả</button>
              <button className="btn btn-outline-secondary" onClick={() => nav('/tree?search=')}>Tìm kiếm</button>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card">
            <div className="card-header">Thông báo</div>
            <div className="card-body text-muted">Chưa có thông báo.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
