import React from 'react';

export default function ShareDialog({ show, onHide, url, title }) {
  const shareUrl = url;
  const shareTitle = `Cây gia phả "${title}"`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Đã sao chép liên kết!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chia sẻ cây gia phả</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Liên kết chia sẻ</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={shareUrl}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={copyLink}
                >
                  Sao chép
                </button>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary flex-grow-1"
                onClick={shareOnFacebook}
              >
                Chia sẻ lên Facebook
              </button>
              <button
                className="btn btn-info flex-grow-1 text-white"
                onClick={shareOnTwitter}
              >
                Chia sẻ lên Twitter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}