import { useState, useCallback } from 'react';

export default function useAsyncTask(task, options = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await task(...args);
      setData(result);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
      if (options.onFinally) {
        options.onFinally();
      }
    }
  }, [task, options]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset
  };
}