import React, { useState } from 'react';
import { QuickLink, Space, Application } from '../../types';
import { QuickLinks } from '../dashboard/QuickLinks';
import { SpacesList } from '../dashboard/SpacesList';
import { LaunchPad } from '../dashboard/LaunchPad';
import { Card } from '../ui';

interface SidebarTabsProps {
  quickLinks: QuickLink[];
  spaces: Space[];
  applications: Application[];
  className?: string;
}

type TabId = 'links' | 'spaces' | 'apps';

interface Tab {
  id: TabId;
  label: string;
  icon: JSX.Element;
  count?: number;
}

/**
 * SidebarTabs - Columna lateral fija con pestañas verticales
 * 
 * Permite cambiar entre los tres módulos principales usando pestañas verticales:
 * - Enlaces Rápidos: Enlaces organizados por categoría estilo Slack
 * - Espacios de Colaboración: Lista de espacios con indicadores de actividad
 * - Aplicaciones: Cuadrícula 3x3 de aplicaciones corporativas
 */
export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  quickLinks,
  spaces,
  applications,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('links');

  const tabs: Tab[] = [
    {
      id: 'links',
      label: 'Enlaces',
      count: quickLinks.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    },
    {
      id: 'spaces',
      label: 'Espacios',
      count: spaces.filter(space => space.isActive).length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'apps',
      label: 'Apps',
      count: applications.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'links':
        return <QuickLinks links={quickLinks} />;
      case 'spaces':
        return <SpacesList spaces={spaces} />;
      case 'apps':
        return <LaunchPad applications={applications} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Vertical Tab Navigation */}
      <div className="w-20 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <nav className="flex flex-col flex-1 py-4" role="tablist" aria-label="Navegación de pestañas">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center p-3 mb-2 mx-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group ${
                activeTab === tab.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
            >
              <div className="relative">
                <div className="group-hover:scale-110 transition-transform duration-200">
                  {tab.icon}
                </div>
                {/* Counter badge solapado sobre el ícono */}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-400 dark:bg-gray-600 text-white'
                  }`}>
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-normal">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Help Button at Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
          <button
            onClick={() => {
              // Handle help action
              console.log('Help clicked');
            }}
            className="relative flex flex-col items-center justify-center p-3 mb-2 mx-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 group text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Ayuda y soporte"
          >
            <div className="group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs mt-1 font-normal">Ayuda</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="flex-1 p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgb(209 213 219) transparent'
          }}
          aria-label="Contenido de la barra lateral"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SidebarTabs;