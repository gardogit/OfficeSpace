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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Productividad': 'bg-blue-100 hover:bg-blue-200 text-blue-700',
      'Comunicación': 'bg-green-100 hover:bg-green-200 text-green-700',
      'Desarrollo': 'bg-purple-100 hover:bg-purple-200 text-purple-700',
      'Finanzas': 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
      'Recursos': 'bg-pink-100 hover:bg-pink-200 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 hover:bg-gray-200 text-gray-700';
  };

  return (
    <div 
      className={`${className}`}
      role="navigation"
      aria-label="Aplicaciones corporativas"
    >
      {/* Cuadrícula 3x3 de aplicaciones */}
      <div className="grid grid-cols-3 gap-3">
        {displayedApps.map((app, index) => (
          <button
            key={app.id}
            onClick={() => handleAppClick(app)}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200 focus-ring group hover-lift animate-scale-in ${getCategoryColor(app.category)}`}
            aria-label={`Abrir ${app.name}: ${app.description}`}
            title={app.description}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icono de la aplicación */}
            <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-200 group-hover:rotate-12">
              <span role="img" aria-hidden="true">
                {app.icon}
              </span>
            </div>
            
            {/* Nombre de la aplicación */}
            <span className="caption font-semibold text-center leading-tight group-hover:font-bold transition-all duration-200">
              {app.name}
            </span>

            {/* Indicador de estado activo */}
            <div className="w-1 h-1 bg-current rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ))}
        
        {/* Rellenar espacios vacíos si hay menos de 9 aplicaciones */}
        {Array.from({ length: 9 - displayedApps.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 opacity-50"
            aria-hidden="true"
          >
            <div className="text-2xl mb-2 text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="caption text-gray-400">
              Disponible
            </span>
          </div>
        ))}
      </div>
      
      {/* Mensaje cuando no hay aplicaciones */}
      {applications.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="heading-4 text-gray-700 mb-2">No hay aplicaciones</h4>
          <p className="body-small text-gray-500">Las aplicaciones aparecerán aquí cuando estén disponibles</p>
        </div>
      )}
      
      {/* Indicador de más aplicaciones disponibles */}
      {applications.length > 9 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="caption font-medium">
              +{applications.length - 9} aplicaciones más
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchPad;