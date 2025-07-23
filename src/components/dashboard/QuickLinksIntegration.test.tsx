import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sidebar } from '../layout/Sidebar';
import { QuickLink, Space, Application } from '../../types';

// Mock de window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('QuickLinks Integration', () => {
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
    },
    {
      id: 'link-003',
      title: 'Documentación Técnica',
      url: 'https://docs.empresa.com',
      category: 'Desarrollo',
      icon: '📚'
    }
  ];

  const mockSpaces: Space[] = [];
  const mockApplications: Application[] = [];

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  describe('Integración con Sidebar', () => {
    it('renderiza QuickLinks correctamente dentro del Sidebar', () => {
      render(
        <Sidebar 
          quickLinks={mockQuickLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Verificar que el título del módulo está presente
      expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument();
      
      // Verificar que los enlaces están presentes
      expect(screen.getByText('Portal de Empleados')).toBeInTheDocument();
      expect(screen.getByText('Sistema de Tickets')).toBeInTheDocument();
      expect(screen.getByText('Documentación Técnica')).toBeInTheDocument();
    });

    it('mantiene funcionalidad de navegación dentro del Sidebar', () => {
      render(
        <Sidebar 
          quickLinks={mockQuickLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Hacer clic en un enlace
      const portalLink = screen.getByText('Portal de Empleados');
      fireEvent.click(portalLink);

      // Verificar que se abre en nueva pestaña
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://portal.empresa.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('muestra categorías agrupadas dentro del Sidebar', () => {
      render(
        <Sidebar 
          quickLinks={mockQuickLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Verificar que las categorías están presentes
      expect(screen.getByText(/recursos humanos/i)).toBeInTheDocument();
      expect(screen.getByText(/soporte it/i)).toBeInTheDocument();
      expect(screen.getByText(/desarrollo/i)).toBeInTheDocument();
    });

    it('maneja lista vacía de enlaces en el Sidebar', () => {
      render(
        <Sidebar 
          quickLinks={[]}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Verificar que se muestra el mensaje de no hay enlaces
      expect(screen.getByText('No hay enlaces rápidos disponibles')).toBeInTheDocument();
    });

    it('aplica estilos del sistema de diseño correctamente', () => {
      render(
        <Sidebar 
          quickLinks={mockQuickLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Verificar que el contenedor del módulo tiene las clases correctas
      const quickLinksModule = screen.getByText('Enlaces Rápidos').closest('div');
      expect(quickLinksModule).toHaveClass(
        'bg-white',
        'rounded-lg',
        'border',
        'border-gray-200',
        'shadow-sm',
        'p-6'
      );
    });

    it('mantiene accesibilidad dentro del contexto del Sidebar', () => {
      render(
        <Sidebar 
          quickLinks={mockQuickLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Verificar que el Sidebar tiene el rol complementary
      expect(screen.getByRole('complementary')).toBeInTheDocument();
      
      // Verificar que QuickLinks mantiene su rol de navegación
      expect(screen.getByRole('navigation', { name: 'Enlaces rápidos' })).toBeInTheDocument();
      
      // Verificar que los botones tienen etiquetas aria apropiadas
      expect(screen.getByLabelText('Abrir Portal de Empleados en nueva pestaña')).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('mantiene funcionalidad en diferentes tamaños de pantalla', () => {
      // Simular pantalla móvil
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });

      render(
        <Sidebar 
          quickLinks={mockQuickLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      // Los enlaces deben seguir siendo clickeables
      const portalLink = screen.getByText('Portal de Empleados');
      fireEvent.click(portalLink);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://portal.empresa.com',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('Performance', () => {
    it('maneja gran cantidad de enlaces sin problemas de rendimiento', () => {
      const manyLinks: QuickLink[] = Array.from({ length: 50 }, (_, i) => ({
        id: `link-${i}`,
        title: `Enlace ${i}`,
        url: `https://example${i}.com`,
        category: `Categoría ${i % 5}`,
        icon: '🔗'
      }));

      const startTime = performance.now();
      
      render(
        <Sidebar 
          quickLinks={manyLinks}
          spaces={mockSpaces}
          applications={mockApplications}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // El renderizado no debería tomar más de 100ms
      expect(renderTime).toBeLessThan(100);
      
      // Verificar que todos los enlaces están presentes
      expect(screen.getByText('Enlace 0')).toBeInTheDocument();
      expect(screen.getByText('Enlace 49')).toBeInTheDocument();
    });
  });
});