import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // TODO: Gửi lỗi đến service logging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 text-center">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Đã xảy ra lỗi!</h4>
            <p>Rất tiếc, đã có lỗi xảy ra khi hiển thị nội dung này.</p>
            <hr />
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-outline-danger"
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                Quay lại
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3 text-start">
                <summary className="text-danger">Chi tiết lỗi</summary>
                <pre className="mt-2 bg-light p-3 rounded">
                  {this.state.error?.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;