import { Card, Button, Avatar } from './components/ui';
import { MainLayout, GridContainer, Header } from './components/layout';
import mockData from './data/mockData.json';
import { MockData } from './types';

function App() {
  // Cast mock data to proper type
  const data = mockData as MockData;

  // Handle search functionality
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Here you would implement actual search logic
  };

  // Mock navigation component
  const NavigationDemo = () => (
    <div className="px-4 sm:px-6 lg:px-8">
      <nav className="flex space-x-8 py-4">
        <a href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
          Inicio
        </a>
        <a href="#" className="text-gray-500 hover:text-gray-700 pb-2">
          Noticias
        </a>
        <a href="#" className="text-gray-500 hover:text-gray-700 pb-2">
          Eventos
        </a>
        <a href="#" className="text-gray-500 hover:text-gray-700 pb-2">
          Equipo
        </a>
      </nav>
    </div>
  );

  // Mock sidebar component
  const SidebarDemo = () => (
    <div className="space-y-6">
      <Card title="Enlaces Rápidos">
        <div className="space-y-2">
          <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
            Portal de Empleados
          </a>
          <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
            Sistema de Tickets
          </a>
          <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
            Directorio Corporativo
          </a>
        </div>
      </Card>
      
      <Card title="Espacios de Colaboración">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Proyecto Alpha</span>
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Equipo Marketing</span>
            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <MainLayout
      header={<Header user={data.currentUser} onSearch={handleSearch} />}
      navigation={<NavigationDemo />}
      sidebar={<SidebarDemo />}
    >
      {/* Main Content Area */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Header Component Demo
        </h2>
        
        {/* Header Demo Info */}
        <Card title="Header Component Implementado" className="mb-8">
          <div className="space-y-4 text-sm text-gray-600">
            <p>✅ <strong>Logo corporativo:</strong> Muestra el logo "C" y nombre "Corporate Hub"</p>
            <p>✅ <strong>Barra de búsqueda funcional:</strong> Con icono de búsqueda y botón de limpiar</p>
            <p>✅ <strong>Controles de usuario:</strong> Avatar, información del usuario y dropdown con opciones</p>
            <p>✅ <strong>Usuario actual:</strong> {data.currentUser.name} ({data.currentUser.role})</p>
            <p>✅ <strong>Responsive design:</strong> Se adapta a diferentes tamaños de pantalla</p>
            <p>✅ <strong>Integración con datos mock:</strong> Usa datos del archivo mockData.json</p>
          </div>
        </Card>
        
        {/* Demo de componentes base usando GridContainer */}
        <GridContainer columns={{ sm: 1, md: 2, lg: 3 }} gap="md" className="mb-8">
          <Card title="Card Default">
            <p className="text-gray-600">Este es un card con variante default en el nuevo layout.</p>
          </Card>
          
          <Card title="Card Compact" variant="compact">
            <p className="text-gray-600">Este es un card con variante compact.</p>
          </Card>
          
          <Card title="Card Highlighted" variant="highlighted">
            <p className="text-gray-600">Este es un card con variante highlighted.</p>
          </Card>
        </GridContainer>
        
        {/* Buttons Demo */}
        <Card title="Componentes de Interfaz" className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar name="Juan Pérez" size="sm" />
              <Avatar name="María García" size="md" />
              <Avatar name="Carlos López" size="lg" />
            </div>
          </div>
        </Card>

        {/* Layout Demo Content */}
        <Card title="Características del Layout">
          <div className="space-y-4 text-sm text-gray-600">
            <p>✅ Layout responsive de dos columnas</p>
            <p>✅ Header sticky con navegación</p>
            <p>✅ Sidebar con contenido adicional</p>
            <p>✅ Sistema de grid consistente</p>
            <p>✅ Espaciado uniforme según sistema de diseño</p>
            <p>✅ Breakpoints responsive: sm, md, lg, xl</p>
          </div>
        </Card>
      </section>
    </MainLayout>
  );
}

export default App