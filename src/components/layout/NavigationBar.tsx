import React, { useState, useRef, useCallback } from 'react';
import { useKeyboardNavigation, useRovingTabIndex } from '../../hooks/useAccessibility';
import { KEYS } from '../../utils/accessibility';

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
  const activeIndex = sections.findIndex(section => section.id === currentActiveSection);

  // Keyboard navigation
  const { containerRef } = useKeyboardNavigation(sections, {
    orientation: 'horizontal',
    onActivate: (index) => {
      const section = sections[index];
      if (section) {
        handleSectionActivation(section.id);
      }
    }
  });

  // Roving tabindex for better keyboard navigation
  const { getTabIndex, getAriaSelected } = useRovingTabIndex(sections, activeIndex);

  const handleSectionActivation = useCallback((sectionId: string) => {
    setInternalActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  }, [onSectionChange]);

  const handleSectionClick = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    handleSectionActivation(sectionId);
  };

  const handleKeyDown = (sectionId: string, event: React.KeyboardEvent) => {
    if (event.key === KEYS.ENTER || event.key === KEYS.SPACE) {
      event.preventDefault();
      handleSectionActivation(sectionId);
    }
  };

  return (
    <div className={`${className}`} id="main-navigation">
      <nav 
        ref={containerRef}
        className="flex space-x-8 py-4 px-4 sm:px-6 lg:px-8 ml-80 overflow-x-auto scrollbar-thin"
        role="tablist"
        aria-label="Navegación principal del dashboard"
      >
        {sections.map((section, index) => {
          const isActive = currentActiveSection === section.id;
          
          return (
            <a
              key={section.id}
              href={section.href || '#'}
              onClick={(e) => handleSectionClick(section.id, e)}
              onKeyDown={(e) => handleKeyDown(section.id, e)}
              className={`
                relative whitespace-nowrap pb-2 px-1 text-sm font-medium transition-colors duration-200
                focus-ring rounded-sm keyboard-navigation
                ${isActive
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
              role="tab"
              aria-selected={getAriaSelected(index)}
              aria-controls={`tabpanel-${section.id}`}
              tabIndex={getTabIndex(index)}
              id={`tab-${section.id}`}
            >
              {section.label}
              
              {/* Indicador visual adicional para sección activa */}
              {isActive && (
                <span 
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-600 dark:bg-primary-400"
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