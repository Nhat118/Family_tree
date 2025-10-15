import React, { useState } from "react";

export default function MemberForm({ initial = {}, onSave }) {
  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    gender: "",
    ...initial,
  });
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  return (
    <form>
      <div className="mb-3">
        <input
          name="name"
          value={form.name}
          onChange={change}
          className="form-control"
          placeholder="Họ và tên"
        />
      </div>
      <div className="mb-3">
        <input
          name="birthDate"
          value={form.birthDate}
          onChange={change}
          type="date"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <select
          name="gender"
          value={form.gender}
          onChange={change}
          className="form-select"
        >
          <option value="">Giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>
      <div className="mb-3">
        <textarea
          name="bio"
          value={form.bio || ""}
          onChange={change}
          className="form-control"
          placeholder="Tiểu sử"
        />
      </div>
      <div className="d-flex gap-2">
        <button
          type="button"
          onClick={() => onSave(form)}
          className="btn btn-success"
        >
          Lưu
        </button>
      </div>
    </form>
  );
}
