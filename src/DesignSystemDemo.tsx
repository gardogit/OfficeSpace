import React from 'react';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Avatar } from './components/ui/Avatar';

const DesignSystemDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="heading-1 mb-4">Sistema de Diseño Corporativo</h1>
          <p className="body-large text-gray-600">
            Dashboard con diseño consistente y componentes reutilizables
          </p>
        </header>

        {/* Color Palette */}
        <Card title="Paleta de Colores">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-lg mx-auto mb-2"></div>
              <p className="caption">Primary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-lg mx-auto mb-2"></div>
              <p className="caption">Success</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warning-500 rounded-lg mx-auto mb-2"></div>
              <p className="caption">Warning</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-error-500 rounded-lg mx-auto mb-2"></div>
              <p className="caption">Error</p>
            </div>
          </div>
        </Card>

        {/* Typography */}
        <Card title="Tipografía">
          <div className="space-y-4">
            <div>
              <h1 className="heading-1">Heading 1 - Título Principal</h1>
              <h2 className="heading-2">Heading 2 - Título Secundario</h2>
              <h3 className="heading-3">Heading 3 - Subtítulo</h3>
              <h4 className="heading-4">Heading 4 - Encabezado</h4>
            </div>
            <div>
              <p className="body-large">Body Large - Texto principal destacado</p>
              <p className="body-base">Body Base - Texto principal estándar</p>
              <p className="body-small">Body Small - Texto secundario</p>
              <p className="caption">Caption - Texto de apoyo y etiquetas</p>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <Card title="Botones">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button 
                icon={<span>🚀</span>}
                iconPosition="left"
              >
                With Icon
              </Button>
            </div>
          </div>
        </Card>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="default" title="Card Default">
            <p className="body-small">Esta es una tarjeta estándar con estilo por defecto.</p>
          </Card>
          
          <Card variant="compact" title="Card Compact">
            <p className="body-small">Tarjeta compacta con menos padding.</p>
          </Card>
          
          <Card variant="highlighted" title="Card Highlighted">
            <p className="body-small">Tarjeta destacada con fondo de color.</p>
          </Card>
          
          <Card variant="elevated" title="Card Elevated">
            <p className="body-small">Tarjeta elevada con sombra prominente.</p>
          </Card>
        </div>

        {/* Avatars */}
        <Card title="Avatares">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name="María González" size="xs" />
              <Avatar name="Juan Pérez" size="sm" />
              <Avatar name="Ana López" size="md" />
              <Avatar name="Carlos Ruiz" size="lg" />
              <Avatar name="Sofia Martín" size="xl" />
            </div>
            <div className="flex items-center gap-4">
              <Avatar 
                name="María González" 
                size="md" 
                showStatus={true} 
                status="online" 
              />
              <Avatar 
                name="Juan Pérez" 
                size="md" 
                showStatus={true} 
                status="away" 
              />
              <Avatar 
                name="Ana López" 
                size="md" 
                showStatus={true} 
                status="busy" 
              />
              <Avatar 
                name="Carlos Ruiz" 
                size="md" 
                showStatus={true} 
                status="offline" 
              />
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card title="Badges y Estados">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">Primary</span>
              <span className="badge badge-secondary">Secondary</span>
              <span className="badge badge-success">Success</span>
              <span className="badge badge-warning">Warning</span>
              <span className="badge badge-error">Error</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="status-info p-2 rounded border">Info Status</div>
              <div className="status-success p-2 rounded border">Success Status</div>
              <div className="status-warning p-2 rounded border">Warning Status</div>
              <div className="status-error p-2 rounded border">Error Status</div>
            </div>
          </div>
        </Card>

        {/* Interactive Elements */}
        <Card title="Elementos Interactivos">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                variant="compact" 
                interactive={true}
                className="cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary-600">📊</span>
                  </div>
                  <h4 className="heading-4">Hover Effect</h4>
                  <p className="body-small">Pasa el mouse por encima</p>
                </div>
              </Card>
              
              <Card 
                variant="compact" 
                interactive={true}
                className="cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-success-600">✨</span>
                  </div>
                  <h4 className="heading-4">Animation</h4>
                  <p className="body-small">Con transiciones suaves</p>
                </div>
              </Card>
              
              <Card 
                variant="compact" 
                interactive={true}
                className="cursor-pointer"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-warning-600">🎨</span>
                  </div>
                  <h4 className="heading-4">Design System</h4>
                  <p className="body-small">Consistente y escalable</p>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="body-small text-gray-500">
            Sistema de Diseño Corporativo - Dashboard Intranet
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DesignSystemDemo;