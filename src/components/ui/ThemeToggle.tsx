import React from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ThemeToggle - Componente para cambiar entre tema claro y oscuro
 * 
 * Funcionalidades:
 * - Toggle entre tema claro y oscuro
 * - Iconos animados para cada tema
 * - Accesibilidad completa con ARIA
 * - Persistencia en localStorage
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md'
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      className={`relative p-2 transition-all duration-200 ${className}`}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <IoSunny 
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 transform ${
            isDark 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`}
          aria-hidden="true"
        />
        
        {/* Moon Icon */}
        <IoMoon 
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 transform ${
            isDark 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`}
          aria-hidden="true"
        />
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">
        {isDark ? 'Tema oscuro activo' : 'Tema claro activo'}
      </span>
    </Button>
  );
};

export default ThemeToggle;