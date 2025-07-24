import React from 'react';
import { Application } from '../../types';

export interface LaunchPadProps {
  applications: Application[];
  className?: string;
}

/**
 * LaunchPad - Cuadrícula 3x3 de aplicaciones externas
 * 
 * Muestra aplicaciones corporativas en una cuadrícula organizada con iconos y etiquetas.
 * Permite navegación a aplicaciones externas con retroalimentación visual.
 * 
 * Requerimientos: 9.1, 9.2, 9.3, 9.4
 */
export const LaunchPad: React.FC<LaunchPadProps> = ({
  applications,
  className = ''
}) => {
  // Limitar a 9 aplicaciones para mantener la cuadrícula 3x3
  const displayedApps = applications.slice(0, 9);

  const handleAppClick = (app: Application) => {
    // Abrir aplicación en nueva pestaña
    window.open(app.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`${className}`}
      role="navigation"
      aria-label="Aplicaciones corporativas"
    >
      {/* Cuadrícula 3x3 de aplicaciones */}
      <div className="grid grid-cols-3 gap-3">
        {displayedApps.map((app) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app)}
            className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 group"
            aria-label={`Abrir ${app.name}: ${app.description}`}
            title={app.description}
          >
            {/* Icono de la aplicación */}
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-150">
              <span role="img" aria-hidden="true">
                {app.icon}
              </span>
            </div>
            
            {/* Nombre de la aplicación */}
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {app.name}
            </span>
          </button>
        ))}
        
        {/* Rellenar espacios vacíos si hay menos de 9 aplicaciones */}
        {Array.from({ length: 9 - displayedApps.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex flex-col items-center justify-center p-3 bg-gray-25 rounded-lg opacity-30"
            aria-hidden="true"
          >
            <div className="text-2xl mb-2 text-gray-300">
              <span>⚪</span>
            </div>
            <span className="text-xs text-gray-400">
              Vacío
            </span>
          </div>
        ))}
      </div>
      
      {/* Mensaje cuando no hay aplicaciones */}
      {applications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📱</div>
          <p className="text-sm">No hay aplicaciones disponibles</p>
        </div>
      )}
      
      {/* Indicador de más aplicaciones disponibles */}
      {applications.length > 9 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            +{applications.length - 9} aplicaciones más
          </span>
        </div>
      )}
    </div>
  );
};

export default LaunchPad;