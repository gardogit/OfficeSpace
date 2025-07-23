import React from 'react';
import { QuickLinks } from './QuickLinks';
import { QuickLink } from '../../types';

/**
 * QuickLinksDemo - Componente de demostración para QuickLinks
 * 
 * Muestra el componente QuickLinks con datos de ejemplo para
 * propósitos de desarrollo y testing visual.
 */
export const QuickLinksDemo: React.FC = () => {
  const demoLinks: QuickLink[] = [
    {
      id: 'demo-001',
      title: 'Portal de Empleados',
      url: 'https://portal.empresa.com',
      category: 'Recursos Humanos',
      icon: '👥'
    },
    {
      id: 'demo-002',
      title: 'Sistema de Tickets',
      url: 'https://tickets.empresa.com',
      category: 'Soporte IT',
      icon: '🎫'
    },
    {
      id: 'demo-003',
      title: 'Documentación Técnica',
      url: 'https://docs.empresa.com',
      category: 'Desarrollo',
      icon: '📚'
    },
    {
      id: 'demo-004',
      title: 'Repositorio de Código',
      url: 'https://git.empresa.com',
      category: 'Desarrollo',
      icon: '💻'
    },
    {
      id: 'demo-005',
      title: 'Calendario Corporativo',
      url: 'https://calendar.empresa.com',
      category: 'Organización',
      icon: '📅'
    },
    {
      id: 'demo-006',
      title: 'Sistema de Gastos',
      url: 'https://expenses.empresa.com',
      category: 'Finanzas',
      icon: '💰'
    },
    {
      id: 'demo-007',
      title: 'Plataforma de Aprendizaje',
      url: 'https://learning.empresa.com',
      category: 'Capacitación',
      icon: '🎓'
    },
    {
      id: 'demo-008',
      title: 'Dashboard de Métricas',
      url: 'https://metrics.empresa.com',
      category: 'Analytics',
      icon: '📊'
    }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Enlaces Rápidos - Demo
      </h2>
      <QuickLinks links={demoLinks} />
    </div>
  );
};

export default QuickLinksDemo;