import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function Comment({ comment, onDelete, currentUserId }) {
  const isAuthor = currentUserId === comment.userId;
  
  return (
    <div className="d-flex mb-3">
      <div className="flex-shrink-0">
        <img
          src={comment.userAvatar || '/default-avatar.png'}
          alt={comment.userName}
          className="rounded-circle"
          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
        />
      </div>
      <div className="flex-grow-1 ms-3">
        <div className="bg-light rounded p-2">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold">{comment.userName}</span>
            <small className="text-muted">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
            </small>
          </div>
          <p className="mb-0">{comment.content}</p>
        </div>
        {isAuthor && (
          <div className="mt-1">
            <button
              className="btn btn-link btn-sm text-danger p-0"
              onClick={() => onDelete(comment.id)}
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}