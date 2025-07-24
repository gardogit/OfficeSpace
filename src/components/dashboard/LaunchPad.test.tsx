import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LaunchPad } from './LaunchPad';
import { Application } from '../../types';

// Mock de window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('LaunchPad', () => {
  const mockApplications: Application[] = [
    {
      id: 'app-001',
      name: 'Slack',
      description: 'Comunicación y colaboración en equipo',
      url: 'https://empresa.slack.com',
      icon: '💬',
      category: 'Comunicación'
    },
    {
      id: 'app-002',
      name: 'Jira',
      description: 'Gestión de proyectos y seguimiento de tareas',
      url: 'https://empresa.atlassian.net',
      icon: '📋',
      category: 'Productividad'
    },
    {
      id: 'app-003',
      name: 'GitHub',
      description: 'Repositorio de código y control de versiones',
      url: 'https://github.com/empresa',
      icon: '🐙',
      category: 'Desarrollo'
    }
  ];

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('renderiza correctamente con aplicaciones', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    // Verificar que se muestran las aplicaciones
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Jira')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    
    // Verificar que se muestran los iconos
    expect(screen.getByText('💬')).toBeInTheDocument();
    expect(screen.getByText('📋')).toBeInTheDocument();
    expect(screen.getByText('🐙')).toBeInTheDocument();
  });

  it('crea una cuadrícula 3x3', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    const grid = screen.getByRole('navigation');
    const gridContainer = grid.querySelector('.grid-cols-3');
    expect(gridContainer).toBeInTheDocument();
    
    // Debe haber 9 elementos en total (3 aplicaciones + 6 espacios vacíos)
    const gridItems = gridContainer?.children;
    expect(gridItems).toHaveLength(9);
  });

  it('abre aplicación en nueva pestaña al hacer clic', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    const slackButton = screen.getByLabelText(/Abrir Slack/);
    fireEvent.click(slackButton);
    
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://empresa.slack.com',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('muestra espacios vacíos cuando hay menos de 9 aplicaciones', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    // Debe mostrar 6 espacios vacíos (9 - 3 aplicaciones)
    const emptySlots = screen.getAllByText('Vacío');
    expect(emptySlots).toHaveLength(6);
  });

  it('limita a 9 aplicaciones máximo', () => {
    const manyApps: Application[] = Array.from({ length: 12 }, (_, i) => ({
      id: `app-${i}`,
      name: `App ${i}`,
      description: `Descripción ${i}`,
      url: `https://app${i}.com`,
      icon: '📱',
      category: 'Test'
    }));

    render(<LaunchPad applications={manyApps} />);
    
    // Solo debe mostrar 9 aplicaciones
    const appButtons = screen.getAllByRole('button').filter(
      button => button.getAttribute('aria-label')?.includes('Abrir App')
    );
    expect(appButtons).toHaveLength(9);
    
    // Debe mostrar indicador de aplicaciones adicionales
    expect(screen.getByText('+3 aplicaciones más')).toBeInTheDocument();
  });

  it('muestra mensaje cuando no hay aplicaciones', () => {
    render(<LaunchPad applications={[]} />);
    
    expect(screen.getByText('No hay aplicaciones disponibles')).toBeInTheDocument();
    expect(screen.getByText('📱')).toBeInTheDocument();
  });

  it('incluye atributos de accesibilidad correctos', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    // Verificar navegación con aria-label
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'Aplicaciones corporativas');
    
    // Verificar botones con aria-label descriptivos
    const slackButton = screen.getByLabelText('Abrir Slack: Comunicación y colaboración en equipo');
    expect(slackButton).toBeInTheDocument();
    
    // Verificar title para tooltip
    expect(slackButton).toHaveAttribute('title', 'Comunicación y colaboración en equipo');
  });

  it('aplica efectos hover correctamente', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    const slackButton = screen.getByLabelText(/Abrir Slack/);
    
    // Verificar clases CSS para efectos hover
    expect(slackButton).toHaveClass('hover:bg-gray-100');
    expect(slackButton).toHaveClass('group');
    
    // Verificar que el icono tiene efecto de escala en hover
    const iconContainer = slackButton.querySelector('.group-hover\\:scale-110');
    expect(iconContainer).toBeInTheDocument();
  });

  it('maneja navegación por teclado', () => {
    render(<LaunchPad applications={mockApplications} />);
    
    const slackButton = screen.getByLabelText(/Abrir Slack/);
    
    // Verificar que el botón es focuseable
    slackButton.focus();
    expect(slackButton).toHaveFocus();
    
    // Verificar clases de focus
    expect(slackButton).toHaveClass('focus:outline-none');
    expect(slackButton).toHaveClass('focus:ring-2');
    expect(slackButton).toHaveClass('focus:ring-blue-500');
  });

  it('aplica className personalizado', () => {
    render(<LaunchPad applications={mockApplications} className="custom-class" />);
    
    const container = screen.getByRole('navigation');
    expect(container).toHaveClass('custom-class');
  });
});