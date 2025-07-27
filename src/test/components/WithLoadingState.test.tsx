import { render, screen, fireEvent } from '@testing-library/react';
import { WithLoadingState, DashboardComponentWrapper } from '../../components/common/WithLoadingState';

describe('WithLoadingState', () => {
  const mockChildren = <div>Test content</div>;
  const mockLoadingComponent = <div>Loading...</div>;

  it('renders loading component when isLoading is true', () => {
    render(
      <WithLoadingState
        isLoading={true}
        error={null}
        loadingComponent={mockLoadingComponent}
      >
        {mockChildren}
      </WithLoadingState>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('renders children when not loading and no error', () => {
    render(
      <WithLoadingState
        isLoading={false}
        error={null}
        loadingComponent={mockLoadingComponent}
      >
        {mockChildren}
      </WithLoadingState>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders default error UI when error exists', () => {
    const error = new Error('Test error message');

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
      >
        {mockChildren}
      </WithLoadingState>
    );

    expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.queryByText('Test content')).not.toBeInTheDocument();
  });

  it('renders custom error component when provided', () => {
    const error = new Error('Test error');
    const customErrorComponent = <div>Custom error UI</div>;

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
        errorComponent={customErrorComponent}
      >
        {mockChildren}
      </WithLoadingState>
    );

    expect(screen.getByText('Custom error UI')).toBeInTheDocument();
    expect(screen.queryByText('Error al cargar datos')).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
        onRetry={onRetry}
      >
        {mockChildren}
      </WithLoadingState>
    );

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalled();
  });

  it('does not show retry button when onRetry is not provided', () => {
    const error = new Error('Test error');

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
      >
        {mockChildren}
      </WithLoadingState>
    );

    expect(screen.queryByRole('button', { name: /reintentar/i })).not.toBeInTheDocument();
  });

  it('shows generic error message when error has no message', () => {
    const error = new Error();

    render(
      <WithLoadingState
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
      >
        {mockChildren}
      </WithLoadingState>
    );

    expect(screen.getByText('Ha ocurrido un error inesperado')).toBeInTheDocument();
  });
});

describe('DashboardComponentWrapper', () => {
  const mockChildren = <div>Dashboard content</div>;
  const mockLoadingComponent = <div>Loading dashboard...</div>;

  it('renders loading component when isLoading is true', () => {
    render(
      <DashboardComponentWrapper
        isLoading={true}
        error={null}
        loadingComponent={mockLoadingComponent}
        componentName="Noticias"
      >
        {mockChildren}
      </DashboardComponentWrapper>
    );

    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('renders children when not loading and no error', () => {
    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={null}
        loadingComponent={mockLoadingComponent}
        componentName="Noticias"
      >
        {mockChildren}
      </DashboardComponentWrapper>
    );

    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
  });

  it('renders component-specific error UI when error exists', () => {
    const error = new Error('Component error');

    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
        componentName="Eventos"
      >
        {mockChildren}
      </DashboardComponentWrapper>
    );

    expect(screen.getByText('Error en Eventos')).toBeInTheDocument();
    expect(screen.getByText('Component error')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('shows default error message when error has no message', () => {
    const error = new Error();

    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
        componentName="Noticias"
      >
        {mockChildren}
      </DashboardComponentWrapper>
    );

    expect(screen.getByText('Esta sección no está disponible temporalmente')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();

    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
        componentName="Noticias"
        onRetry={onRetry}
      >
        {mockChildren}
      </DashboardComponentWrapper>
    );

    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalled();
  });

  it('has appropriate styling for dashboard components', () => {
    const error = new Error('Test error');

    render(
      <DashboardComponentWrapper
        isLoading={false}
        error={error}
        loadingComponent={mockLoadingComponent}
        componentName="Test"
      >
        {mockChildren}
      </DashboardComponentWrapper>
    );

    const errorContainer = screen.getByText('Error en Test').closest('div');
    expect(errorContainer).toHaveClass('bg-yellow-50', 'border-yellow-200');
  });
});