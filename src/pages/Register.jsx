import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  async function submit(e) {
    e.preventDefault();
    await register(form);
    nav("/login");
  }
  return (
    <div className="container py-4" style={{ maxWidth: 480 }}>
      <div className="page-card">
        <h2 className="h5">Đăng ký</h2>
        <form onSubmit={submit} className="mt-3">
          <div className="mb-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Họ và tên"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mật khẩu"
              className="form-control"
            />
          </div>
          <button className="btn btn-success">Đăng ký</button>
        </form>
      </div>
    </div>
  );
}
