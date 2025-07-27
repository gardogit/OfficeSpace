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

  it('renders navbar when provided', () => {
    const navbarContent = <div data-testid="navbar">Navbar Content</div>;
    
    render(
      <MainLayout navbar={navbarContent}>
        <div>Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Navbar Content')).toBeInTheDocument();
  });

  it('renders without navbar when not provided', () => {
    render(
      <MainLayout>
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
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
    const navbarContent = <div data-testid="navbar">Navbar</div>;
    const sidebarContent = <div data-testid="sidebar">Sidebar</div>;
    
    render(
      <MainLayout 
        navbar={navbarContent}
        sidebar={sidebarContent}
      >
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
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
    expect(mainContainer).toHaveClass('h-screen', 'bg-gray-50');

    // Check flex layout classes
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toHaveClass('flex-1', 'min-h-0');
  });

  it('applies correct positioning to navbar', () => {
    const navbarContent = <div data-testid="navbar">Navbar</div>;
    
    render(
      <MainLayout navbar={navbarContent}>
        <div>Content</div>
      </MainLayout>
    );

    const navbarContainer = screen.getByTestId('navbar').parentElement;
    expect(navbarContainer).toHaveClass('flex-shrink-0', 'z-40');
  });

  it('applies correct flex classes for main and sidebar', () => {
    const sidebarContent = <div data-testid="sidebar">Sidebar</div>;
    
    render(
      <MainLayout sidebar={sidebarContent}>
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    const mainElement = screen.getByTestId('main-content').closest('main');
    const sidebarContainer = screen.getByTestId('sidebar').parentElement;

    expect(mainElement).toHaveClass('flex-1', 'overflow-y-auto');
    expect(sidebarContainer).toHaveClass('flex-shrink-0', 'lg:w-80');
  });
});