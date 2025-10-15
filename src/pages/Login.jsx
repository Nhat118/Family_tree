import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const res = await login(email, password);
    if (res?.user) {
      nav(`/dashboard`);
    } else {
      alert("Đăng nhập thất bại (mock)");
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 480 }}>
      <div className="page-card">
        <h2 className="h5">Đăng nhập</h2>
        <form onSubmit={submit} className="mt-3">
          <div className="mb-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="form-control"
            />
          </div>
          <button className="btn btn-primary">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}
