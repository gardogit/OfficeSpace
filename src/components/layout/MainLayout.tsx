import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  sidebar?: React.ReactNode;
}

/**
 * MainLayout - Componente principal con navbar unificado de una sola fila
 * del dashboard de intranet corporativa.
 * 
 * Estructura:
 * - Navbar: Barra superior unificada con logo, navegación y controles
 * - Sidebar: Columna fija a la izquierda con pestañas verticales
 * - Main Content: Área principal de contenido
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  navbar,
  sidebar
}) => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      {/* Unified Navbar - Barra superior unificada */}
      {navbar && (
        <div className="flex-shrink-0 z-40">
          {navbar}
        </div>
      )}

      {/* Content Area - Sidebar + Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar - Responsive: full width on desktop, icon-only on mobile */}
        {sidebar && (
          <div className="flex-shrink-0 lg:w-80 w-20 z-20 relative">
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