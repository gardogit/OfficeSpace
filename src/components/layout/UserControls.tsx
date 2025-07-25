import React, { useState, useRef, useEffect } from "react";
import { UserProfile } from "../../types";
import { Avatar } from "../ui/Avatar";
import {
  IoChevronDown,
  IoPersonOutline,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
} from "react-icons/io5";

export interface UserControlsProps {
  user: UserProfile;
}

/**
 * UserControls - Componente de controles de usuario con dropdown de perfil
 *
 * Funcionalidades:
 * - Avatar del usuario
 * - Dropdown con opciones de perfil
 * - Información del usuario
 * - Opciones de configuración y logout
 */
export const UserControls: React.FC<UserControlsProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`User action: ${action}`);
    setIsDropdownOpen(false);
    // Here you would implement the actual actions
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {/* User Avatar */}
        <Avatar src={user.avatar} name={user.name} size="sm" />

        {/* User Info - Hidden on mobile */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>

        {/* Dropdown Arrow */}
        <IoChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Avatar src={user.avatar} name={user.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                <p className="text-xs text-gray-400">
                  {user.role} • {user.department}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleMenuItemClick("profile")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <IoPersonOutline className="w-4 h-4 mr-3 text-gray-400" />
              Ver Perfil
            </button>

            <button
              onClick={() => handleMenuItemClick("settings")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <IoSettingsOutline className="w-4 h-4 mr-3 text-gray-400" />
              Configuración
            </button>

            <button
              onClick={() => handleMenuItemClick("notifications")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <IoNotificationsOutline className="w-4 h-4 mr-3 text-gray-400" />
              Notificaciones
            </button>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={() => handleMenuItemClick("help")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <IoHelpCircleOutline className="w-4 h-4 mr-3 text-gray-400" />
              Ayuda y Soporte
            </button>

            <button
              onClick={() => handleMenuItemClick("logout")}
              className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-150"
            >
              <IoLogOutOutline className="w-4 h-4 mr-3 text-red-400" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserControls;
