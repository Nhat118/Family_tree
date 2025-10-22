import React, { useEffect, useMemo, useState } from "react";
import { fetchTrees } from "../../services/treeService";
import { fetchUsers } from "../../services/userService";

export default function Reports() {
  const [trees, setTrees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [t, u] = await Promise.all([fetchTrees(), fetchUsers()]);
      setTrees(t);
      setUsers(u);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const numTrees = trees.length;
    const numMembers = trees.reduce((sum, t) => sum + (t.members?.length || 0), 0);
    const numRelations = trees.reduce((sum, t) => sum + (t.relations?.length || 0), 0);
    const numUsers = users.length;
    return { numTrees, numMembers, numRelations, numUsers };
  }, [trees, users]);

  return (
    <div className="container py-4">
      <div className="page-card">
        <h3 className="h5">Báo cáo thống kê</h3>
        {loading ? (
          <div className="alert alert-info mt-3">Đang tải...</div>
        ) : (
          <div className="row g-3 mt-1">
            <div className="col-md-3">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <div className="h4 mb-1">{stats.numUsers}</div>
                  <div className="small">Tài khoản</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-bg-success">
                <div className="card-body">
                  <div className="h4 mb-1">{stats.numTrees}</div>
                  <div className="small">Gia phả</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-bg-info">
                <div className="card-body">
                  <div className="h4 mb-1">{stats.numMembers}</div>
                  <div className="small">Thành viên</div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-bg-warning">
                <div className="card-body">
                  <div className="h4 mb-1">{stats.numRelations}</div>
                  <div className="small">Quan hệ</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


