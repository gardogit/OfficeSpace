import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MainLayout } from '../../../components/layout/MainLayout';

describe('Responsive Layout Tests', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Store original matchMedia
    originalMatchMedia = window.matchMedia;
    
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('applies mobile layout classes correctly', () => {
    const { container } = render(
      <MainLayout 
        sidebar={<div data-testid="sidebar">Sidebar</div>}
      >
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
  });

  it('applies desktop layout classes correctly', () => {
    const { container } = render(
      <MainLayout 
        sidebar={<div data-testid="sidebar">Sidebar</div>}
      >
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('lg:grid-cols-12');
  });

  it('maintains proper spacing across breakpoints', () => {
    const { container } = render(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );

    // Check container padding classes for responsive design
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
  });

  it('applies correct positioning for navbar', () => {
    const navbarContent = <div data-testid="navbar">Navbar</div>;
    
    render(
      <MainLayout navbar={navbarContent}>
        <div>Content</div>
      </MainLayout>
    );

    const navbarContainer = screen.getByTestId('navbar').parentElement;

    // Verify z-index stacking
    expect(navbarContainer).toHaveClass('z-40');
    expect(navbarContainer).toHaveClass('flex-shrink-0');
  });

  it('handles sidebar sticky positioning correctly', () => {
    const sidebarContent = <div data-testid="sidebar">Sidebar</div>;
    
    render(
      <MainLayout sidebar={sidebarContent}>
        <div>Main Content</div>
      </MainLayout>
    );

    const sidebarContainer = screen.getByTestId('sidebar').parentElement;
    expect(sidebarContainer).toHaveClass('sticky', 'top-32');
  });

  it('maintains proper gap spacing in grid layout', () => {
    const { container } = render(
      <MainLayout 
        sidebar={<div>Sidebar</div>}
      >
        <div>Main Content</div>
      </MainLayout>
    );

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('gap-6', 'lg:gap-8');
  });

  it('applies correct column spans for different screen sizes', () => {
    const sidebarContent = <div data-testid="sidebar">Sidebar</div>;
    
    render(
      <MainLayout sidebar={sidebarContent}>
        <div data-testid="main-content">Main Content</div>
      </MainLayout>
    );

    const mainElement = screen.getByTestId('main-content').closest('main');
    const asideElement = screen.getByTestId('sidebar').closest('aside');

    // Check main content spans
    expect(mainElement).toHaveClass('lg:col-span-8', 'xl:col-span-9');
    
    // Check sidebar spans
    expect(asideElement).toHaveClass('lg:col-span-4', 'xl:col-span-3');
  });
});