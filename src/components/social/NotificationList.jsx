import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function NotificationList({ notifications = [], onMarkAsRead }) {
  return (
    <div className="notification-list">
      {notifications.length === 0 ? (
        <p className="text-muted text-center p-3">Không có thông báo mới</p>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item d-flex align-items-center p-3 border-bottom ${
              !notification.read ? 'bg-light' : ''
            }`}
            onClick={() => onMarkAsRead(notification.id)}
            role="button"
          >
            <div className="flex-shrink-0">
              {notification.type === 'comment' && <i className="bi bi-chat-dots text-primary fs-4"></i>}
              {notification.type === 'share' && <i className="bi bi-share text-success fs-4"></i>}
              {notification.type === 'update' && <i className="bi bi-pencil text-warning fs-4"></i>}
            </div>
            <div className="flex-grow-1 ms-3">
              <p className="mb-1">{notification.message}</p>
              <small className="text-muted">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
              </small>
            </div>
            {!notification.read && (
              <span className="badge bg-primary rounded-pill ms-2"></span>
            )}
          </div>
        ))
      )}
    </div>
  );
}