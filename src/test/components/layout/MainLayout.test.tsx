import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from '../../../components/layout/MainLayout';

describe('MainLayout', () => {
  it('renders children content correctly', () => {
    render(
      <MainLayout>
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('renders header when provided', () => {
    const headerContent = <div data-testid="header">Header Content</div>;
    
    render(
      <MainLayout header={headerContent}>
        <div>Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });

  it('renders navigation when provided', () => {
    const navigationContent = <div data-testid="navigation">Navigation Content</div>;
    
    render(
      <MainLayout navigation={navigationContent}>
        <div>Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByText('Navigation Content')).toBeInTheDocument();
  });

  it('renders sidebar when provided', () => {
    const sidebarContent = <div data-testid="sidebar">Sidebar Content</div>;
    
    render(
      <MainLayout sidebar={sidebarContent}>
        <div>Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
  });

  it('renders all sections together', () => {
    const headerContent = <div data-testid="header">Header</div>;
    const navigationContent = <div data-testid="navigation">Navigation</div>;
    const sidebarContent = <div data-testid="sidebar">Sidebar</div>;
    
    render(
      <MainLayout 
        header={headerContent}
        navigation={navigationContent}
        sidebar={sidebarContent}
      >
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout structure', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    // Check main container has correct background
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50');

    // Check grid layout classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-12');
  });

  it('applies sticky positioning to header and navigation', () => {
    const headerContent = <div data-testid="header">Header</div>;
    const navigationContent = <div data-testid="navigation">Navigation</div>;
    
    render(
      <MainLayout 
        header={headerContent}
        navigation={navigationContent}
      >
        <div>Content</div>
      </MainLayout>
    );

    const header = screen.getByTestId('header').parentElement;
    const navigation = screen.getByTestId('navigation').parentElement;

    expect(header).toHaveClass('sticky', 'top-0');
    expect(navigation).toHaveClass('sticky', 'top-16');
  });

  it('applies correct column spans for main and sidebar', () => {
    const sidebarContent = <div data-testid="sidebar">Sidebar</div>;
    
    render(
      <MainLayout sidebar={sidebarContent}>
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    const mainElement = screen.getByTestId('main-content').closest('main');
    const asideElement = screen.getByTestId('sidebar').closest('aside');

    expect(mainElement).toHaveClass('lg:col-span-8', 'xl:col-span-9');
    expect(asideElement).toHaveClass('lg:col-span-4', 'xl:col-span-3');
  });
});