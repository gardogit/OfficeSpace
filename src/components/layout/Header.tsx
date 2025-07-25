import React from 'react';
import { UserProfile } from '../../types';
import { SearchBar } from './SearchBar';
import { UserControls } from './UserControls';

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
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 container-padding">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center group">
              {/* Company Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-xl select-none">
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
            </div>
          </div>
        </div>

        {/* Search Section - Center */}
        <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
          <SearchBar onSearch={onSearch} />
        </div>

        {/* User Controls Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications Button */}
          <button 
            className="relative p-2 text-gray-400 hover:text-gray-600 focus-ring rounded-lg transition-colors duration-200"
            aria-label="Notificaciones"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l3.93 3.93-1.41 1.41-3.93-3.93 1.41-1.41zM1.39 4.22l18.38 18.38-1.41 1.41L0 5.64l1.39-1.42z" />
            </svg>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full animate-pulse" />
          </button>

          {/* Help Button */}
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 focus-ring rounded-lg transition-colors duration-200"
            aria-label="Ayuda"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <UserControls user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;