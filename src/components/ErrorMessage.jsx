import React from 'react';

export default function ErrorMessage({ 
  error, 
  message = 'Đã có lỗi xảy ra', 
  retryAction,
  className = '' 
}) {
  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h6 className="alert-heading mb-1">{message}</h6>
          {error && process.env.NODE_ENV === 'development' && (
            <div className="text-danger small">
              {error.toString()}
            </div>
          )}
        </div>
        {retryAction && (
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={retryAction}
          >
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
}