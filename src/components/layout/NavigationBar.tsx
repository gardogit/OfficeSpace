import React, { useState } from 'react';

export interface NavigationSection {
  id: string;
  label: string;
  href?: string;
}

interface NavigationBarProps {
  sections: NavigationSection[];
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  className?: string;
}

/**
 * NavigationBar - Componente de navegación horizontal principal
 * 
 * Características:
 * - Navegación horizontal con secciones
 * - Indicador visual de sección activa
 * - Manejo de estado de navegación
 * - Responsive design
 * - Soporte para navegación por teclado
 */
export const NavigationBar: React.FC<NavigationBarProps> = ({
  sections,
  activeSection,
  onSectionChange,
  className = ''
}) => {
  const [internalActiveSection, setInternalActiveSection] = useState<string>(
    activeSection || sections[0]?.id || ''
  );

  // Usar estado interno si no se proporciona activeSection controlado
  const currentActiveSection = activeSection || internalActiveSection;

  const handleSectionClick = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    // Actualizar estado interno
    setInternalActiveSection(sectionId);
    
    // Llamar callback si se proporciona
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const handleKeyDown = (sectionId: string, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setInternalActiveSection(sectionId);
      
      if (onSectionChange) {
        onSectionChange(sectionId);
      }
    }
  };

  return (
    <div className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <nav 
        className="flex space-x-8 py-4 overflow-x-auto"
        role="navigation"
        aria-label="Navegación principal"
      >
        {sections.map((section) => {
          const isActive = currentActiveSection === section.id;
          
          return (
            <a
              key={section.id}
              href={section.href || '#'}
              onClick={(e) => handleSectionClick(section.id, e)}
              onKeyDown={(e) => handleKeyDown(section.id, e)}
              className={`
                relative whitespace-nowrap pb-2 px-1 text-sm font-medium transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm
                ${isActive
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }
              `}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${section.id}`}
              tabIndex={0}
            >
              {section.label}
              
              {/* Indicador visual adicional para sección activa */}
              {isActive && (
                <span 
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600"
                  aria-hidden="true"
                />
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationBar;