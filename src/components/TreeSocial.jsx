import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSocial } from '../contexts/SocialContext';
import CommentList from './CommentList';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function TreeSocial() {
  const { treeId } = useParams();
  const { getComments, addComment, deleteComment, getActivityLog } = useSocial();
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [treeId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [commentsData, activitiesData] = await Promise.all([
        getComments(treeId),
        getActivityLog(treeId)
      ]);
      setComments(commentsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    try {
      const newComment = await addComment(treeId, content);
      setComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(treeId, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {/* Comments section */}
      <div className="col-md-8 mb-4">
        <div className="card">
          <div className="card-body">
            <CommentList
              comments={comments}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        </div>
      </div>

      {/* Activity log section */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h6 className="mb-3">Hoạt động gần đây</h6>
            <div className="activity-list">
              {activities.length === 0 ? (
                <p className="text-muted text-center">Chưa có hoạt động nào</p>
              ) : (
                activities.map(activity => (
                  <div key={activity.id} className="activity-item mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center mb-1">
                      <img
                        src={activity.userAvatar || '/default-avatar.png'}
                        alt={activity.userName}
                        className="rounded-circle me-2"
                        style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                      />
                      <span className="text-primary">{activity.userName}</span>
                    </div>
                    <p className="mb-1">{activity.description}</p>
                    <small className="text-muted">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: vi })}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}