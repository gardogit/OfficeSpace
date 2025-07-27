import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { NavigationSection } from './NavigationBar';
import { SearchBar } from './SearchBar';
import { UserControls } from './UserControls';
import { ThemeToggle } from '../ui/ThemeToggle';
import { IoNotifications } from 'react-icons/io5';
import { useSkipLinks } from '../../hooks/useAccessibility';

export interface UnifiedNavbarProps {
  user: UserProfile;
  sections: NavigationSection[];
  activeSection?: string;
  onSectionChange?: (sectionId: string) => void;
  onSearch?: (query: string) => void;
}

/**
 * UnifiedNavbar - Navbar unificado con logo, navegación y controles en una sola fila
 * 
 * Funcionalidades:
 * - Logo corporativo a la izquierda
 * - Navegación principal en el centro
 * - Controles de usuario a la derecha
 * - Búsqueda expandible que oculta la navegación cuando está activa
 */
export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({
  user,
  sections,
  activeSection,
  onSectionChange,
  onSearch
}) => {
  const { skipToContent, skipToNavigation } = useSkipLinks();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [, setIsMobileMenuOpen] = useState(false);
  const [internalActiveSection, setInternalActiveSection] = useState<string>(
    activeSection || sections[0]?.id || ''
  );

  // Usar estado interno si no se proporciona activeSection controlado
  const currentActiveSection = activeSection || internalActiveSection;

  const handleSectionActivation = (sectionId: string) => {
    setInternalActiveSection(sectionId);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const handleSectionClick = (sectionId: string, event: React.MouseEvent) => {
    event.preventDefault();
    handleSectionActivation(sectionId);
    // Close mobile menu when section is selected
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200" role="banner">
      {/* Skip Links */}
      <div className="sr-only">
        <a 
          href="#main-content" 
          className="skip-link focus:not-sr-only"
          onClick={(e) => {
            e.preventDefault();
            skipToContent();
          }}
        >
          Saltar al contenido principal
        </a>
        <a 
          href="#main-navigation" 
          className="skip-link focus:not-sr-only"
          onClick={(e) => {
            e.preventDefault();
            skipToNavigation();
          }}
        >
          Saltar a la navegación
        </a>
      </div>

      <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo Section - Fixed Left */}
        <div className="flex items-center flex-shrink-0">
          <a 
            href="/" 
            className="flex items-center group focus-ring rounded-lg p-1"
            aria-label="Corporate Hub - Ir al inicio"
          >
            {/* Company Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg">
              <span className="text-white font-bold text-xl select-none" aria-hidden="true">
                C
              </span>
            </div>
            <div className="ml-3 hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-200">
                Corporate Hub
              </h1>
            </div>
          </a>
        </div>

        {/* Center Section - Navigation or Search */}
        <div className="flex-1 flex items-center justify-center px-8">
          {isSearchExpanded ? (
            /* Expanded Search */
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex-1">
                <SearchBar 
                  onSearch={(query) => {
                    if (onSearch) onSearch(query);
                    setIsSearchExpanded(false);
                  }}
                  autoFocus={true}
                />
              </div>
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="ml-3 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-ring rounded-lg transition-colors duration-200"
                aria-label="Cerrar búsqueda"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            /* Navigation Menu - Hidden on mobile */
            <nav 
              className="hidden md:flex space-x-6 overflow-x-auto scrollbar-thin"
              role="tablist"
              aria-label="Navegación principal del dashboard"
              id="main-navigation"
            >
              {sections.map((section) => {
                const isActive = currentActiveSection === section.id;
                
                return (
                  <a
                    key={section.id}
                    href={section.href || '#'}
                    onClick={(e) => handleSectionClick(section.id, e)}
                    className={`
                      relative whitespace-nowrap pb-2 px-1 text-sm font-medium transition-colors duration-200
                      focus-ring rounded-sm
                      ${isActive
                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${section.id}`}
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
          )}
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-3 flex-shrink-0" role="toolbar" aria-label="Controles de usuario">
          {/* Search Icon */}
          {!isSearchExpanded && (
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-ring rounded-lg transition-colors duration-200"
              aria-label="Abrir búsqueda"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}

          {/* Notifications Button */}
          <button 
            className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-ring rounded-lg transition-colors duration-200"
            aria-label="Notificaciones (3 nuevas)"
            aria-describedby="notifications-tooltip"
          >
            <IoNotifications className="w-5 h-5" aria-hidden="true" />
            {/* Notification badge */}
            <span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full" 
              aria-hidden="true"
            />
            <span className="sr-only">3 notificaciones nuevas</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          <UserControls user={user} />
        </div>
      </div>
    </header>
  );
};

export default UnifiedNavbar;