import { useState, useCallback, useRef } from 'react';
import { ErrorMetrics } from '../utils/errorRecovery';

interface ErrorHandlerOptions {
  componentName: string;
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, attempt: number) => void;
  onRecovery?: (attempt: number) => void;
}

interface ErrorState {
  error: Error | null;
  isRetrying: boolean;
  retryCount: number;
  canRetry: boolean;
}

/**
 * Hook for handling errors with retry logic and metrics
 */
export const useErrorHandler = (options: ErrorHandlerOptions) => {
  const {
    componentName,
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRecovery
  } = options;

  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isRetrying: false,
    retryCount: 0,
    canRetry: true
  });

  const retryTimeoutRef = useRef<number>();
  const errorMetrics = ErrorMetrics.getInstance();

  const handleError = useCallback((error: Error) => {
    const newRetryCount = errorState.retryCount + 1;
    const canRetry = newRetryCount < maxRetries;

    setErrorState({
      error,
      isRetrying: false,
      retryCount: newRetryCount,
      canRetry
    });

    // Record error in metrics
    errorMetrics.recordError(componentName, error, false);

    // Call error callback
    if (onError) {
      onError(error, newRetryCount);
    }

    console.error(`Error in ${componentName} (attempt ${newRetryCount}):`, error);
  }, [componentName, errorState.retryCount, maxRetries, onError, errorMetrics]);

  const retry = useCallback(async (retryFn?: () => Promise<void> | void) => {
    if (!errorState.canRetry || errorState.isRetrying) {
      return;
    }

    setErrorState(prev => ({
      ...prev,
      isRetrying: true
    }));

    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    try {
      // Wait for retry delay
      await new Promise(resolve => {
        retryTimeoutRef.current = setTimeout(resolve, retryDelay * Math.pow(2, errorState.retryCount - 1));
      });

      // Execute retry function if provided
      if (retryFn) {
        await retryFn();
      }

      // Success - reset error state
      setErrorState({
        error: null,
        isRetrying: false,
        retryCount: 0,
        canRetry: true
      });

      // Record successful recovery
      errorMetrics.recordError(componentName, errorState.error!, true);

      // Call recovery callback
      if (onRecovery) {
        onRecovery(errorState.retryCount);
      }

      console.log(`${componentName} recovered after ${errorState.retryCount} attempts`);

    } catch (retryError) {
      // Retry failed - handle the new error
      handleError(retryError instanceof Error ? retryError : new Error('Retry failed'));
    }
  }, [
    errorState.canRetry,
    errorState.isRetrying,
    errorState.retryCount,
    errorState.error,
    retryDelay,
    componentName,
    onRecovery,
    errorMetrics,
    handleError
  ]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isRetrying: false,
      retryCount: 0,
      canRetry: true
    });

    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clearError();
  }, [clearError]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    error: errorState.error,
    isRetrying: errorState.isRetrying,
    retryCount: errorState.retryCount,
    canRetry: errorState.canRetry,
    hasError: errorState.error !== null,
    handleError,
    retry,
    clearError,
    reset,
    cleanup
  };
};

/**
 * Hook for handling async operations with error handling
 */
export const useAsyncErrorHandler = <T>(
  asyncFn: () => Promise<T>,
  options: ErrorHandlerOptions
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const errorHandler = useErrorHandler(options);

  const execute = useCallback(async () => {
    setIsLoading(true);
    errorHandler.clearError();

    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (error) {
      errorHandler.handleError(error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, errorHandler]);

  const retryExecution = useCallback(() => {
    return errorHandler.retry(execute);
  }, [errorHandler, execute]);

  return {
    data,
    isLoading,
    execute,
    ...errorHandler,
    retry: retryExecution
  };
};

/**
 * Hook for handling component-level errors with boundaries
 */
export const useComponentErrorHandler = (componentName: string) => {
  const [errorInfo, setErrorInfo] = useState<{
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
  }>({
    error: null,
    errorInfo: null
  });

  const handleComponentError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setErrorInfo({ error, errorInfo });
    
    // Record in metrics
    const errorMetrics = ErrorMetrics.getInstance();
    errorMetrics.recordError(componentName, error, false);

    // Log detailed error information
    console.error(`Component error in ${componentName}:`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }, [componentName]);

  const resetError = useCallback(() => {
    setErrorInfo({ error: null, errorInfo: null });
  }, []);

  return {
    error: errorInfo.error,
    errorInfo: errorInfo.errorInfo,
    hasError: errorInfo.error !== null,
    handleComponentError,
    resetError
  };
};

/**
 * Hook for handling network-specific errors
 */
export const useNetworkErrorHandler = (componentName: string) => {
  const baseHandler = useErrorHandler({
    componentName,
    maxRetries: 5,
    retryDelay: 2000
  });

  const isNetworkError = useCallback((error: Error): boolean => {
    return error.message.includes('fetch') ||
           error.message.includes('network') ||
           error.message.includes('timeout') ||
           error.name === 'NetworkError' ||
           error.message.includes('Failed to fetch');
  }, []);

  const handleNetworkError = useCallback((error: Error) => {
    if (isNetworkError(error)) {
      console.warn(`Network error in ${componentName}:`, error.message);
    }
    baseHandler.handleError(error);
  }, [isNetworkError, componentName, baseHandler]);

  return {
    ...baseHandler,
    handleError: handleNetworkError,
    isNetworkError
  };
};