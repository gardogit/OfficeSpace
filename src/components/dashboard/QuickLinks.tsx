import React from 'react';
import { QuickLink } from '../../types';

export interface QuickLinksProps {
  links: QuickLink[];
  className?: string;
}

/**
 * QuickLinks - Módulo de enlaces rápidos organizados por categoría estilo Slack
 * 
 * Muestra enlaces rápidos agrupados por categoría con diseño compacto.
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
    // Solo mostrar como ejemplo, no abrir enlaces externos
    console.log('Enlace clickeado:', url);
  };

  return (
    <div 
      className={`space-y-4 ${className}`}
      role="navigation"
      aria-label="Enlaces rápidos"
    >
      {Object.entries(groupedLinks).map(([category, categoryLinks], index) => (
        <div key={category}>
          {/* Header de categoría - estilo Slack */}
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
            {category}
          </h3>
          
          {/* Enlaces de la categoría - diseño compacto */}
          <div className="space-y-0">
            {categoryLinks.map((link, linkIndex) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className="w-full flex items-center gap-2 px-2 py-1 text-left text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus-ring group"
                aria-label={`Abrir ${link.title}`}
              >
                {/* Icono de enlace */}
                <svg
                  className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                
                {/* Título del enlace */}
                <span className="flex-1 truncate">
                  {link.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
      
      {/* Mensaje cuando no hay enlaces */}
      {links.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="body-small text-gray-500 dark:text-gray-400">No hay enlaces rápidos disponibles</p>
        </div>
      )}
    </div>
  );
};

export default QuickLinks;