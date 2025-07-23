import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  navigation?: React.ReactNode;
}

/**
 * MainLayout - Componente principal que define la estructura de dos columnas
 * del dashboard de intranet corporativa.
 * 
 * Estructura:
 * - Header: Barra superior fija
 * - Navigation: Barra de navegación horizontal
 * - Main Content: Área principal de contenido (columna izquierda)
 * - Sidebar: Barra lateral derecha con módulos adicionales
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  header,
  sidebar,
  navigation
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Barra superior */}
      {header && (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          {header}
        </header>
      )}

      {/* Navigation Bar - Navegación horizontal */}
      {navigation && (
        <nav className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          {navigation}
        </nav>
      )}

      {/* Main Container - Layout de dos columnas */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content Area - Columna principal */}
          <main className="lg:col-span-8 xl:col-span-9">
            <div className="space-y-6">
              {children}
            </div>
          </main>

          {/* Sidebar - Columna lateral */}
          {sidebar && (
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-32 space-y-6">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;