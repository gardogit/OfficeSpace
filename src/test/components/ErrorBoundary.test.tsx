import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, DashboardErrorBoundary } from '../../components/common/ErrorBoundary';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});

afterAll(() => {
  console.error = originalError;
});

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders default error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
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
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('reloads page when reload button is clicked', () => {
    // Mock window.location.reload
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /recargar página/i });
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalled();
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});

describe('DashboardErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <DashboardErrorBoundary sectionName="Test Section">
        <div>Test content</div>
      </DashboardErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders section-specific error UI when an error occurs', () => {
    render(
      <DashboardErrorBoundary sectionName="Noticias">
        <ThrowError />
      </DashboardErrorBoundary>
    );

    expect(screen.getByText('Error en Noticias')).toBeInTheDocument();
    expect(screen.getByText('Esta sección no está disponible temporalmente')).toBeInTheDocument();
  });

  it('displays correct section name in error message', () => {
    render(
      <DashboardErrorBoundary sectionName="Eventos">
        <ThrowError />
      </DashboardErrorBoundary>
    );

    expect(screen.getByText('Error en Eventos')).toBeInTheDocument();
  });

  it('has appropriate styling for dashboard sections', () => {
    const { container } = render(
      <DashboardErrorBoundary sectionName="Test">
        <ThrowError />
      </DashboardErrorBoundary>
    );

    const errorContainer = container.querySelector('.bg-yellow-50');
    expect(errorContainer).toHaveClass('bg-yellow-50', 'border-yellow-200');
  });
});