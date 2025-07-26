import React from 'react';
import { SidebarTabs } from './SidebarTabs';
import mockData from '../../data/mockData.json';

/**
 * SidebarTabsDemo - Componente de demostración para el nuevo SidebarTabs
 * 
 * Muestra cómo se vería el sidebar con pestañas agrupando:
 * - Enlaces rápidos
 * - Espacios de colaboración  
 * - Aplicaciones
 */
export const SidebarTabsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Demo: Sidebar con Pestañas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Este es un ensayo de cómo quedaría el sidebar agrupando Enlaces rápidos, 
            Espacios de Colaboración y Aplicaciones en un mismo componente con pestañas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal simulado */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Contenido Principal
              </h2>
              <div className="space-y-4">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Noticias Destacadas</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Próximos Eventos</span>
                  </div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Nuevos Miembros</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información sobre las mejoras */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
                💡 Mejoras del Nuevo Diseño
              </h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Ahorro de espacio:</strong> Los tres módulos ahora ocupan el espacio de uno</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Navegación intuitiva:</strong> Pestañas con iconos y contadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Mejor organización:</strong> Contenido relacionado agrupado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Responsive:</strong> Se adapta a diferentes tamaños de pantalla</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong>Accesibilidad:</strong> Navegación por teclado y lectores de pantalla</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Nuevo Sidebar con Pestañas */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <SidebarTabs
                quickLinks={mockData.quickLinks}
                spaces={mockData.spaces}
                applications={mockData.applications}
              />
            </div>
          </div>
        </div>

        {/* Comparación con el diseño anterior */}
        <div className="mt-12 bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📊 Comparación de Espacio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Diseño Anterior</h4>
              <div className="space-y-2">
                <div className="h-16 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded flex items-center justify-center text-red-700 dark:text-red-300 text-sm">
                  Enlaces Rápidos
                </div>
                <div className="h-16 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded flex items-center justify-center text-red-700 dark:text-red-300 text-sm">
                  Espacios de Colaboración
                </div>
                <div className="h-16 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded flex items-center justify-center text-red-700 dark:text-red-300 text-sm">
                  Aplicaciones
                </div>
                <div className="h-12 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded flex items-center justify-center text-red-700 dark:text-red-300 text-sm">
                  Soporte
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Total: ~220px de altura
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Nuevo Diseño</h4>
              <div className="space-y-2">
                <div className="h-32 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded flex items-center justify-center text-green-700 dark:text-green-300 text-sm">
                  Componente con Pestañas<br/>
                  (Enlaces + Espacios + Apps)
                </div>
                <div className="h-12 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded flex items-center justify-center text-green-700 dark:text-green-300 text-sm">
                  Soporte
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Total: ~176px de altura
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
            <p className="text-green-800 dark:text-green-300 text-sm font-medium">
              🎉 Ahorro de espacio: ~44px (20% menos altura)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarTabsDemo;