// Service để xử lý backup/restore dữ liệu
export const backupTree = async (treeId) => {
  try {
    // TODO: Implement với API thực tế
    // Hiện tại sử dụng localStorage để demo
    const key = `tree_backup_${treeId}`;
    const currentData = JSON.parse(localStorage.getItem('trees') || '[]');
    const tree = currentData.find(t => t.id === treeId);
    
    if (!tree) throw new Error('Tree not found');

    const backup = {
      tree,
      createdAt: new Date().toISOString(),
      version: '1.0'
    };

    // Lưu backup vào localStorage
    const backups = JSON.parse(localStorage.getItem(key) || '[]');
    backups.unshift(backup); // Thêm vào đầu mảng
    
    // Giới hạn số lượng backup
    const MAX_BACKUPS = 5;
    if (backups.length > MAX_BACKUPS) {
      backups.length = MAX_BACKUPS;
    }

    localStorage.setItem(key, JSON.stringify(backups));
    return backup;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

export const getBackups = (treeId) => {
  try {
    const key = `tree_backup_${treeId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Get backups failed:', error);
    return [];
  }
};

export const restoreFromBackup = async (treeId, backupId) => {
  try {
    const key = `tree_backup_${treeId}`;
    const backups = JSON.parse(localStorage.getItem(key) || '[]');
    const backup = backups.find(b => b.createdAt === backupId);
    
    if (!backup) throw new Error('Backup not found');

    // Restore tree data
    const currentData = JSON.parse(localStorage.getItem('trees') || '[]');
    const treeIndex = currentData.findIndex(t => t.id === treeId);
    
    if (treeIndex === -1) throw new Error('Tree not found');

    currentData[treeIndex] = backup.tree;
    localStorage.setItem('trees', JSON.stringify(currentData));

    return backup.tree;
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
};