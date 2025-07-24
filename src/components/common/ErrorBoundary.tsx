import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Algo salió mal
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Ha ocurrido un error inesperado. Por favor, recarga la página o contacta al soporte técnico.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized Error Boundary for dashboard sections
export const DashboardErrorBoundary: React.FC<{ 
  children: ReactNode; 
  sectionName: string;
  onRetry?: () => void;
  showRetry?: boolean;
}> = ({ 
  children, 
  sectionName,
  onRetry,
  showRetry = false
}) => {
  const fallback = (
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
          Error en {sectionName}
        </h4>
        <p className="text-xs text-yellow-700 mb-3">
          Esta sección no está disponible temporalmente
        </p>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={(error, errorInfo) => {
      console.error(`Error in ${sectionName}:`, error, errorInfo);
      // Here you could send error to monitoring service
    }}>
      {children}
    </ErrorBoundary>
  );
};

// Critical Error Boundary for essential app components
export const CriticalErrorBoundary: React.FC<{ 
  children: ReactNode;
  componentName: string;
}> = ({ children, componentName }) => {
  const fallback = (
    <div className="min-h-[300px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-red-400"
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
          Error crítico en {componentName}
        </h3>
        <p className="text-sm text-red-700 mb-4">
          Ha ocurrido un error que impide el funcionamiento normal de esta sección. 
          Por favor, recarga la página o contacta al soporte técnico.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Recargar página
          </button>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary 
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error(`Critical error in ${componentName}:`, error, errorInfo);
        // Here you could send critical error to monitoring service
      }}
    >
      {children}
    </ErrorBoundary>
  );
};