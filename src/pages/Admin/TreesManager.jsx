import React, { useEffect, useState } from "react";
import { fetchTrees, deleteTree } from "../../services/treeService";

export default function TreesManager() {
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const t = await fetchTrees();
      setTrees(t);
      setLoading(false);
    })();
  }, []);

  async function remove(id) {
    if (!window.confirm('Xóa cây gia phả này?')) return;
    await deleteTree(id);
    setTrees(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div className="container py-4">
      <div className="page-card">
        <h3 className="h5">Quản lý gia phả</h3>
        {loading ? (
          <div className="alert alert-info mt-3">Đang tải...</div>
        ) : (
          <div className="table-responsive mt-3">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề</th>
                  <th>Chủ sở hữu</th>
                  <th>Thành viên</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {trees.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.title}</td>
                    <td>{t.ownerName}</td>
                    <td>{t.members?.length || 0}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(t.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


