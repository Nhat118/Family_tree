import React, { useEffect, useState } from "react";
import { useTree } from "../contexts/TreeContext";
import { fetchTree } from "../services/treeService";
import MemberCard from "../components/MemberCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { activeTree, setTree } = useTree();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const t = await fetchTree(1);
      setTree(t);
      setLoading(false);
    }
    if (!activeTree) load();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 mb-0">Bảng điều khiển</h2>
        <button className="btn btn-sm btn-primary" onClick={() => nav('/member/edit')}>Thêm thành viên</button>
      </div>
      {loading && <div className="alert alert-info">Đang tải...</div>}
      {activeTree && (
        <div className="row g-3">
          {activeTree.members.map((m) => (
            <div className="col-12 col-md-4" key={m.id}>
              <MemberCard
                member={m}
                onEdit={() => nav(`/member/edit/${m.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
