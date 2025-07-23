import { Card, Button, Avatar } from './components/ui';
import { MainLayout, GridContainer, Header, NavigationBar } from './components/layout';
import { useNavigation } from './hooks';
import mockData from './data/mockData.json';
import { MockData } from './types';

function App() {
  // Cast mock data to proper type
  const data = mockData as MockData;

  // Navigation state management
  const { sections, activeSection, handleSectionChange } = useNavigation();

  // Handle search functionality
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Here you would implement actual search logic
  };

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
      navigation={
        <NavigationBar
          sections={sections}
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
      }
      sidebar={<SidebarDemo />}
    >
      {/* Main Content Area */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          NavigationBar Component Demo
        </h2>
        
        {/* NavigationBar Demo Info */}
        <Card title="NavigationBar Component Implementado" className="mb-8">
          <div className="space-y-4 text-sm text-gray-600">
            <p>✅ <strong>Navegación horizontal:</strong> Secciones organizadas horizontalmente con scroll en móvil</p>
            <p>✅ <strong>Indicador visual activo:</strong> Sección activa marcada con color azul y borde inferior</p>
            <p>✅ <strong>Estado de navegación:</strong> Manejo de estado con hook personalizado useNavigation</p>
            <p>✅ <strong>Sección actual:</strong> {sections.find(s => s.id === activeSection)?.label}</p>
            <p>✅ <strong>Accesibilidad:</strong> Soporte para navegación por teclado y ARIA labels</p>
            <p>✅ <strong>Responsive design:</strong> Scroll horizontal en dispositivos móviles</p>
            <p>✅ <strong>Transiciones suaves:</strong> Efectos hover y cambios de estado animados</p>
          </div>
        </Card>
        
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