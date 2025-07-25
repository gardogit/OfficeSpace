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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      'Recursos Humanos': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      'Herramientas': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'Documentos': (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
    return icons[category] || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  };

  return (
    <div 
      className={`content-spacing ${className}`}
      role="navigation"
      aria-label="Enlaces rápidos"
    >
      {Object.entries(groupedLinks).map(([category, categoryLinks], index) => (
        <div key={category} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          {/* Header de categoría */}
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div className="text-primary-600 dark:text-primary-400">
              {getCategoryIcon(category)}
            </div>
            <h3 className="heading-4 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {category}
            </h3>
          </div>
          
          {/* Enlaces de la categoría */}
          <div className="space-y-1">
            {categoryLinks.map((link, linkIndex) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className="w-full flex items-center gap-3 p-3 text-left body-small text-gray-600 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200 focus-ring group hover-lift"
                aria-label={`Abrir ${link.title} en nueva pestaña`}
                style={{ animationDelay: `${(index * 100) + (linkIndex * 50)}ms` }}
              >
                {/* Icono del enlace */}
                {link.icon && (
                  <span 
                    className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200" 
                    role="img" 
                    aria-hidden="true"
                  >
                    {link.icon}
                  </span>
                )}
                
                {/* Título del enlace */}
                <span className="flex-1 truncate font-medium group-hover:text-primary-800 dark:group-hover:text-primary-300">
                  {link.title}
                </span>
                
                {/* Indicador de enlace externo */}
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-200"
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