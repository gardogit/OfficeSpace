import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  navigation?: React.ReactNode;
}

/**
 * MainLayout - Componente principal con navbar de ancho completo y sidebar debajo
 * del dashboard de intranet corporativa.
 * 
 * Estructura:
 * - Header: Barra superior fija de ancho completo
 * - Navigation: Barra de navegación horizontal de ancho completo
 * - Sidebar: Columna fija a la izquierda con pestañas verticales (debajo del navbar)
 * - Main Content: Área principal de contenido
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  sidebar,
  navigation
}) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      {/* Header - Barra superior de ancho completo */}
      {header && (
        <header className="flex-shrink-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          {header}
        </header>
      )}

      {/* Navigation Bar - Navegación horizontal de ancho completo */}
      {navigation && (
        <nav className="flex-shrink-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
          {navigation}
        </nav>
      )}

      {/* Content Area - Sidebar + Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar - Columna fija a la izquierda (debajo del navbar) */}
        {sidebar && (
          <div className="flex-shrink-0 w-80 z-20">
            {sidebar}
          </div>
        )}

        {/* Main Content - Área principal con scroll */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;