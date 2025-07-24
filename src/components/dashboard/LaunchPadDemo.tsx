import React from 'react';
import { LaunchPad } from './LaunchPad';
import { Application } from '../../types';

/**
 * LaunchPadDemo - Componente de demostración para LaunchPad
 * 
 * Muestra el LaunchPad con datos de ejemplo para desarrollo y testing.
 */
const LaunchPadDemo: React.FC = () => {
  const demoApplications: Application[] = [
    {
      id: 'demo-app-001',
      name: 'Slack',
      description: 'Comunicación y colaboración en equipo',
      url: 'https://empresa.slack.com',
      icon: '💬',
      category: 'Comunicación'
    },
    {
      id: 'demo-app-002',
      name: 'Jira',
      description: 'Gestión de proyectos y seguimiento de tareas',
      url: 'https://empresa.atlassian.net',
      icon: '📋',
      category: 'Productividad'
    },
    {
      id: 'demo-app-003',
      name: 'Confluence',
      description: 'Documentación y base de conocimiento',
      url: 'https://empresa.atlassian.net/wiki',
      icon: '📖',
      category: 'Documentación'
    },
    {
      id: 'demo-app-004',
      name: 'GitHub',
      description: 'Repositorio de código y control de versiones',
      url: 'https://github.com/empresa',
      icon: '🐙',
      category: 'Desarrollo'
    },
    {
      id: 'demo-app-005',
      name: 'Figma',
      description: 'Diseño colaborativo y prototipado',
      url: 'https://figma.com/empresa',
      icon: '🎨',
      category: 'Diseño'
    },
    {
      id: 'demo-app-006',
      name: 'Google Drive',
      description: 'Almacenamiento y compartición de archivos',
      url: 'https://drive.google.com/empresa',
      icon: '📁',
      category: 'Almacenamiento'
    },
    {
      id: 'demo-app-007',
      name: 'Zoom',
      description: 'Videoconferencias y reuniones virtuales',
      url: 'https://empresa.zoom.us',
      icon: '📹',
      category: 'Comunicación'
    }
  ];

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Aplicaciones
        </h2>
        <LaunchPad applications={demoApplications} />
      </div>
      
      {/* Información de demostración */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Demostración de LaunchPad
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Cuadrícula 3x3 de aplicaciones</li>
          <li>• {demoApplications.length} aplicaciones de ejemplo</li>
          <li>• Navegación a aplicaciones externas</li>
          <li>• Efectos hover y focus</li>
          <li>• Espacios vacíos para completar la cuadrícula</li>
        </ul>
      </div>
    </div>
  );
};

export default LaunchPadDemo;