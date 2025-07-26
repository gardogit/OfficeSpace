import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import { UnifiedNavbar } from '../components/layout/UnifiedNavbar';
import { UserProfile } from '../types';
import { NavigationSection } from '../components/layout/NavigationBar';

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

const mockUser: UserProfile = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan.perez@company.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'Desarrollador Senior',
  department: 'Tecnología'
};

const mockSections: NavigationSection[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'noticias', label: 'Noticias' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'equipo', label: 'Equipo' }
];

const UnifiedNavbarWithTheme = ({ 
  onSearch, 
  onSectionChange 
}: { 
  onSearch?: (query: string) => void;
  onSectionChange?: (sectionId: string) => void;
}) => (
  <ThemeProvider>
    <UnifiedNavbar
      user={mockUser}
      sections={mockSections}
      onSearch={onSearch}
      onSectionChange={onSectionChange}
    />
  </ThemeProvider>
);

describe('UnifiedNavbar', () => {
  it('renders single row layout with logo, navigation, and controls', () => {
    render(<UnifiedNavbarWithTheme />);
    
    // Should show logo
    expect(screen.getByLabelText('Corporate Hub - Ir al inicio')).toBeInTheDocument();
    
    // Should show navigation sections
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Noticias')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Equipo')).toBeInTheDocument();
    
    // Should show controls
    expect(screen.getByLabelText('Abrir búsqueda')).toBeInTheDocument();
    expect(screen.getByLabelText('Notificaciones (3 nuevas)')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  it('shows navigation by default and hides search input', () => {
    render(<UnifiedNavbarWithTheme />);
    
    // Navigation should be visible
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    
    // Search input should be hidden
    expect(screen.queryByLabelText('Campo de búsqueda')).not.toBeInTheDocument();
    
    // Search icon should be visible
    expect(screen.getByLabelText('Abrir búsqueda')).toBeInTheDocument();
  });

  it('hides navigation and shows search when search is expanded', async () => {
    render(<UnifiedNavbarWithTheme />);
    
    // Click search icon
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      // Navigation should be hidden
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.queryByText('Inicio')).not.toBeInTheDocument();
      
      // Search input should be visible
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
      expect(screen.getByLabelText('Cerrar búsqueda')).toBeInTheDocument();
    });
  });

  it('restores navigation when search is closed', async () => {
    render(<UnifiedNavbarWithTheme />);
    
    // Open search
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
    });
    
    // Close search
    const closeButton = screen.getByLabelText('Cerrar búsqueda');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      // Navigation should be visible again
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      
      // Search input should be hidden
      expect(screen.queryByLabelText('Campo de búsqueda')).not.toBeInTheDocument();
    });
  });

  it('handles navigation section changes', () => {
    const mockOnSectionChange = vi.fn();
    render(<UnifiedNavbarWithTheme onSectionChange={mockOnSectionChange} />);
    
    // Click on Noticias section
    const noticiasLink = screen.getByText('Noticias');
    fireEvent.click(noticiasLink);
    
    expect(mockOnSectionChange).toHaveBeenCalledWith('noticias');
  });

  it('handles search functionality', async () => {
    const mockOnSearch = vi.fn();
    render(<UnifiedNavbarWithTheme onSearch={mockOnSearch} />);
    
    // Open search
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
    });
    
    // Type and search
    const searchInput = screen.getByLabelText('Campo de búsqueda');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
    
    // Should close search after searching
    await waitFor(() => {
      expect(screen.queryByLabelText('Campo de búsqueda')).not.toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });

  it('maintains single row structure throughout interactions', async () => {
    render(<UnifiedNavbarWithTheme />);
    
    // Check initial structure
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Open search
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      // Header should still be single row
      expect(header).toBeInTheDocument();
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
    });
    
    // Close search
    const closeButton = screen.getByLabelText('Cerrar búsqueda');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      // Header should still be single row
      expect(header).toBeInTheDocument();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  });
});