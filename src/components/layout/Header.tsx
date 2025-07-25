import React from 'react';
import { UserProfile } from '../../types';
import { SearchBar } from './SearchBar';
import { UserControls } from './UserControls';
import { IoNotifications, IoHelpCircleOutline } from 'react-icons/io5';
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

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm" role="banner">
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
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <a 
              href="/" 
              className="flex items-center group focus-ring rounded-lg p-1"
              aria-label="Corporate Hub - Ir al inicio"
            >
              {/* Company Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-xl select-none" aria-hidden="true">
                  C
                </span>
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="heading-3 text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                  Corporate Hub
                </h1>
                <p className="caption text-gray-500 -mt-1">
                  Dashboard Corporativo
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Search Section - Center */}
        <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* User Controls Section */}
        <div className="flex items-center space-x-4" role="toolbar" aria-label="Controles de usuario">
          {/* Notifications Button */}
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600 focus-ring rounded-lg transition-colors duration-200"
            aria-label="Notificaciones (3 nuevas)"
            aria-describedby="notifications-tooltip"
          >
            <IoNotifications className="w-6 h-6" aria-hidden="true" />
            {/* Notification badge */}
            <span 
              className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse" 
              aria-hidden="true"
            />
            <span className="sr-only">3 notificaciones nuevas</span>
          </button>

          {/* Help Button */}
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 focus-ring rounded-lg transition-colors duration-200"
            aria-label="Ayuda y soporte"
            aria-describedby="help-tooltip"
          >
            <IoHelpCircleOutline className="w-6 h-6" aria-hidden="true" />
          </button>

          <UserControls user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;