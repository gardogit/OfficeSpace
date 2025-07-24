import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorHandlingProvider } from '../components/common/ErrorHandlingProvider';
import { ErrorBoundary, DashboardErrorBoundary } from '../components/common/ErrorBoundary';
import { ErrorMonitor } from '../components/common/ErrorMonitor';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { ErrorMetrics } from '../utils/errorRecovery';

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
  console.log = vi.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

// Test component that can throw errors
const TestComponent: React.FC<{ 
  shouldThrow?: boolean; 
  errorMessage?: string;
  useErrorHandling?: boolean;
}> = ({ 
  shouldThrow = false, 
  errorMessage = 'Test error',
  useErrorHandling = false
}) => {
  const errorHandler = useErrorHandler({ componentName: 'TestComponent' });

  const throwError = () => {
    const error = new Error(errorMessage);
    
    if (useErrorHandling) {
      errorHandler.handleError(error);
    } else {
      throw error;
    }
  };

  if (shouldThrow && !useErrorHandling) {
    throwError();
  }

  if (useErrorHandling && errorHandler.hasError) {
    return (
      <div>
        <div>Error: {errorHandler.error?.message}</div>
        <button onClick={() => errorHandler.retry()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Test Component</h1>
      <p>Component is working normally</p>
      {useErrorHandling && (
        <button onClick={throwError}>Trigger Error</button>
      )}
    </div>
  );
};

describe('Complete Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear error metrics
    ErrorMetrics.getInstance().clearMetrics();
  });

  describe('Error Handling Provider Integration', () => {
    it('provides error reporting context to child components', () => {
      const onError = vi.fn();

      render(
        <ErrorHandlingProvider onError={onError}>
          <ErrorBoundary>
            <TestComponent shouldThrow={true} errorMessage="Provider test error" />
          </ErrorBoundary>
        </ErrorHandlingProvider>
      );

      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
      expect(onError).toHaveBeenCalledWith('ErrorBoundary', expect.any(Error));
    });

    it('tracks error metrics across components', () => {
      const TestWithErrorReporting = () => {
        const errorHandler = useErrorHandler({ componentName: 'TestWithErrorReporting' });
        
        return (
          <div>
            <button 
              onClick={() => errorHandler.handleError(new Error('Tracked error'))}
            >
              Trigger Tracked Error
            </button>
            {errorHandler.hasError && <div>Error occurred</div>}
          </div>
        );
      };

      render(
        <ErrorHandlingProvider>
          <TestWithErrorReporting />
        </ErrorHandlingProvider>
      );

      const triggerButton = screen.getByRole('button', { name: /trigger tracked error/i });
      fireEvent.click(triggerButton);

      expect(screen.getByText('Error occurred')).toBeInTheDocument();

      // Check that error was recorded in metrics
      const stats = ErrorMetrics.getInstance().getErrorStats();
      expect(stats.totalErrors).toBe(1);
      expect(stats.componentStats.TestWithErrorReporting).toBe(1);
    });
  });

  describe('Error Monitor Integration', () => {
    it('displays error statistics when visible', () => {
      // First, generate some errors
      const errorMetrics = ErrorMetrics.getInstance();
      errorMetrics.recordError('TestComponent', new Error('Test error 1'), false);
      errorMetrics.recordError('AnotherComponent', new Error('Test error 2'), false);
      errorMetrics.recordError('TestComponent', new Error('Test error 3'), true); // recovered

      render(<ErrorMonitor isVisible={true} />);

      // Should show error count in toggle button
      expect(screen.getByText(/Errors: 2/)).toBeInTheDocument();
    });

    it('allows clearing error metrics', async () => {
      // Generate some errors first
      const errorMetrics = ErrorMetrics.getInstance();
      errorMetrics.recordError('TestComponent', new Error('Test error'), false);

      render(<ErrorMonitor isVisible={true} />);

      // Expand the monitor
      const showDetailsButton = screen.getByRole('button', { name: /show details/i });
      fireEvent.click(showDetailsButton);

      // Should show error count
      expect(screen.getByText('1')).toBeInTheDocument();

      // Clear metrics
      const clearButton = screen.getByRole('button', { name: /clear metrics/i });
      fireEvent.click(clearButton);

      // Should show 0 errors after clearing
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundary Hierarchy', () => {
    it('handles nested error boundaries correctly', () => {
      const NestedComponent = () => {
        throw new Error('Nested component error');
      };

      render(
        <ErrorHandlingProvider>
          <ErrorBoundary>
            <div>
              <h1>Parent Component</h1>
              <DashboardErrorBoundary sectionName="Nested Section">
                <NestedComponent />
              </DashboardErrorBoundary>
            </div>
          </ErrorBoundary>
        </ErrorHandlingProvider>
      );

      // Should show dashboard-specific error (inner boundary catches first)
      expect(screen.getByText('Error en Nested Section')).toBeInTheDocument();
      expect(screen.getByText('Esta sección no está disponible temporalmente')).toBeInTheDocument();
      
      // Parent component should still be visible
      expect(screen.getByText('Parent Component')).toBeInTheDocument();
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('handles multiple consecutive errors with retry', () => {
      render(
        <ErrorHandlingProvider>
          <TestComponent useErrorHandling={true} />
        </ErrorHandlingProvider>
      );

      // Component should render normally initially
      expect(screen.getByText('Test Component')).toBeInTheDocument();

      // Trigger first error
      const errorButton = screen.getByRole('button', { name: /trigger error/i });
      fireEvent.click(errorButton);
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();

      // Retry
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      expect(screen.getByText('Component is working normally')).toBeInTheDocument();

      // Trigger second error
      fireEvent.click(screen.getByRole('button', { name: /trigger error/i }));
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();

      // Should still be able to retry
      fireEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(screen.getByText('Component is working normally')).toBeInTheDocument();
    });

    it('tracks error recovery in metrics', () => {
      const TestWithRecovery = () => {
        const errorHandler = useErrorHandler({ componentName: 'TestWithRecovery' });
        
        return (
          <div>
            <button 
              onClick={() => errorHandler.handleError(new Error('Recoverable error'))}
            >
              Trigger Error
            </button>
            <button 
              onClick={() => errorHandler.retry()}
              disabled={!errorHandler.hasError}
            >
              Retry
            </button>
            {errorHandler.hasError && <div>Error state</div>}
            {!errorHandler.hasError && <div>Normal state</div>}
          </div>
        );
      };

      render(
        <ErrorHandlingProvider>
          <TestWithRecovery />
        </ErrorHandlingProvider>
      );

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger error/i });
      fireEvent.click(errorButton);
      expect(screen.getByText('Error state')).toBeInTheDocument();

      // Retry (simulate recovery)
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);
      expect(screen.getByText('Normal state')).toBeInTheDocument();

      // Check metrics
      const stats = ErrorMetrics.getInstance().getErrorStats();
      expect(stats.totalErrors).toBe(1);
      expect(stats.componentStats.TestWithRecovery).toBe(1);
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels and roles for error states', () => {
      render(
        <ErrorHandlingProvider>
          <ErrorBoundary>
            <TestComponent shouldThrow={true} />
          </ErrorBoundary>
        </ErrorHandlingProvider>
      );

      // Check for aria-hidden attribute on SVG
      const errorIcon = document.querySelector('svg[aria-hidden="true"]');
      expect(errorIcon).toBeInTheDocument();

      const reloadButton = screen.getByRole('button', { name: /recargar página/i });
      expect(reloadButton).toBeInTheDocument();
    });

    it('supports keyboard navigation in error states', () => {
      render(
        <ErrorHandlingProvider>
          <TestComponent useErrorHandling={true} />
        </ErrorHandlingProvider>
      );

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger error/i });
      fireEvent.click(errorButton);

      // Retry button should be focusable
      const retryButton = screen.getByRole('button', { name: /retry/i });
      retryButton.focus();
      expect(retryButton).toHaveFocus();

      // Should work with keyboard
      fireEvent.keyDown(retryButton, { key: 'Enter' });
      
      // Wait for the component to recover
      waitFor(() => {
        expect(screen.getByText('Component is working normally')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Memory', () => {
    it('cleans up error handlers on unmount', () => {
      const TestWithCleanup = () => {
        const errorHandler = useErrorHandler({ componentName: 'TestWithCleanup' });
        
        React.useEffect(() => {
          return () => {
            errorHandler.cleanup();
          };
        }, [errorHandler]);

        return <div>Component with cleanup</div>;
      };

      const { unmount } = render(
        <ErrorHandlingProvider>
          <TestWithCleanup />
        </ErrorHandlingProvider>
      );

      // Component should render normally
      expect(screen.getByText('Component with cleanup')).toBeInTheDocument();

      // Unmount should not cause errors
      expect(() => unmount()).not.toThrow();
    });

    it('limits error metrics storage to prevent memory leaks', () => {
      const errorMetrics = ErrorMetrics.getInstance();
      
      // Generate more than 100 errors (the limit)
      for (let i = 0; i < 150; i++) {
        errorMetrics.recordError('TestComponent', new Error(`Error ${i}`), false);
      }

      const stats = errorMetrics.getErrorStats();
      
      // Should not exceed the limit and should still function
      expect(stats.totalErrors).toBeLessThanOrEqual(100);
      expect(typeof stats.recoveryRate).toBe('number');
    });
  });

  describe('Development vs Production Behavior', () => {
    it('shows error monitor only in development', () => {
      // Mock production environment
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      render(<ErrorMonitor isVisible={true} />);

      // Should not render in production
      expect(screen.queryByText(/Errors:/)).not.toBeInTheDocument();

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('provides detailed error information in development', () => {
      // Ensure we're in development mode
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorHandlingProvider>
          <ErrorBoundary>
            <TestComponent shouldThrow={true} errorMessage="Detailed error for development" />
          </ErrorBoundary>
        </ErrorHandlingProvider>
      );

      // Should show error boundary fallback
      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
      
      // Should log detailed error information
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('ErrorBoundary caught an error:'),
        expect.any(Error),
        expect.any(Object)
      );

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });
  });
});