import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Header } from '../components/layout/Header';
import { UserProfile } from '../types';

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

const HeaderWithTheme = ({ onSearch }: { onSearch?: (query: string) => void }) => (
  <ThemeProvider>
    <Header user={mockUser} onSearch={onSearch} />
  </ThemeProvider>
);

describe('Header Expandable Search', () => {
  it('shows search icon by default', () => {
    render(<HeaderWithTheme />);
    
    // Should show search icon button
    expect(screen.getByLabelText('Abrir búsqueda')).toBeInTheDocument();
    
    // Should not show search input initially
    expect(screen.queryByLabelText('Campo de búsqueda')).not.toBeInTheDocument();
  });

  it('expands search input when search icon is clicked', async () => {
    render(<HeaderWithTheme />);
    
    // Click search icon
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    // Should show search input
    await waitFor(() => {
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
    });
    
    // Should show close button
    expect(screen.getByLabelText('Cerrar búsqueda')).toBeInTheDocument();
    
    // Should not show search icon
    expect(screen.queryByLabelText('Abrir búsqueda')).not.toBeInTheDocument();
  });

  it('closes search input when close button is clicked', async () => {
    render(<HeaderWithTheme />);
    
    // Open search
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
    });
    
    // Close search
    const closeButton = screen.getByLabelText('Cerrar búsqueda');
    fireEvent.click(closeButton);
    
    // Should hide search input
    await waitFor(() => {
      expect(screen.queryByLabelText('Campo de búsqueda')).not.toBeInTheDocument();
    });
    
    // Should show search icon again
    expect(screen.getByLabelText('Abrir búsqueda')).toBeInTheDocument();
  });

  it('calls onSearch and closes when search is performed', async () => {
    const mockOnSearch = vi.fn();
    render(<HeaderWithTheme onSearch={mockOnSearch} />);
    
    // Open search
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Campo de búsqueda')).toBeInTheDocument();
    });
    
    // Type in search input
    const searchInput = screen.getByLabelText('Campo de búsqueda');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Submit search
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    // Should call onSearch
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
    
    // Should close search input
    await waitFor(() => {
      expect(screen.queryByLabelText('Campo de búsqueda')).not.toBeInTheDocument();
    });
    
    // Should show search icon again
    expect(screen.getByLabelText('Abrir búsqueda')).toBeInTheDocument();
  });

  it('focuses search input when expanded', async () => {
    render(<HeaderWithTheme />);
    
    // Open search
    const searchIcon = screen.getByLabelText('Abrir búsqueda');
    fireEvent.click(searchIcon);
    
    await waitFor(() => {
      const searchInput = screen.getByLabelText('Campo de búsqueda');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveFocus();
    });
  });

  it('maintains header single row layout', () => {
    render(<HeaderWithTheme />);
    
    // Header should have single row structure
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Should contain logo, search icon, notifications, theme toggle, and user controls
    expect(screen.getByLabelText('Corporate Hub - Ir al inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Abrir búsqueda')).toBeInTheDocument();
    expect(screen.getByLabelText('Notificaciones (3 nuevas)')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });
});