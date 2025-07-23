import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainLayout } from '../../../components/layout/MainLayout';
import { Sidebar } from '../../../components/layout/Sidebar';
import { QuickLink, Space, Application } from '../../../types';

// Mock data for integration testing
const mockQuickLinks: QuickLink[] = [
  {
    id: 'link-001',
    title: 'Portal de Empleados',
    url: 'https://portal.empresa.com',
    category: 'Recursos Humanos',
    icon: '👥'
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
  }
];

describe('Sidebar Integration with MainLayout', () => {
  it('renders correctly within MainLayout', () => {
    render(
      <MainLayout
        sidebar={
          <Sidebar
            quickLinks={mockQuickLinks}
            spaces={mockSpaces}
            applications={mockApplications}
          />
        }
      >
        <div>Main content</div>
      </MainLayout>
    );

    // Verificar que el sidebar se renderiza dentro del layout
    expect(screen.getByLabelText('Barra lateral con información adicional')).toBeInTheDocument();
    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument();
    expect(screen.getByText('Espacios de Colaboración')).toBeInTheDocument();
    expect(screen.getByText('Aplicaciones')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('maintains responsive layout structure', () => {
    render(
      <MainLayout
        sidebar={
          <Sidebar
            quickLinks={mockQuickLinks}
            spaces={mockSpaces}
            applications={mockApplications}
          />
        }
      >
        <div>Main content</div>
      </MainLayout>
    );

    // Verificar que el sidebar tiene las clases responsive correctas
    const sidebar = screen.getByLabelText('Barra lateral con información adicional');
    expect(sidebar).toHaveClass('w-full', 'space-y-6');
  });

  it('displays correct data counts in sidebar modules', () => {
    render(
      <MainLayout
        sidebar={
          <Sidebar
            quickLinks={mockQuickLinks}
            spaces={mockSpaces}
            applications={mockApplications}
          />
        }
      >
        <div>Main content</div>
      </MainLayout>
    );

    // Verificar que muestra los conteos correctos
    expect(screen.getByText('1 enlaces disponibles')).toBeInTheDocument();
    expect(screen.getByText('1 espacios disponibles')).toBeInTheDocument();
    expect(screen.getByText('1 aplicaciones disponibles')).toBeInTheDocument();
  });
});