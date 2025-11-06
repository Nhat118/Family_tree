import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function AsyncContent({
  isLoading,
  error,
  onRetry,
  loadingText,
  errorText,
  spinnerSize = 'md',
  children
}) {
  if (isLoading) {
    return <LoadingSpinner size={spinnerSize} text={loadingText} />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        message={errorText}
        retryAction={onRetry}
      />
    );
  }

  return children;
}