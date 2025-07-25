import React from 'react';
import { QuickLink, Space, Application } from '../../types';
import { QuickLinks } from '../dashboard/QuickLinks';
import { SpacesList } from '../dashboard/SpacesList';
import { LaunchPad } from '../dashboard/LaunchPad';
import { Card } from '../ui';

interface SidebarProps {
  quickLinks: QuickLink[];
  spaces: Space[];
  applications: Application[];
  className?: string;
}

/**
 * Sidebar - Barra lateral derecha que contiene módulos de información adicional
 * 
 * Contiene tres módulos principales:
 * - QuickLinks: Enlaces rápidos organizados por categoría
 * - SpacesList: Lista de espacios de colaboración
 * - LaunchPad: Cuadrícula de aplicaciones externas
 * 
 * El componente es responsive y se adapta a diferentes tamaños de pantalla.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  quickLinks,
  spaces,
  applications,
  className = ''
}) => {
  return (
    <aside 
      className={`w-full content-spacing animate-fade-in ${className}`}
      role="complementary"
      aria-label="Barra lateral con información adicional"
    >
      {/* QuickLinks Module */}
      <Card 
        title="Enlaces Rápidos"
        className="group hover:border-primary-200 dark:hover:border-primary-700 transition-colors duration-200"
      >
        <div className="group-hover:scale-[1.01] transition-transform duration-200">
          <QuickLinks links={quickLinks} />
        </div>
      </Card>

      {/* SpacesList Module */}
      <Card 
        title="Espacios de Colaboración"
        className="group hover:border-success-200 dark:hover:border-success-700 transition-colors duration-200"
      >
        <div className="group-hover:scale-[1.01] transition-transform duration-200">
          <SpacesList spaces={spaces} />
        </div>
      </Card>

      {/* LaunchPad Module */}
      <Card 
        title="Aplicaciones"
        className="group hover:border-warning-200 dark:hover:border-warning-700 transition-colors duration-200"
      >
        <div className="group-hover:scale-[1.01] transition-transform duration-200">
          <LaunchPad applications={applications} />
        </div>
      </Card>

      {/* Additional Info Card */}
      <Card variant="highlighted" className="text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="heading-4 text-primary-900 dark:text-primary-200 mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="body-small text-primary-700 dark:text-primary-300 mb-4">
              Contacta al equipo de soporte para asistencia técnica
            </p>
            <button className="btn btn-primary btn-sm">
              Contactar Soporte
            </button>
          </div>
        </div>
      </Card>
    </aside>
  );
};

export default Sidebar;