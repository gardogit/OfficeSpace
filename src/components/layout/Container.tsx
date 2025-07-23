import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Container - Componente para contenedores con ancho máximo
 * y padding consistente según el sistema de diseño.
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  padding = 'md',
  className = ''
}) => {
  // Mapeo de tamaños a clases de Tailwind
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  // Mapeo de padding a clases de Tailwind
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 sm:px-6 lg:px-8 py-4',
    lg: 'px-6 sm:px-8 lg:px-12 py-6'
  };

  return (
    <div className={`mx-auto ${sizeClasses[size]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;