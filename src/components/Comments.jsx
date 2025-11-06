import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Comments({ treeId, memberId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Giả lập load comments từ localStorage
  React.useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(`comments_${treeId}_${memberId}`) || '[]');
    setComments(savedComments);
  }, [treeId, memberId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: user.name,
      authorId: user.id,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${treeId}_${memberId}`, JSON.stringify(updatedComments));
    setNewComment('');
  };

  const deleteComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    // Chỉ cho phép xóa comment của chính mình
    if (!user || comment.authorId !== user.id) return;
    
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments_${treeId}_${memberId}`, JSON.stringify(updatedComments));
  };

  return (
    <div className="border-t mt-3 pt-3">
      <h6 className="mb-3">Bình luận</h6>

      {/* Danh sách bình luận */}
      <div className="mb-3">
        {comments.length === 0 ? (
          <p className="text-muted small">Chưa có bình luận nào</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="d-flex gap-2 mb-2 p-2 bg-light rounded">
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-baseline">
                  <strong className="small">{comment.author}</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mb-0 small">{comment.text}</p>
              </div>
              {user && comment.authorId === user.id && (
                <button
                  className="btn btn-sm text-danger"
                  onClick={() => deleteComment(comment.id)}
                  title="Xóa bình luận"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form thêm bình luận */}
      {user ? (
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Thêm bình luận..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            disabled={!newComment.trim() || isLoading}
          >
            Gửi
          </button>
        </form>
      ) : (
        <p className="text-muted small">
          Vui lòng <a href="/login">đăng nhập</a> để bình luận.
        </p>
      )}
    </div>
  );
}