import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    avatarUrl: user?.avatarUrl || ""
  });

  function save(e) {
    e.preventDefault();
    const next = { ...user, ...form };
    localStorage.setItem("cgp_user", JSON.stringify(next));
    window.location.href = "/dashboard";
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Chỉnh sửa hồ sơ</div>
            <form onSubmit={save}>
              <div className="card-body">
                <div className="mb-3 text-center">
                  <img src={form.avatarUrl || 'https://i.pravatar.cc/100'} alt="avatar" className="rounded-circle mb-2" width="100" height="100" />
                  <div className="row g-2">
                    <div className="col-md-8">
                      <input className="form-control" placeholder="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="btn btn-outline-secondary w-100">
                        Tải ảnh lên
                        <input type="file" accept="image/*" hidden onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setForm({ ...form, avatarUrl: reader.result });
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Họ tên</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mật khẩu mới</label>
                  <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
              </div>
              <div className="card-footer d-flex justify-content-end gap-2">
                <a href="/dashboard" className="btn btn-outline-secondary">Hủy</a>
                <button className="btn btn-primary" type="submit">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


