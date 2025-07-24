import React, { ReactNode, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { getUserFriendlyErrorMessage, getRecoveryStrategy } from '../../utils/errorRecovery';

interface WithLoadingStateProps {
  isLoading: boolean;
  error: Error | null;
  loadingComponent: ReactNode;
  errorComponent?: ReactNode;
  children: ReactNode;
  onRetry?: () => void;
}

export const WithLoadingState: React.FC<WithLoadingStateProps> = ({
  isLoading,
  error,
  loadingComponent,
  errorComponent,
  children,
  onRetry,
}) => {
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    return (
      <div className="min-h-[200px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Error al cargar datos
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

// Specialized loading wrapper for dashboard components
export const DashboardComponentWrapper: React.FC<{
  isLoading: boolean;
  error: Error | null;
  loadingComponent: ReactNode;
  children: ReactNode;
  componentName: string;
  onRetry?: () => void;
}> = ({ isLoading, error, loadingComponent, children, componentName, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const errorComponent = error ? (
    <div className="min-h-[150px] flex items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h4 className="text-sm font-medium text-yellow-900 mb-1">
          Error en {componentName}
        </h4>
        <p className="text-xs text-yellow-700 mb-3">
          {getUserFriendlyErrorMessage(error)}
        </p>
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRetrying ? 'Reintentando...' : 'Reintentar'}
          </button>
        )}
      </div>
    </div>
  ) : null;

  return (
    <WithLoadingState
      isLoading={isLoading || isRetrying}
      error={error}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      onRetry={handleRetry}
    >
      {children}
    </WithLoadingState>
  );
};

// Enhanced error boundary wrapper with recovery
export const EnhancedErrorBoundary: React.FC<{
  children: ReactNode;
  componentName: string;
  fallbackComponent?: ReactNode;
  onError?: (error: Error) => void;
}> = ({ children, componentName, fallbackComponent, onError }) => {
  const [retryKey, setRetryKey] = useState(0);

  const handleError = (error: Error) => {
    console.error(`Error in ${componentName}:`, error);
    if (onError) {
      onError(error);
    }
  };

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  const recovery = error ? getRecoveryStrategy(error, componentName) : null;

  const defaultFallback = (
    <div className="min-h-[200px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Error en {componentName}
        </h3>
        <p className="text-sm text-red-700 mb-4">
          Esta sección no está funcionando correctamente
        </p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      key={retryKey}
      fallback={fallbackComponent || defaultFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};