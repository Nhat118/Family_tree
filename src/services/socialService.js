import api from './api';

export const socialService = {
  // Comments
  async getComments(treeId) {
    const response = await api.get(`/trees/${treeId}/comments`);
    return response.data;
  },

  async addComment(treeId, content) {
    const response = await api.post(`/trees/${treeId}/comments`, { content });
    return response.data;
  },

  async deleteComment(treeId, commentId) {
    await api.delete(`/trees/${treeId}/comments/${commentId}`);
  },

  // Sharing
  async shareTree(treeId, shareData) {
    const response = await api.post(`/trees/${treeId}/share`, shareData);
    return response.data;
  },

  async getSharedUsers(treeId) {
    const response = await api.get(`/trees/${treeId}/shared-users`);
    return response.data;
  },

  async updateSharePermission(treeId, userId, permission) {
    const response = await api.put(`/trees/${treeId}/share/${userId}`, { permission });
    return response.data;
  },

  async removeShare(treeId, userId) {
    await api.delete(`/trees/${treeId}/share/${userId}`);
  },

  // Notifications
  async getNotifications() {
    const response = await api.get('/notifications');
    return response.data;
  },

  async markNotificationAsRead(notificationId) {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllNotificationsAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  async deleteNotification(notificationId) {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Activity log
  async getActivityLog(treeId) {
    const response = await api.get(`/trees/${treeId}/activity`);
    return response.data;
  }
};