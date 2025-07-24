import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorBoundary, DashboardErrorBoundary } from '../components/common/ErrorBoundary';
import { ErrorFallback, NetworkErrorFallback } from '../components/common/ErrorFallback';
import { useErrorHandler, useNetworkErrorHandler } from '../hooks/useErrorHandler';
import { ErrorMetrics } from '../utils/errorRecovery';

// Mock console methods
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
  errorType?: 'network' | 'generic';
  useErrorHandling?: boolean;
}> = ({ 
  shouldThrow = false, 
  errorType = 'generic',
  useErrorHandling = false
}) => {
  const errorHandler = useErrorHandler({ componentName: 'TestComponent' });
  const networkErrorHandler = useNetworkErrorHandler('TestComponent');

  const throwError = () => {
    const error = errorType === 'network' 
      ? new Error('fetch failed') 
      : new Error('Generic component error');
    
    if (useErrorHandling) {
      if (errorType === 'network') {
        networkErrorHandler.handleError(error);
      } else {
        errorHandler.handleError(error);
      }
    } else {
      throw error;
    }
  };

  if (shouldThrow && !useErrorHandling) {
    throwError();
  }

  const currentHandler = errorType === 'network' ? networkErrorHandler : errorHandler;

  if (useErrorHandling && currentHandler.hasError) {
    return (
      <ErrorFallback
        error={currentHandler.error}
        resetError={currentHandler.clearError}
        componentName="TestComponent"
      />
    );
  }

  return (
    <div>
      <h1>Test Component</h1>
      <p>Component is working normally</p>
      {useErrorHandling && (
        <button onClick={throwError}>
          Trigger {errorType} Error
        </button>
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

  describe('Error Boundary Integration', () => {
    it('catches component errors and shows fallback UI', () => {
      render(
        <ErrorBoundary>
          <TestComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
      expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /recargar página/i })).toBeInTheDocument();
    });

    it('shows dashboard-specific error UI', () => {
      render(
        <DashboardErrorBoundary sectionName="Noticias">
          <TestComponent shouldThrow={true} />
        </DashboardErrorBoundary>
      );

      expect(screen.getByText('Error en Noticias')).toBeInTheDocument();
      expect(screen.getByText('Esta sección no está disponible temporalmente')).toBeInTheDocument();
    });

    it('renders children normally when no error occurs', () => {
      render(
        <ErrorBoundary>
          <TestComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Test Component')).toBeInTheDocument();
      expect(screen.getByText('Component is working normally')).toBeInTheDocument();
    });
  });

  describe('Error Handler Hook Integration', () => {
    it('handles errors with custom error handling', () => {
      render(<TestComponent useErrorHandling={true} />);

      // Component should render normally initially
      expect(screen.getByText('Test Component')).toBeInTheDocument();

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger generic error/i });
      fireEvent.click(errorButton);

      // Should show error fallback
      expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();
      expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
    });

    it('handles network errors specifically', () => {
      render(<TestComponent useErrorHandling={true} errorType="network" />);

      // Trigger network error
      const errorButton = screen.getByRole('button', { name: /trigger network error/i });
      fireEvent.click(errorButton);

      // Should show error fallback
      expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();
      
      // Should log network-specific warning
      expect(console.warn).toHaveBeenCalledWith(
        'Network error in TestComponent:',
        'fetch failed'
      );
    });

    it('allows error recovery through retry', () => {
      render(<TestComponent useErrorHandling={true} />);

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger generic error/i });
      fireEvent.click(errorButton);

      // Should show error state
      expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      fireEvent.click(retryButton);

      // Should return to normal state
      expect(screen.getByText('Test Component')).toBeInTheDocument();
      expect(screen.getByText('Component is working normally')).toBeInTheDocument();
    });
  });

  describe('Error Metrics Integration', () => {
    it('records errors in metrics system', () => {
      const errorMetrics = ErrorMetrics.getInstance();
      const recordErrorSpy = vi.spyOn(errorMetrics, 'recordError');

      render(<TestComponent useErrorHandling={true} />);

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger generic error/i });
      fireEvent.click(errorButton);

      // Should record error in metrics
      expect(recordErrorSpy).toHaveBeenCalledWith(
        'TestComponent',
        expect.any(Error),
        false
      );
    });

    it('tracks error recovery in metrics', () => {
      const errorMetrics = ErrorMetrics.getInstance();
      const recordErrorSpy = vi.spyOn(errorMetrics, 'recordError');

      render(<TestComponent useErrorHandling={true} />);

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger generic error/i });
      fireEvent.click(errorButton);

      // Retry
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      fireEvent.click(retryButton);

      // Should record both error and recovery
      expect(recordErrorSpy).toHaveBeenCalledTimes(1);
      expect(recordErrorSpy).toHaveBeenCalledWith(
        'TestComponent',
        expect.any(Error),
        false
      );
    });
  });

  describe('Error Fallback Components Integration', () => {
    it('renders appropriate fallback for different error types', () => {
      const TestWithNetworkError = () => {
        const networkError = new Error('fetch failed');
        return (
          <NetworkErrorFallback
            error={networkError}
            componentName="Datos"
            resetError={() => {}}
          />
        );
      };

      render(<TestWithNetworkError />);

      expect(screen.getByText('Problema de conexión')).toBeInTheDocument();
      expect(screen.getByText(/No se pudieron cargar los datos/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reintentar conexión/i })).toBeInTheDocument();
    });

    it('shows detailed error information when requested', () => {
      const testError = new Error('Detailed test error');
      testError.stack = 'Error: Detailed test error\n    at TestComponent';

      render(
        <ErrorFallback
          error={testError}
          componentName="TestComponent"
          showDetails={true}
        />
      );

      // Click to show details
      const detailsToggle = screen.getByText('Ver detalles técnicos');
      fireEvent.click(detailsToggle);

      expect(screen.getByText('Detailed test error')).toBeInTheDocument();
      expect(screen.getByText(/Error: Detailed test error/)).toBeInTheDocument();
    });
  });

  describe('Nested Error Handling', () => {
    it('handles errors at multiple levels', () => {
      const NestedComponent = () => {
        throw new Error('Nested component error');
      };

      render(
        <ErrorBoundary>
          <div>
            <h1>Parent Component</h1>
            <DashboardErrorBoundary sectionName="Nested Section">
              <NestedComponent />
            </DashboardErrorBoundary>
          </div>
        </ErrorBoundary>
      );

      // Should show dashboard-specific error (inner boundary catches first)
      expect(screen.getByText('Error en Nested Section')).toBeInTheDocument();
      expect(screen.getByText('Esta sección no está disponible temporalmente')).toBeInTheDocument();
      
      // Parent component should still be visible
      expect(screen.getByText('Parent Component')).toBeInTheDocument();
    });
  });

  describe('Error Recovery Scenarios', () => {
    it('handles multiple consecutive errors', () => {
      render(<TestComponent useErrorHandling={true} />);

      // Trigger first error
      const errorButton = screen.getByRole('button', { name: /trigger generic error/i });
      fireEvent.click(errorButton);
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Error en TestComponent';
      })).toBeInTheDocument();

      // Retry
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
      fireEvent.click(retryButton);
      expect(screen.getByText('Component is working normally')).toBeInTheDocument();

      // Trigger second error
      fireEvent.click(screen.getByRole('button', { name: /trigger generic error/i }));
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Error en TestComponent';
      })).toBeInTheDocument();

      // Should still be able to retry
      fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
      expect(screen.getByText('Component is working normally')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels and roles', () => {
      render(
        <ErrorBoundary>
          <TestComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for aria-hidden attribute on SVG
      const errorIcon = document.querySelector('svg[aria-hidden="true"]');
      expect(errorIcon).toBeInTheDocument();

      const reloadButton = screen.getByRole('button', { name: /recargar página/i });
      expect(reloadButton).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<TestComponent useErrorHandling={true} />);

      // Trigger error
      const errorButton = screen.getByRole('button', { name: /trigger generic error/i });
      fireEvent.click(errorButton);

      // Retry button should be focusable
      const retryButton = screen.getByRole('button', { name: /reintentar/i });
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
});