import React from "react";
import { Link } from "react-router-dom";
export default function AdminHome() {
  return (
    <div className="container py-4">
      <div className="page-card">
        <h2 className="h5">Bảng quản trị</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Quản lý người dùng</h5>
                <p className="card-text text-muted">Xem danh sách tài khoản, vai trò.</p>
                <Link to="/admin/users" className="btn btn-primary btn-sm">Đi tới</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Quản lý gia phả</h5>
                <p className="card-text text-muted">Duyệt, sửa, xóa các cây gia phả.</p>
                <Link to="/admin/trees" className="btn btn-primary btn-sm">Đi tới</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Báo cáo thống kê</h5>
                <p className="card-text text-muted">Số tài khoản, số gia phả, quan hệ...</p>
                <Link to="/admin/reports" className="btn btn-primary btn-sm">Xem báo cáo</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
