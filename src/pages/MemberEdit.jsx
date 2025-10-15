import React from "react";
import MemberForm from "../components/MemberForm";
import { useNavigate, useParams } from "react-router-dom";

export default function MemberEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  function save(data) {
    // call API -> update members -> redirect
    console.log("save", data);
    nav("/dashboard");
  }
  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <div className="page-card">
        <h2 className="h5">{id ? "Sửa thành viên" : "Thêm thành viên"}</h2>
        <div className="mt-3">
          <MemberForm onSave={save} />
        </div>
      </div>
    </div>
  );
}
