import React from 'react';
import { QuickLink } from '../../types';

export interface QuickLinksProps {
  links: QuickLink[];
  className?: string;
}

/**
 * QuickLinks - Módulo de enlaces rápidos organizados por categoría
 * 
 * Muestra enlaces rápidos agrupados por categoría con headers visuales.
 * Permite navegación a recursos externos con retroalimentación visual.
 * 
 * Requerimientos: 7.1, 7.2, 7.3, 7.4
 */
export const QuickLinks: React.FC<QuickLinksProps> = ({
  links,
  className = ''
}) => {
  // Agrupar enlaces por categoría
  const groupedLinks = links.reduce((groups, link) => {
    const category = link.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(link);
    return groups;
  }, {} as Record<string, QuickLink[]>);

  const handleLinkClick = (url: string) => {
    // Abrir enlace en nueva pestaña para recursos externos
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`space-y-4 ${className}`}
      role="navigation"
      aria-label="Enlaces rápidos"
    >
      {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
        <div key={category} className="space-y-2">
          {/* Header de categoría */}
          <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {category}
          </h3>
          
          {/* Enlaces de la categoría */}
          <div className="space-y-1">
            {categoryLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className="w-full flex items-center gap-3 p-2 text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label={`Abrir ${link.title} en nueva pestaña`}
              >
                {/* Icono del enlace */}
                {link.icon && (
                  <span 
                    className="text-lg flex-shrink-0" 
                    role="img" 
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                )}
                
                {/* Título del enlace */}
                <span className="flex-1 truncate">
                  {link.title}
                </span>
                
                {/* Indicador de enlace externo */}
                <svg
                  className="w-3 h-3 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {/* Mensaje cuando no hay enlaces */}
      {links.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No hay enlaces rápidos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default QuickLinks;