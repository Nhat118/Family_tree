import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Search } from "lucide-react"; // icon đẹp (lucide-react)

export default function NavBar() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/tree?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          🌳 Cây Gia Phả
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/tree" className="nav-link">Xem Cây</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </li>
            )}
            {user?.role === "admin" && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link">Admin</Link>
              </li>
            )}
          </ul>

          <form onSubmit={handleSearch} className="d-flex me-3" role="search">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Search size={16} /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Tìm kiếm thành viên hoặc cây gia phả..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Tìm</button>
            </div>
          </form>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-secondary small">Xin chào, <strong>{user.name}</strong></span>
                <button onClick={logout} className="btn btn-outline-secondary btn-sm">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary btn-sm">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
