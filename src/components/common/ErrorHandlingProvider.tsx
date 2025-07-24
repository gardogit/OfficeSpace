import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ErrorMetrics } from '../../utils/errorRecovery';

interface ErrorContextType {
  reportError: (componentName: string, error: Error) => void;
  getErrorStats: () => any;
  clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorContext must be used within an ErrorHandlingProvider');
  }
  return context;
};

interface ErrorHandlingProviderProps {
  children: ReactNode;
  onError?: (componentName: string, error: Error) => void;
}

/**
 * Global error handling provider that manages error reporting and metrics
 */
export const ErrorHandlingProvider: React.FC<ErrorHandlingProviderProps> = ({
  children,
  onError
}) => {
  const [errorMetrics] = useState(() => ErrorMetrics.getInstance());

  const reportError = useCallback((componentName: string, error: Error) => {
    // Record error in metrics
    errorMetrics.recordError(componentName, error, false);
    
    // Call optional error handler
    if (onError) {
      onError(componentName, error);
    }

    // Log error for debugging
    console.error(`Error reported from ${componentName}:`, error);
  }, [errorMetrics, onError]);

  const getErrorStats = useCallback(() => {
    return errorMetrics.getErrorStats();
  }, [errorMetrics]);

  const clearErrors = useCallback(() => {
    errorMetrics.clearMetrics();
  }, [errorMetrics]);

  const contextValue: ErrorContextType = {
    reportError,
    getErrorStats,
    clearErrors
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

/**
 * Hook for components to report errors to the global error handling system
 */
export const useErrorReporting = (componentName: string) => {
  const { reportError } = useErrorContext();

  const reportComponentError = useCallback((error: Error) => {
    reportError(componentName, error);
  }, [reportError, componentName]);

  return { reportError: reportComponentError };
};

/**
 * Higher-order component that wraps components with error reporting
 */
export const withErrorReporting = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const WithErrorReportingComponent = (props: P) => {
    const { reportError } = useErrorReporting(componentName);

    // Create error boundary props
    const errorBoundaryProps = {
      onError: reportError
    };

    return <WrappedComponent {...props} {...errorBoundaryProps} />;
  };

  WithErrorReportingComponent.displayName = `withErrorReporting(${componentName})`;
  return WithErrorReportingComponent;
};