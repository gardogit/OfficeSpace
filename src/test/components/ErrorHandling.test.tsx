import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { 
  ErrorBoundary, 
  DashboardErrorBoundary, 
  CriticalErrorBoundary 
} from '../../components/common/ErrorBoundary';
import { 
  WithLoadingState, 
  DashboardComponentWrapper, 
  EnhancedErrorBoundary 
} from '../../components/common/WithLoadingState';

import { vi } from 'vitest';

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalWarn = console.warn;
beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Test component that throws an error
const ThrowingComponent: React.FC<{ shouldThrow?: boolean; message?: string }> = ({ 
  shouldThrow = true, 
  message = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>Component rendered successfully</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders default error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recargar página/i })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent message="Custom error message" />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Custom error message' }),
      expect.any(Object)
    );
  });

  it('reloads page when reload button is clicked', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /recargar página/i });
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalled();
  });
});

describe('DashboardErrorBoundary', () => {
  it('renders section-specific error message', () => {
    render(
      <DashboardErrorBoundary sectionName="Test Section">
        <ThrowingComponent />
      </DashboardErrorBoundary>
    );

    expect(screen.getByText('Error en Test Section')).toBeInTheDocument();
    expect(screen.getByText(/Esta sección no está disponible temporalmente/)).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn();

    render(
      <DashboardErrorBoundary sectionName="Test Section" onRetry={onRetry} showRetry={true}>
        <ThrowingComponent />
      </DashboardErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show retry button when showRetry is false', () => {
    const onRetry = jest.fn();

    render(
      <DashboardErrorBoundary sectionName="Test Section" onRetry={onRetry} showRetry={false}>
        <ThrowingComponent />
      </DashboardErrorBoundary>
    );

    expect(screen.queryByRole('button', { name: /reintentar/i })).not.toBeInTheDocument();
  });
});

describe('CriticalErrorBoundary', () => {
  it('renders critical error UI with component name', () => {
    render(
      <CriticalErrorBoundary componentName="MainLayout">
        <ThrowingComponent />
      </CriticalErrorBoundary>
    );

    expect(screen.getByText('Error crítico en MainLayout')).toBeInTheDocument();
    expect(screen.getByText(/Ha ocurrido un error que impide el funcionamiento normal/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recargar página/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /volver atrás/i })).toBeInTheDocument();
  });

  it('handles back button click', () => {
    // Mock window.history.back
    const mockBack = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: mockBack },
      writable: true
    });

    render(
      <CriticalErrorBoundary componentName="MainLayout">
        <ThrowingComponent />
      </CriticalErrorBoundary>
    );

    const backButton = screen.getByRole('button', { name: /volver atrás/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });
});

describe('WithLoadingState', () => {
  it('renders loading component when isLoading is true', () => {
    const loadingComponent = <div>Loading...</div>;

    render(
      <WithLoadingState
        isLoading={true}
        error={null}
        loadingComponent={loadingComponent}
      >
        <div>Content</div>
      </WithLoadingState>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders error component when error exists', () => {
    const error = new Error('Test error');

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={<div>Loading...</div>}
      >
        <div>Content</div>
      </WithLoadingState>
    );

    expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders custom error component when provided', () => {
    const error = new Error('Test error');
    const customErrorComponent = <div>Custom error UI</div>;

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={<div>Loading...</div>}
        errorComponent={customErrorComponent}
      >
        <div>Content</div>
      </WithLoadingState>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
  });

  it('renders children when not loading and no error', () => {
    render(
      <WithLoadingState
        isLoading={false}
        error={null}
        loadingComponent={<div>Loading...</div>}
      >
        <div>Content</div>
      </WithLoadingState>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={<div>Loading...</div>}
        onRetry={onRetry}
      >
        <div>Content</div>
      </WithLoadingState>
    );

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalled();
  });
});

describe('DashboardComponentWrapper', () => {
  it('renders loading component when isLoading is true', () => {
    const loadingComponent = <div>Loading component...</div>;

    render(
      <DashboardComponentWrapper
        isLoading={true}
        error={null}
        loadingComponent={loadingComponent}
        componentName="TestComponent"
      >
        <div>Content</div>
      </DashboardComponentWrapper>
    );

    expect(screen.getByText('Loading component...')).toBeInTheDocument();
  });

  it('renders error UI with component name when error exists', () => {
    const error = new Error('Network error');

    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={error}
        loadingComponent={<div>Loading...</div>}
        componentName="TestComponent"
      >
        <div>Content</div>
      </DashboardComponentWrapper>
    );

    expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();
    expect(screen.getByText(/Problema de conexión/)).toBeInTheDocument();
  });

  it('handles retry with loading state', async () => {
    const error = new Error('Test error');
    const onRetry = jest.fn().mockResolvedValue(undefined);

    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={error}
        loadingComponent={<div>Loading...</div>}
        componentName="TestComponent"
        onRetry={onRetry}
      >
        <div>Content</div>
      </DashboardComponentWrapper>
    );

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    expect(screen.getByText('Reintentando...')).toBeInTheDocument();
    expect(onRetry).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.queryByText('Reintentando...')).not.toBeInTheDocument();
    });
  });
});

describe('EnhancedErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <EnhancedErrorBoundary componentName="TestComponent">
        <div>Test content</div>
      </EnhancedErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    render(
      <EnhancedErrorBoundary componentName="TestComponent">
        <ThrowingComponent />
      </EnhancedErrorBoundary>
    );

    expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <EnhancedErrorBoundary componentName="TestComponent" onError={onError}>
        <ThrowingComponent message="Custom error" />
      </EnhancedErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Custom error' })
    );
  });

  it('retries by re-rendering component', () => {
    let shouldThrow = true;
    const TestComponent = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Success after retry</div>;
    };

    render(
      <EnhancedErrorBoundary componentName="TestComponent">
        <TestComponent />
      </EnhancedErrorBoundary>
    );

    expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();

    // Simulate fixing the error
    shouldThrow = false;

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    expect(screen.getByText('Success after retry')).toBeInTheDocument();
  });

  it('renders custom fallback component when provided', () => {
    const customFallback = <div>Custom fallback UI</div>;

    render(
      <EnhancedErrorBoundary 
        componentName="TestComponent" 
        fallbackComponent={customFallback}
      >
        <ThrowingComponent />
      </EnhancedErrorBoundary>
    );

    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
  });
});

describe('Error Recovery Integration', () => {
  it('handles multiple error types appropriately', () => {
    const networkError = new Error('fetch failed');
    const dataError = new Error('JSON parse error');
    const genericError = new Error('Something went wrong');

    // Test network error
    const { rerender } = render(
      <DashboardComponentWrapper
        isLoading={false}
        error={networkError}
        loadingComponent={<div>Loading...</div>}
        componentName="TestComponent"
      >
        <div>Content</div>
      </DashboardComponentWrapper>
    );

    expect(screen.getByText(/Problema de conexión/)).toBeInTheDocument();

    // Test data error
    rerender(
      <DashboardComponentWrapper
        isLoading={false}
        error={dataError}
        loadingComponent={<div>Loading...</div>}
        componentName="TestComponent"
      >
        <div>Content</div>
      </DashboardComponentWrapper>
    );

    expect(screen.getByText(/Los datos no se pudieron cargar/)).toBeInTheDocument();

    // Test generic error
    rerender(
      <DashboardComponentWrapper
        isLoading={false}
        error={genericError}
        loadingComponent={<div>Loading...</div>}
        componentName="TestComponent"
      >
        <div>Content</div>
      </DashboardComponentWrapper>
    );

    expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
  });

  it('maintains error boundary hierarchy', () => {
    render(
      <CriticalErrorBoundary componentName="App">
        <DashboardErrorBoundary sectionName="Dashboard">
          <EnhancedErrorBoundary componentName="Component">
            <ThrowingComponent />
          </EnhancedErrorBoundary>
        </DashboardErrorBoundary>
      </CriticalErrorBoundary>
    );

    // Should be caught by the innermost boundary
    expect(screen.getByText('Error en Component')).toBeInTheDocument();
  });
});