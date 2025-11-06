import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socialService } from '../services/socialService';
import { useAuth } from './AuthContext';

const SocialContext = createContext();

export function SocialProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await socialService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Comments functions
  const getComments = useCallback(async (treeId) => {
    try {
      return await socialService.getComments(treeId);
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }, []);

  const addComment = useCallback(async (treeId, content) => {
    try {
      const newComment = await socialService.addComment(treeId, content);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, []);

  const deleteComment = useCallback(async (treeId, commentId) => {
    try {
      await socialService.deleteComment(treeId, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }, []);

  // Share functions
  const shareTree = useCallback(async (treeId, shareData) => {
    try {
      const result = await socialService.shareTree(treeId, shareData);
      return result;
    } catch (error) {
      console.error('Error sharing tree:', error);
      throw error;
    }
  }, []);

  const getSharedUsers = useCallback(async (treeId) => {
    try {
      return await socialService.getSharedUsers(treeId);
    } catch (error) {
      console.error('Error getting shared users:', error);
      throw error;
    }
  }, []);

  // Notification functions
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await socialService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await socialService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }, []);

  // Activity log
  const getActivityLog = useCallback(async (treeId) => {
    try {
      return await socialService.getActivityLog(treeId);
    } catch (error) {
      console.error('Error getting activity log:', error);
      throw error;
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    getComments,
    addComment,
    deleteComment,
    shareTree,
    getSharedUsers,
    markAsRead,
    markAllAsRead,
    getActivityLog
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}