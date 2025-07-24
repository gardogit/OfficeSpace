import React from 'react';
import { QuickLink, Space, Application } from '../../types';
import { QuickLinks } from '../dashboard/QuickLinks';
import { SpacesList } from '../dashboard/SpacesList';
import { LaunchPad } from '../dashboard/LaunchPad';

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
    <div 
      className={`w-full space-y-6 ${className}`}
      role="complementary"
      aria-label="Barra lateral con información adicional"
    >
      {/* QuickLinks Module */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Enlaces Rápidos
        </h2>
        <QuickLinks links={quickLinks} />
      </div>

      {/* SpacesList Module */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Espacios de Colaboración
        </h2>
        <SpacesList spaces={spaces} />
      </div>

      {/* LaunchPad Module */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Aplicaciones
        </h2>
        <LaunchPad applications={applications} />
      </div>
    </div>
  );
};

export default Sidebar;