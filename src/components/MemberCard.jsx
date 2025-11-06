import React from "react";

export default function MemberCard({ member, onEdit, onDelete }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex mb-2">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="rounded-circle me-2"
              style={{ width: 48, height: 48, objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-light me-2 d-flex align-items-center justify-content-center"
              style={{ width: 48, height: 48 }}
            >
              {member.gender === "male" ? "👨" : member.gender === "female" ? "👩" : "👤"}
            </div>
          )}
          <div>
            <h6 className="card-title mb-1">{member.name}</h6>
            <div className="text-muted small">
              {member.birthDate}
              {member.deathDate && ` - ${member.deathDate}`}
            </div>
          </div>
        </div>
        
        {(member.occupation || member.education) && (
          <div className="mb-2 small">
            {member.occupation && (
              <div className="text-muted">
                <i className="bi bi-briefcase me-1"></i>
                {member.occupation}
              </div>
            )}
            {member.education && (
              <div className="text-muted">
                <i className="bi bi-mortarboard me-1"></i>
                {member.education}
              </div>
            )}
          </div>
        )}

        {member.bio && (
          <div className="small text-muted mb-2">{member.bio}</div>
        )}

        {member.lifeEvents?.length > 0 && (
          <div className="mb-2">
            <div className="small fw-bold mb-1">Sự kiện quan trọng</div>
            <div className="small">
              {member.lifeEvents
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event) => (
                  <div key={event.id} className="text-muted">
                    {event.date}: {event.description}
                  </div>
                ))}
            </div>
          </div>
        )}

        {member.photos?.length > 0 && (
          <div className="mb-2">
            <div className="small fw-bold mb-1">Ảnh</div>
            <div className="d-flex gap-1 flex-wrap">
              {member.photos.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt=""
                  className="rounded"
                  style={{ width: 40, height: 40, objectFit: "cover" }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 d-flex gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(member)}
          >
            <i className="bi bi-pencil me-1"></i>
            Sửa
          </button>
          {onDelete && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                if (window.confirm("Bạn có chắc muốn xóa thành viên này?")) {
                  onDelete(member);
                }
              }}
            >
              <i className="bi bi-trash me-1"></i>
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
