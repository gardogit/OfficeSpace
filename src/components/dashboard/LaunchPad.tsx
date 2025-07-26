import React from 'react';
import { Application } from '../../types';

export interface LaunchPadProps {
  applications: Application[];
  className?: string;
}

/**
 * LaunchPad - Lista vertical de aplicaciones externas
 * 
 * Muestra aplicaciones corporativas en una lista vertical con mejor espaciado.
 * Permite navegación a aplicaciones externas con retroalimentación visual.
 * 
 * Requerimientos: 9.1, 9.2, 9.3, 9.4
 */
export const LaunchPad: React.FC<LaunchPadProps> = ({
  applications,
  className = ''
}) => {
  const handleAppClick = (app: Application) => {
    // Solo mostrar como ejemplo, no abrir enlaces externos
    console.log('Aplicación clickeada:', app.name);
  };



  return (
    <div 
      className={`space-y-2 ${className}`}
      role="navigation"
      aria-label="Aplicaciones corporativas"
    >
      {/* Lista vertical de aplicaciones */}
      <div className="space-y-1">
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app)}
            className="w-full flex items-center gap-1 p-1 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus-ring group transition-colors duration-150"
            aria-label={`Abrir ${app.name}: ${app.description}`}
            title={app.description}
          >
            {/* Icono de la aplicación */}
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg">
              <span role="img" aria-hidden="true">
                {app.icon}
              </span>
            </div>
            
            {/* Información de la aplicación */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-150">
                {app.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {app.description}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Mensaje cuando no hay aplicaciones */}
      {applications.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No hay aplicaciones disponibles</p>
        </div>
      )}
    </div>
  );
};

export default LaunchPad;