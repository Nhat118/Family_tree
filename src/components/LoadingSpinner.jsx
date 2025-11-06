import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Đang tải...' }) {
  const spinnerSize = {
    sm: 16,
    md: 24,
    lg: 32,
  }[size];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4">
      <div 
        className="spinner-border text-primary mb-2" 
        role="status"
        style={{ width: spinnerSize, height: spinnerSize }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <div className="text-muted small">{text}</div>}
    </div>
  );
}