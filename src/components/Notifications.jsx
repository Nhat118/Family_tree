import React from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  // Giả lập load thông báo từ localStorage
  React.useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  // Thêm thông báo mới (để test)
  const addTestNotification = () => {
    const newNotification = {
      id: Date.now(),
      title: 'Thông báo mới',
      message: 'Đây là thông báo test',
      createdAt: new Date().toISOString(),
      read: false
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setUnreadCount(unreadCount + 1);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-link position-relative p-0 border-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu show" style={{ minWidth: 320 }}>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <h6 className="mb-0">Thông báo</h6>
            {unreadCount > 0 && (
              <button
                className="btn btn-link btn-sm p-0 text-decoration-none"
                onClick={markAllAsRead}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div className="p-3 text-center text-muted">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`d-flex gap-2 p-3 border-bottom ${
                    !notification.read ? 'bg-light' : ''
                  }`}
                >
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <strong>{notification.title}</strong>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="mb-0 small">{notification.message}</p>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {!notification.read && (
                      <button
                        className="btn btn-link btn-sm p-0"
                        onClick={() => markAsRead(notification.id)}
                        title="Đánh dấu đã đọc"
                      >
                        <i className="bi bi-check2"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-link btn-sm p-0 text-danger"
                      onClick={() => deleteNotification(notification.id)}
                      title="Xóa thông báo"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Button để thêm thông báo test */}
          <div className="p-2 border-top">
            <button
              className="btn btn-sm btn-primary w-100"
              onClick={addTestNotification}
            >
              Thêm thông báo test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}