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
 * - Logo corporativo
 * - Barra de búsqueda funcional
 * - Controles de usuario con dropdown de perfil
 */
export const Header: React.FC<HeaderProps> = ({
  user,
  onSearch
}) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex items-center">
            {/* Company Logo */}
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-900 hidden sm:block">
              Corporate Hub
            </span>
          </div>
        </div>
      </div>

      {/* Search Section - Center */}
      <div className="flex-1 max-w-lg mx-4 sm:mx-8">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* User Controls Section */}
      <div className="flex items-center">
        <UserControls user={user} />
      </div>
    </div>
  );
};

export default Header;