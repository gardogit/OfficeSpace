import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Integration', () => {
  it('renders all main dashboard components', () => {
    render(<App />);
    
    // Check that header is rendered
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Check that main content sections are rendered
    expect(screen.getByText('Noticias Destacadas')).toBeInTheDocument();
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument();
    expect(screen.getByText('Nuevos Miembros del Equipo')).toBeInTheDocument();
    
    // Check that sidebar components are rendered
    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument();
    expect(screen.getByText('Espacios de Colaboración')).toBeInTheDocument();
    expect(screen.getByText('Aplicaciones')).toBeInTheDocument();
  });

  it('verifies complete dashboard integration', () => {
    render(<App />);
    
    // Verify all major components are integrated
    expect(screen.getByText('Corporate Hub')).toBeInTheDocument(); // Header
    expect(screen.getByRole('tab', { name: /inicio/i })).toBeInTheDocument(); // Navigation
    expect(screen.getByText('Noticias Destacadas')).toBeInTheDocument(); // News
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument(); // Events
    expect(screen.getByText('Nuevos Miembros del Equipo')).toBeInTheDocument(); // New Hires
    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument(); // Quick Links
    expect(screen.getByText('Espacios de Colaboración')).toBeInTheDocument(); // Spaces
    expect(screen.getByText('Aplicaciones')).toBeInTheDocument(); // Launch Pad
  });
});