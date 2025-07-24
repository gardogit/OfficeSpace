import { useState } from 'react';
import { MainLayout, Header, NavigationBar, Sidebar } from './components/layout';
import { 
  NewsCarousel, 
  UpcomingEventsList, 
  NewHiresGrid 
} from './components/dashboard';
import { useNavigation } from './hooks';
import mockData from './data/mockData.json';
import { MockData } from './types';

function App() {
  // Cast mock data to proper type
  const data = mockData as MockData;

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

  // Render content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'noticias':
        return (
          <section aria-labelledby="news-heading">
            <h2 id="news-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Noticias de la Empresa
            </h2>
            <NewsCarousel 
              news={filteredNews} 
              autoRotate={!searchQuery}
            />
          </section>
        );

      case 'eventos':
        return (
          <section aria-labelledby="events-heading">
            <h2 id="events-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Próximos Eventos
            </h2>
            <UpcomingEventsList events={filteredEvents} showTitle={false} />
          </section>
        );

      case 'equipo':
        return (
          <section aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-2xl font-semibold text-gray-900 mb-6">
              Nuevos Miembros del Equipo
            </h2>
            <NewHiresGrid newHires={filteredNewHires} />
          </section>
        );

      case 'recursos':
        return (
          <section aria-labelledby="resources-heading">
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
          <section aria-labelledby="spaces-heading">
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
          <>
            {/* News Carousel Section */}
            {filteredNews.length > 0 && (
              <section aria-labelledby="news-heading">
                <h2 id="news-heading" className="text-2xl font-semibold text-gray-900 mb-6">
                  Noticias Destacadas
                </h2>
                <NewsCarousel 
                  news={filteredNews} 
                  autoRotate={!searchQuery}
                />
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
                  <UpcomingEventsList events={filteredEvents} showTitle={false} />
                </section>
              )}

              {/* New Hires Section */}
              {filteredNewHires.length > 0 && (
                <section aria-labelledby="newhires-heading">
                  <h2 id="newhires-heading" className="text-xl font-semibold text-gray-900 mb-4">
                    Nuevos Miembros del Equipo
                  </h2>
                  <NewHiresGrid newHires={filteredNewHires} />
                </section>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <MainLayout
      header={<Header user={data.currentUser} onSearch={handleSearch} />}
      navigation={
        <NavigationBar
          sections={sections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      }
      sidebar={
        <Sidebar
          quickLinks={data.quickLinks}
          spaces={data.spaces}
          applications={data.applications}
        />
      }
    >
      {/* Main Dashboard Content */}
      <div className="space-y-8">
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
          <div className="text-center py-12">
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
      </div>
    </MainLayout>
  );
}

export default App