import React from "react";
import { Link } from "react-router-dom";
export default function AdminHome() {
  return (
    <div className="container py-4">
      <div className="page-card">
        <h2 className="h5">Admin Dashboard</h2>
        <ul className="mt-3 mb-0">
          <li>
            <Link to="/admin/users">Quản lý người dùng</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
