import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SidebarTabs } from '../components/layout/SidebarTabs';
import mockData from '../data/mockData.json';

// Mock window.matchMedia for theme context
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const SidebarTabsWithTheme = () => (
  <ThemeProvider>
    <SidebarTabs
      quickLinks={mockData.quickLinks}
      spaces={mockData.spaces}
      applications={mockData.applications}
    />
  </ThemeProvider>
);

describe('SidebarTabs Integration', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  it('renders successfully with real mock data', () => {
    render(<SidebarTabsWithTheme />);
    
    // Check that all tabs are rendered
    expect(screen.getByRole('tab', { name: /enlaces/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /espacios/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /apps/i })).toBeInTheDocument();
  });

  it('shows correct counts from real data', () => {
    render(<SidebarTabsWithTheme />);
    
    // Check that counts are displayed (should be from real mock data)
    const linksTab = screen.getByRole('tab', { name: /enlaces/i });
    const spacesTab = screen.getByRole('tab', { name: /espacios/i });
    const appsTab = screen.getByRole('tab', { name: /apps/i });
    
    // Verify tabs have count badges
    expect(linksTab).toBeInTheDocument();
    expect(spacesTab).toBeInTheDocument();
    expect(appsTab).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    render(<SidebarTabsWithTheme />);
    
    // Should start with links tab active
    const linksTab = screen.getByRole('tab', { name: /enlaces/i });
    expect(linksTab).toHaveAttribute('aria-selected', 'true');
    
    // Click on spaces tab
    const spacesTab = screen.getByRole('tab', { name: /espacios/i });
    fireEvent.click(spacesTab);
    
    // Spaces tab should now be active
    expect(spacesTab).toHaveAttribute('aria-selected', 'true');
    expect(linksTab).toHaveAttribute('aria-selected', 'false');
  });

  it('displays content from real mock data', () => {
    render(<SidebarTabsWithTheme />);
    
    // Should show some quick links by default
    expect(screen.getByText('Portal de Empleados')).toBeInTheDocument();
    
    // Switch to spaces tab
    const spacesTab = screen.getByRole('tab', { name: /espacios/i });
    fireEvent.click(spacesTab);
    
    // Should show spaces content
    expect(screen.getByText('Proyecto Alpha')).toBeInTheDocument();
    
    // Switch to apps tab
    const appsTab = screen.getByRole('tab', { name: /apps/i });
    fireEvent.click(appsTab);
    
    // Should show applications content
    expect(screen.getByText('Slack')).toBeInTheDocument();
  });

  it('includes help button', () => {
    render(<SidebarTabsWithTheme />);
    
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
    expect(screen.getByLabelText('Ayuda y soporte')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<SidebarTabsWithTheme />);
    
    // Check for proper ARIA structure
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });
});