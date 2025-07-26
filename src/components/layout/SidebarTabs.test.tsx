import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SidebarTabs } from './SidebarTabs';
import { QuickLink, Space, Application } from '../../types';

// Mock data for testing
const mockQuickLinks: QuickLink[] = [
  {
    id: 'link-1',
    title: 'Portal de Empleados',
    url: 'https://portal.empresa.com',
    category: 'RECURSOS HUMANOS'
  },
  {
    id: 'link-2',
    title: 'Sistema de Tickets',
    url: 'https://tickets.empresa.com',
    category: 'SOPORTE IT'
  }
];

const mockSpaces: Space[] = [
  {
    id: 'space-1',
    name: 'Proyecto Alpha',
    description: 'Desarrollo de la nueva plataforma',
    memberCount: 8,
    isActive: true,
    lastActivity: '2024-01-23T16:30:00Z'
  },
  {
    id: 'space-2',
    name: 'Equipo de Marketing',
    description: 'Coordinación de campañas',
    memberCount: 12,
    isActive: false,
    lastActivity: '2024-01-20T14:15:00Z'
  }
];

const mockApplications: Application[] = [
  {
    id: 'app-1',
    name: 'Slack',
    description: 'Comunicación del equipo',
    url: 'https://slack.com',
    icon: '💬',
    category: 'Comunicación'
  },
  {
    id: 'app-2',
    name: 'Jira',
    description: 'Gestión de proyectos',
    url: 'https://jira.com',
    icon: '📋',
    category: 'Productividad'
  }
];

describe('SidebarTabs', () => {
  it('renders all tabs correctly', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Check that all tabs are rendered
    expect(screen.getByRole('tab', { name: /enlaces/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /espacios/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /apps/i })).toBeInTheDocument();
  });

  it('shows correct counts in tabs', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Check counts (quickLinks: 2, active spaces: 1, applications: 2)
    expect(screen.getByText('2')).toBeInTheDocument(); // quickLinks count
    expect(screen.getByText('1')).toBeInTheDocument(); // active spaces count
    // Note: applications count should also be 2, but there might be multiple "2"s
  });

  it('starts with links tab active by default', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    const linksTab = screen.getByRole('tab', { name: /enlaces/i });
    expect(linksTab).toHaveAttribute('aria-selected', 'true');
    
    // Should show QuickLinks content
    expect(screen.getByText('Portal de Empleados')).toBeInTheDocument();
  });

  it('switches tabs when clicked', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Click on spaces tab
    const spacesTab = screen.getByRole('tab', { name: /espacios/i });
    fireEvent.click(spacesTab);

    // Check that spaces tab is now active
    expect(spacesTab).toHaveAttribute('aria-selected', 'true');
    
    // Should show SpacesList content
    expect(screen.getByText('Proyecto Alpha')).toBeInTheDocument();
  });

  it('shows applications when apps tab is clicked', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Click on apps tab
    const appsTab = screen.getByRole('tab', { name: /apps/i });
    fireEvent.click(appsTab);

    // Check that apps tab is now active
    expect(appsTab).toHaveAttribute('aria-selected', 'true');
    
    // Should show LaunchPad content
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Jira')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    // Check tablist role
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    
    // Check tabpanel role
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    
    // Check aria-controls and aria-labelledby
    const linksTab = screen.getByRole('tab', { name: /enlaces/i });
    expect(linksTab).toHaveAttribute('aria-controls', 'tabpanel-links');
    expect(linksTab).toHaveAttribute('id', 'tab-links');
  });

  it('includes help section', () => {
    render(
      <SidebarTabs
        quickLinks={mockQuickLinks}
        spaces={mockSpaces}
        applications={mockApplications}
      />
    );

    expect(screen.getByText('¿Necesitas ayuda?')).toBeInTheDocument();
    expect(screen.getByText('Contactar Soporte')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(
      <SidebarTabs
        quickLinks={[]}
        spaces={[]}
        applications={[]}
      />
    );

    // Tabs should still be rendered
    expect(screen.getByRole('tab', { name: /enlaces/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /espacios/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /apps/i })).toBeInTheDocument();
    
    // Should show empty state message for links
    expect(screen.getByText('No hay enlaces rápidos disponibles')).toBeInTheDocument();
  });
});