import React from "react";

export default function RelationshipEditor({ members = [], onSave }) {
  return (
    <div className="p-3 border rounded bg-white">
      <h4 className="font-medium">Thiết lập mối quan hệ</h4>
      <p className="text-sm mt-2">
        Giao diện chọn hai thành viên và loại quan hệ (ví dụ: cha-con, vợ-chồng)
      </p>
      {/* implement UI: select from/to + type */}
    </div>
  );
}
