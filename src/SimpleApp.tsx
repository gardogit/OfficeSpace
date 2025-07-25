import { useState } from 'react';
import { MainLayout, Header, NavigationBar, Sidebar } from './components/layout';
import { 
  NewsCarousel, 
  UpcomingEventsList, 
  NewHiresGrid 
} from './components/dashboard';
import mockData from './data/mockData.json';

function SimpleApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('inicio');

  const sections = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'noticias', label: 'Noticias', icon: '📰' },
    { id: 'eventos', label: 'Eventos', icon: '📅' },
    { id: 'equipo', label: 'Equipo', icon: '👥' },
    { id: 'recursos', label: 'Recursos', icon: '🔗' },
    { id: 'espacios', label: 'Espacios', icon: '🏢' }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <MainLayout
      header={
        <Header user={mockData.currentUser} onSearch={handleSearch} />
      }
      navigation={
        <NavigationBar
          sections={sections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      }
      sidebar={
        <Sidebar
          quickLinks={mockData.quickLinks}
          spaces={mockData.spaces}
          applications={mockData.applications}
        />
      }
    >
      <div className="space-y-8">
        {/* Noticias */}
        <section>
          <h2 className="heading-2 mb-6">Noticias Destacadas</h2>
          <NewsCarousel news={mockData.news} />
        </section>

        {/* Eventos y Equipo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="heading-3 mb-4">Próximos Eventos</h2>
            <UpcomingEventsList events={mockData.events} showTitle={false} />
          </section>

          <section>
            <h2 className="heading-3 mb-4">Nuevos Miembros del Equipo</h2>
            <NewHiresGrid newHires={mockData.newHires} />
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default SimpleApp;