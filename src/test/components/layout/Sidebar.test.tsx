import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../../../components/layout/Sidebar';
import { QuickLink, Space, Application } from '../../../types';

// Mock data for testing
const mockQuickLinks: QuickLink[] = [
  {
    id: 'link-001',
    title: 'Portal de Empleados',
    url: 'https://portal.empresa.com',
    category: 'Recursos Humanos',
    icon: '👥'
  },
  {
    id: 'link-002',
    title: 'Sistema de Tickets',
    url: 'https://tickets.empresa.com',
    category: 'Soporte IT',
    icon: '🎫'
  }
];

const mockSpaces: Space[] = [
  {
    id: 'space-001',
    name: 'Proyecto Alpha',
    description: 'Desarrollo de la nueva plataforma de e-commerce',
    memberCount: 8,
    isActive: true,
    lastActivity: '2024-01-23T16:30:00Z'
  },
  {
    id: 'space-002',
    name: 'Equipo de Marketing',
    description: 'Coordinación de campañas y estrategias de marketing',
    memberCount: 12,
    isActive: true,
    lastActivity: '2024-01-23T14:15:00Z'
  }
];

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
    name: 'Confluence',
    description: 'Documentación y base de conocimiento',
    url: 'https://empresa.atlassian.net/wiki',
    icon: '📖',
    category: 'Documentación'
  }
];

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );
  });

  it('displays the correct structure with three main sections', () => {
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Verificar que los tres módulos principales están presentes
    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument();
    expect(screen.getByText('Espacios de Colaboración')).toBeInTheDocument();
    expect(screen.getByText('Aplicaciones')).toBeInTheDocument();
  });

  it('shows correct counts for each module', () => {
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Verificar que muestra el número correcto de elementos
    expect(screen.getByText('2 enlaces disponibles')).toBeInTheDocument();
    expect(screen.getByText('2 espacios disponibles')).toBeInTheDocument();
    expect(screen.getByText('3 aplicaciones disponibles')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Verificar atributos de accesibilidad
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveAttribute('aria-label', 'Barra lateral con información adicional');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-sidebar-class';
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
        className={customClass}
      />
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass(customClass);
  });

  it('handles empty data arrays gracefully', () => {
    render(
      <Sidebar
        quickLinks={[]}
        spaces={[]}
        applications={[]}
      />
    );

    // Verificar que maneja arrays vacíos correctamente
    expect(screen.getByText('0 enlaces disponibles')).toBeInTheDocument();
    expect(screen.getByText('0 espacios disponibles')).toBeInTheDocument();
    expect(screen.getByText('0 aplicaciones disponibles')).toBeInTheDocument();
  });

  it('has responsive layout classes', () => {
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-full', 'space-y-6');
  });

  it('renders module containers with proper styling', () => {
    render(
      <Sidebar
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Verificar que cada módulo tiene el estilo de card apropiado
    const quickLinksHeader = screen.getByText('Enlaces Rápidos');
    const spacesHeader = screen.getByText('Espacios de Colaboración');
    const appsHeader = screen.getByText('Aplicaciones');

    [quickLinksHeader, spacesHeader, appsHeader].forEach(header => {
      const container = header.closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'border', 'border-gray-200', 'shadow-sm', 'p-6');
    });
  });
});