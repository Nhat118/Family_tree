import React from "react";

export default function MemberCard({ member, onEdit }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h6 className="card-title mb-1">{member.name}</h6>
        <div className="text-muted small">{member.birthDate}</div>
        <div className="mt-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => onEdit(member)}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
}
