import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { SearchBar } from './SearchBar';
import { UserControls } from './UserControls';
import { ThemeToggle } from '../ui/ThemeToggle';
import { IoNotifications } from 'react-icons/io5';
import { useSkipLinks } from '../../hooks/useAccessibility';

export interface HeaderProps {
  user: UserProfile;
  onSearch?: (query: string) => void;
}

/**
 * Header - Componente de barra superior con logo, búsqueda y controles de usuario
 * 
 * Funcionalidades:
 * - Logo corporativo con animación
 * - Barra de búsqueda funcional
 * - Controles de usuario con dropdown de perfil
 */
export const Header: React.FC<HeaderProps> = ({
  user,
  onSearch
}) => {
  const { skipToContent, skipToNavigation } = useSkipLinks();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

      <div className="flex items-center justify-between h-16 container-padding">
        {/* Logo Section */}
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
              <h1 className="heading-3 text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors duration-200">
                Corporate Hub
              </h1>
              <p className="caption text-gray-500 dark:text-gray-400 -mt-1">
                Dashboard Corporativo
              </p>
            </div>
          </a>
        </div>

        {/* Center Spacer */}
        <div className="flex-1"></div>

        {/* Search and User Controls Section */}
        <div className="flex items-center space-x-4" role="toolbar" aria-label="Controles de usuario">
          {/* Search Section */}
          <div className="relative">
            {isSearchExpanded ? (
              <div className="flex items-center">
                <div className="w-64 sm:w-80">
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
                  className="ml-2 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-ring rounded-lg transition-colors duration-200"
                  aria-label="Cerrar búsqueda"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-ring rounded-lg transition-colors duration-200"
                aria-label="Abrir búsqueda"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}
          </div>

          {/* Notifications Button */}
          <button 
            className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus-ring rounded-lg transition-colors duration-200"
            aria-label="Notificaciones (3 nuevas)"
            aria-describedby="notifications-tooltip"
          >
            <IoNotifications className="w-6 h-6" aria-hidden="true" />
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

export default Header;