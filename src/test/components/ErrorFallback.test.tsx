import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ErrorFallback,
  CompactErrorFallback,
  NetworkErrorFallback,
  EmptyStateFallback
} from '../../components/common/ErrorFallback';

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true
});

describe('ErrorFallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders basic error fallback', () => {
    const error = new Error('Test error');
    
    render(<ErrorFallback error={error} componentName="TestComponent" />);

    expect(screen.getByText('Error en TestComponent')).toBeInTheDocument();
    expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recargar página/i })).toBeInTheDocument();
  });

  it('shows retry button when resetError is provided', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();
    
    render(<ErrorFallback error={error} resetError={resetError} />);

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(resetError).toHaveBeenCalled();
  });

  it('shows error details when showDetails is true', () => {
    const error = new Error('Test error');
    error.stack = 'Error stack trace';
    
    render(<ErrorFallback error={error} showDetails={true} />);

    expect(screen.getByText('Ver detalles técnicos')).toBeInTheDocument();
    
    // Click to expand details
    fireEvent.click(screen.getByText('Ver detalles técnicos'));
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Error stack trace')).toBeInTheDocument();
  });

  it('reloads page when reload button is clicked', () => {
    const error = new Error('Test error');
    
    render(<ErrorFallback error={error} />);

    const reloadButton = screen.getByRole('button', { name: /recargar página/i });
    fireEvent.click(reloadButton);
    
    expect(mockReload).toHaveBeenCalled();
  });
});

describe('CompactErrorFallback', () => {
  it('renders compact error fallback', () => {
    const error = new Error('Test error');
    
    render(<CompactErrorFallback error={error} componentName="TestSection" />);

    expect(screen.getByText('Error en TestSection')).toBeInTheDocument();
    expect(screen.getByText('Esta sección no está disponible temporalmente')).toBeInTheDocument();
  });

  it('shows retry button when resetError is provided', () => {
    const error = new Error('Test error');
    const resetError = vi.fn();
    
    render(<CompactErrorFallback error={error} resetError={resetError} />);

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(resetError).toHaveBeenCalled();
  });

  it('has appropriate compact styling', () => {
    const error = new Error('Test error');
    const { container } = render(<CompactErrorFallback error={error} />);

    const errorContainer = container.querySelector('.bg-yellow-50');
    expect(errorContainer).toHaveClass('min-h-[100px]');
  });
});

describe('NetworkErrorFallback', () => {
  it('renders network error fallback', () => {
    const error = new Error('Network error');
    
    render(<NetworkErrorFallback error={error} componentName="Datos" />);

    expect(screen.getByText('Problema de conexión')).toBeInTheDocument();
    expect(screen.getByText(/No se pudieron cargar los datos/)).toBeInTheDocument();
  });

  it('shows retry connection button when resetError is provided', () => {
    const error = new Error('Network error');
    const resetError = vi.fn();
    
    render(<NetworkErrorFallback error={error} resetError={resetError} />);

    const retryButton = screen.getByRole('button', { name: /reintentar conexión/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(resetError).toHaveBeenCalled();
  });

  it('has appropriate network error styling', () => {
    const error = new Error('Network error');
    const { container } = render(<NetworkErrorFallback error={error} />);

    const errorContainer = container.querySelector('.bg-blue-50');
    expect(errorContainer).toHaveClass('border-blue-200');
  });
});

describe('EmptyStateFallback', () => {
  it('renders default empty state', () => {
    render(<EmptyStateFallback />);

    expect(screen.getByText('No hay datos disponibles')).toBeInTheDocument();
    expect(screen.getByText('No se encontró información para mostrar en esta sección.')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(
      <EmptyStateFallback
        title="Sin noticias"
        description="No hay noticias disponibles en este momento."
      />
    );

    expect(screen.getByText('Sin noticias')).toBeInTheDocument();
    expect(screen.getByText('No hay noticias disponibles en este momento.')).toBeInTheDocument();
  });

  it('shows action button when provided', () => {
    const action = {
      label: 'Actualizar',
      onClick: vi.fn()
    };
    
    render(<EmptyStateFallback action={action} />);

    const actionButton = screen.getByRole('button', { name: 'Actualizar' });
    expect(actionButton).toBeInTheDocument();
    
    fireEvent.click(actionButton);
    expect(action.onClick).toHaveBeenCalled();
  });

  it('renders custom icon when provided', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    
    render(<EmptyStateFallback icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});