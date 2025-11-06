import React, { useState } from 'react';
import Comment from './Comment';

export default function CommentList({ comments = [], onAddComment, onDeleteComment, currentUserId }) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="comments-section">
      <h6 className="mb-3">Bình luận ({comments.length})</h6>
      
      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Thêm bình luận..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!newComment.trim()}
          >
            Gửi
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="text-muted text-center">Chưa có bình luận nào</p>
        ) : (
          comments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onDelete={onDeleteComment}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}