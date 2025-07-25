import { useState } from 'react';
import { MainLayout, Header, NavigationBar, Sidebar } from './components/layout';
import { 
  NewsCarousel, 
  UpcomingEventsList, 
  NewHiresGrid 
} from './components/dashboard';
import { 
  CriticalErrorBoundary,
  DashboardSkeleton,
  EnhancedErrorBoundary
} from './components/common';
import { useNavigation, useMockDataLoader } from './hooks';
import mockData from './data/mockData.json';

import { sanitizePartialMockData, getDataHealthStatus } from './utils/dataValidation';
import { ErrorMetrics } from './utils/errorRecovery';

function App() {
  // Load and validate mock data with loading states
  const { data: rawData, isLoading: isDataLoading, error: dataError, retry: retryDataLoad } = useMockDataLoader(mockData, 800);
  
  // Sanitize data to ensure it's valid with partial recovery
  const data = rawData ? sanitizePartialMockData(rawData) : null;
  
  // Get data health status for monitoring
  const dataHealth = data ? getDataHealthStatus(data) : null;

  // Navigation state management
  const { sections, activeSection, handleSectionChange } = useNavigation();

  // Search state management
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // Here you would implement actual search logic
    // For now, we'll just update the state to show search is working
  };

  // Filter content based on active section and search query
  const getFilteredContent = () => {
    if (!data) return { news: [], events: [], newHires: [] };
    
    let news = data.news;
    let events = data.events;
    let newHires = data.newHires;

    // Filter by active section
    switch (activeSection) {
      case 'noticias':
        events = [];
        newHires = [];
        break;
      case 'eventos':
        news = [];
        newHires = [];
        break;
      case 'equipo':
        news = [];
        events = [];
        break;
      case 'inicio':
      default:
        // Show all content on inicio
        break;
    }

    // Apply search filter if query exists
    if (searchQuery) {
      news = news.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

      events = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

      newHires = newHires.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return { news, events, newHires };
  };

  const { news: filteredNews, events: filteredEvents, newHires: filteredNewHires } = getFilteredContent();

  // Show loading state while data is loading
  if (isDataLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state if data loading failed
  if (dataError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg border border-red-200 shadow-sm p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Error al cargar el dashboard
            </h2>
            <p className="text-sm text-red-700 mb-6">
              {dataError?.message || 'No se pudieron cargar los datos del dashboard. Por favor, intenta nuevamente.'}
            </p>
            <button
              onClick={retryDataLoad}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'noticias':
        return (
          <section aria-labelledby="news-heading" id="tabpanel-noticias" role="tabpanel" aria-labelledby="tab-noticias">
            <h2 id="news-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Noticias de la Empresa
            </h2>
            <EnhancedErrorBoundary 
              componentName="Noticias"
              onError={(error) => ErrorMetrics.getInstance().recordError('NewsCarousel', error)}
            >
              <NewsCarousel 
                news={filteredNews} 
                autoRotate={!searchQuery}
              />
            </EnhancedErrorBoundary>
          </section>
        );

      case 'eventos':
        return (
          <section aria-labelledby="events-heading" id="tabpanel-eventos" role="tabpanel" aria-labelledby="tab-eventos">
            <h2 id="events-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Próximos Eventos
            </h2>
            <EnhancedErrorBoundary 
              componentName="Eventos"
              onError={(error) => ErrorMetrics.getInstance().recordError('UpcomingEventsList', error)}
            >
              <UpcomingEventsList events={filteredEvents} showTitle={false} />
            </EnhancedErrorBoundary>
          </section>
        );

      case 'equipo':
        return (
          <section aria-labelledby="team-heading" id="tabpanel-equipo" role="tabpanel" aria-labelledby="tab-equipo">
            <h2 id="team-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Nuevos Miembros del Equipo
            </h2>
            <EnhancedErrorBoundary 
              componentName="Equipo"
              onError={(error) => ErrorMetrics.getInstance().recordError('NewHiresGrid', error)}
            >
              <NewHiresGrid newHires={filteredNewHires} />
            </EnhancedErrorBoundary>
          </section>
        );

      case 'recursos':
        return (
          <section aria-labelledby="resources-heading" id="tabpanel-recursos" role="tabpanel" aria-labelledby="tab-recursos">
            <h2 id="resources-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Recursos y Enlaces
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <p className="text-gray-600 mb-4">
                Encuentra enlaces rápidos y recursos útiles en la barra lateral derecha.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Enlaces Rápidos</h3>
                  <p className="text-sm text-blue-700">
                    Accesos directos a herramientas y recursos frecuentemente utilizados.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">Aplicaciones</h3>
                  <p className="text-sm text-green-700">
                    Lanzador de aplicaciones corporativas y herramientas externas.
                  </p>
                </div>
              </div>
            </div>
          </section>
        );

      case 'espacios':
        return (
          <section aria-labelledby="spaces-heading" id="tabpanel-espacios" role="tabpanel" aria-labelledby="tab-espacios">
            <h2 id="spaces-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Espacios de Colaboración
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <p className="text-gray-600 mb-4">
                Explora los espacios de colaboración disponibles en la barra lateral derecha.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.spaces.slice(0, 3).map((space) => (
                  <div key={space.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{space.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{space.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{space.memberCount} miembros</span>
                      <span className={`px-2 py-1 rounded-full ${
                        space.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {space.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'inicio':
      default:
        return (
          <div id="tabpanel-inicio" role="tabpanel" aria-labelledby="tab-inicio">
            {/* News Carousel Section */}
            {filteredNews.length > 0 && (
              <section aria-labelledby="news-heading">
                <h2 id="news-heading" className="text-2xl font-semibold text-gray-900 mb-6">
                  Noticias Destacadas
                </h2>
                <EnhancedErrorBoundary 
                  componentName="Noticias"
                  onError={(error) => ErrorMetrics.getInstance().recordError('NewsCarousel', error)}
                >
                  <NewsCarousel 
                    news={filteredNews} 
                    autoRotate={!searchQuery}
                  />
                </EnhancedErrorBoundary>
              </section>
            )}

            {/* Two-column layout for Events and New Hires */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Events Section */}
              {filteredEvents.length > 0 && (
                <section aria-labelledby="events-heading">
                  <h2 id="events-heading" className="text-xl font-semibold text-gray-900 mb-4">
                    Próximos Eventos
                  </h2>
                  <EnhancedErrorBoundary 
                    componentName="Eventos"
                    onError={(error) => ErrorMetrics.getInstance().recordError('UpcomingEventsList', error)}
                  >
                    <UpcomingEventsList events={filteredEvents} showTitle={false} />
                  </EnhancedErrorBoundary>
                </section>
              )}

              {/* New Hires Section */}
              {filteredNewHires.length > 0 && (
                <section aria-labelledby="newhires-heading">
                  <h2 id="newhires-heading" className="text-xl font-semibold text-gray-900 mb-4">
                    Nuevos Miembros del Equipo
                  </h2>
                  <EnhancedErrorBoundary 
                    componentName="Equipo"
                    onError={(error) => ErrorMetrics.getInstance().recordError('NewHiresGrid', error)}
                  >
                    <NewHiresGrid newHires={filteredNewHires} maxColumns={2} />
                  </EnhancedErrorBoundary>
                </section>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <CriticalErrorBoundary componentName="MainLayout">
      <MainLayout
        header={
          <CriticalErrorBoundary componentName="Header">
            <Header user={data.currentUser} onSearch={handleSearch} />
          </CriticalErrorBoundary>
        }
        navigation={
          <EnhancedErrorBoundary 
            componentName="NavigationBar"
            onError={(error) => ErrorMetrics.getInstance().recordError('NavigationBar', error)}
          >
            <NavigationBar
              sections={sections}
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </EnhancedErrorBoundary>
        }
        sidebar={
          <EnhancedErrorBoundary 
            componentName="Sidebar"
            onError={(error) => ErrorMetrics.getInstance().recordError('Sidebar', error)}
          >
            <Sidebar
              quickLinks={data.quickLinks}
              spaces={data.spaces}
              applications={data.applications}
            />
          </EnhancedErrorBoundary>
        }
      >
        {/* Data Health Status Warning */}
        {dataHealth && dataHealth.status !== 'healthy' && (
          <div className={`mb-6 p-4 rounded-lg border ${
            dataHealth.status === 'critical' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-center">
              <svg
                className={`w-5 h-5 mr-2 ${
                  dataHealth.status === 'critical' ? 'text-red-400' : 'text-yellow-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h4 className="font-medium">
                  {dataHealth.status === 'critical' ? 'Problemas críticos detectados' : 'Algunos datos no están disponibles'}
                </h4>
                <p className="text-sm mt-1">
                  {dataHealth.issues.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <main id="main-content" className="space-y-8" role="main" aria-label="Contenido principal del dashboard">
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              Mostrando resultados para: <strong>"{searchQuery}"</strong>
              {activeSection !== 'inicio' && (
                <span> en la sección <strong>{sections.find(s => s.id === activeSection)?.label}</strong></span>
              )}
            </p>
          </div>
        )}

        {/* Dynamic Content Based on Active Section */}
        {renderSectionContent()}

        {/* No Results Message */}
        {searchQuery && filteredNews.length === 0 && filteredEvents.length === 0 && filteredNewHires.length === 0 && (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                <p className="text-sm">
                  Intenta con otros términos de búsqueda o explora el contenido disponible.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      </MainLayout>
    </CriticalErrorBoundary>
  );
}

export default App