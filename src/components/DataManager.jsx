import React, { useState, useEffect } from 'react';
import { useTree } from '../contexts/TreeContext';
import { backupTree, getBackups, restoreFromBackup } from '../services/backupService';

export default function DataManager({ treeId }) {
  const { activeTree, editTree } = useTree();
  const [isLoading, setIsLoading] = useState(false);
  const [backups, setBackups] = useState([]);

  useEffect(() => {
    if (treeId) {
      setBackups(getBackups(treeId));
    }
  }, [treeId]);

  const createBackup = async () => {
    try {
      setIsLoading(true);
      await backupTree(treeId);
      setBackups(getBackups(treeId));
      alert('Đã tạo bản sao lưu thành công!');
    } catch (err) {
      alert('Lỗi khi tạo bản sao lưu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (backupId) => {
    if (!window.confirm('Bạn có chắc muốn phục hồi dữ liệu về bản sao lưu này? Dữ liệu hiện tại sẽ bị mất.')) {
      return;
    }

    try {
      setIsLoading(true);
      const restoredTree = await restoreFromBackup(treeId, backupId);
      await editTree(treeId, restoredTree);
      alert('Đã phục hồi dữ liệu thành công!');
    } catch (err) {
      alert('Lỗi khi phục hồi dữ liệu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    if (!activeTree) return;

    const data = {
      ...activeTree,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };

    // Tạo và tải file JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-tree-${activeTree.id}-${new Date().toLocaleDateString('vi-VN')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = async (e) => {
    try {
      setIsLoading(true);
      const file = e.target.files[0];
      if (!file) return;

      const text = await file.text();
      const data = JSON.parse(text);

      // Validate data format
      if (!data.id || !data.title || !Array.isArray(data.members)) {
        throw new Error('Invalid file format');
      }

      // Update tree with imported data
      await editTree(treeId, {
        members: data.members,
        relations: data.relations,
        description: data.description,
        coverUrl: data.coverUrl
      });

      alert('Nhập dữ liệu thành công!');
    } catch (err) {
      alert('Lỗi khi nhập dữ liệu: ' + err.message);
    } finally {
      setIsLoading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="mb-0">Quản lý dữ liệu</h6>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12">
            <h6 className="mb-3">Xuất/Nhập dữ liệu</h6>
          </div>
          <div className="col-md-6">
            <div className="d-grid">
              <button 
                className="btn btn-outline-primary" 
                onClick={exportData}
                disabled={!activeTree || isLoading}
              >
                Xuất dữ liệu (JSON)
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-grid">
              <input
                type="file"
                className="form-control"
                accept=".json"
                onChange={importData}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="col-12">
            <hr />
            <h6 className="mb-3">Sao lưu & Phục hồi</h6>
            <div className="d-flex gap-2 mb-3">
              <button 
                className="btn btn-outline-primary" 
                onClick={createBackup}
                disabled={!activeTree || isLoading}
              >
                Tạo bản sao lưu mới
              </button>
            </div>
            {backups.length > 0 ? (
              <div className="list-group">
                {backups.map((backup, index) => (
                  <div 
                    key={backup.createdAt} 
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-bold">Bản sao lưu #{index + 1}</div>
                      <small className="text-muted">
                        {new Date(backup.createdAt).toLocaleString('vi-VN')}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleRestore(backup.createdAt)}
                      disabled={isLoading}
                    >
                      Phục hồi
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted small">Chưa có bản sao lưu nào</p>
            )}
          </div>
          <div className="col-12">
            <div className="alert alert-info mb-0">
              <strong>Lưu ý:</strong>
              <ul className="mb-0">
                <li>Xuất dữ liệu sẽ tải về file JSON chứa toàn bộ thông tin của cây gia phả</li>
                <li>Nhập dữ liệu sẽ thay thế toàn bộ dữ liệu hiện tại của cây gia phả</li>
                <li>Hệ thống tự động giữ lại 5 bản sao lưu gần nhất</li>
                <li>Phục hồi sẽ khôi phục dữ liệu về thời điểm của bản sao lưu đó</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}