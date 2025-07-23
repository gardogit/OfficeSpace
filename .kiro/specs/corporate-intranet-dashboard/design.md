# Documento de Diseño

## Visión General

El dashboard de intranet corporativa será una aplicación React moderna construida con TypeScript y Tailwind CSS. La arquitectura seguirá el patrón de componentes funcionales con hooks, implementando un diseño modular que facilite el mantenimiento y la escalabilidad. La aplicación utilizará un sistema de datos mock JSON que simule la estructura de una futura API REST.

## Arquitectura

### Estructura de Directorios

```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   ├── layout/           # Componentes de layout
│   ├── dashboard/        # Componentes específicos del dashboard
│   └── ui/              # Componentes de interfaz básicos
├── data/
│   └── mockData.json    # Datos mock para desarrollo
├── types/
│   └── index.ts         # Definiciones de tipos TypeScript
├── hooks/               # Custom hooks
├── utils/               # Utilidades y helpers
└── styles/
    └── globals.css      # Estilos globales y Tailwind
```

### Patrón de Arquitectura

- **Componentes Funcionales**: Uso exclusivo de componentes funcionales con React Hooks
- **Composición sobre Herencia**: Componentes pequeños y reutilizables que se componen para crear funcionalidades complejas
- **Separación de Responsabilidades**: Lógica de negocio separada de la presentación
- **Tipado Fuerte**: TypeScript para todas las interfaces y tipos de datos

## Componentes e Interfaces

### Componentes de Layout

#### MainLayout
- **Propósito**: Contenedor principal que define la estructura de dos columnas
- **Props**: `children: ReactNode`
- **Responsabilidades**:
  - Gestionar el layout responsive
  - Coordinar Header, NavigationBar, contenido principal y sidebar

#### Header
- **Propósito**: Barra superior con navegación y controles de usuario
- **Props**: `user: UserProfile, onSearch: (query: string) => void`
- **Componentes internos**:
  - Logo corporativo
  - SearchBar con funcionalidad de búsqueda
  - UserControls con dropdown de perfil

#### NavigationBar
- **Propósito**: Navegación principal horizontal
- **Props**: `activeSection: string, onSectionChange: (section: string) => void`
- **Estado**: Sección activa y navegación

#### Sidebar
- **Propósito**: Barra lateral derecha con módulos de información
- **Props**: `quickLinks: QuickLink[], spaces: Space[], apps: Application[]`
- **Componentes internos**: QuickLinks, SpacesList, LaunchPad

### Componentes de Contenido Principal

#### NewsCarousel
- **Propósito**: Carousel rotativo de noticias destacadas
- **Props**: `news: NewsArticle[], autoRotate?: boolean`
- **Estado**: Índice del artículo actual, timer para rotación automática
- **Funcionalidades**:
  - Navegación manual con botones
  - Rotación automática cada 5 segundos
  - Indicadores de posición

#### UpcomingEventsList
- **Propósito**: Lista de eventos próximos
- **Props**: `events: Event[]`
- **Funcionalidades**:
  - Ordenamiento cronológico
  - Formato de fecha y hora
  - Expansión de detalles

#### NewHiresGrid
- **Propósito**: Cuadrícula de nuevos empleados
- **Props**: `newHires: Employee[]`
- **Layout**: Grid responsive (2-4 columnas según pantalla)
- **Componentes internos**: EmployeeCard

### Componentes de Sidebar

#### QuickLinks
- **Propósito**: Enlaces rápidos organizados por categoría
- **Props**: `links: QuickLink[]`
- **Agrupación**: Por categoría con headers visuales

#### SpacesList
- **Propósito**: Lista de espacios de colaboración
- **Props**: `spaces: Space[]`
- **Funcionalidades**:
  - Indicadores de actividad
  - Acceso directo a espacios

#### LaunchPad
- **Propósito**: Cuadrícula de aplicaciones externas
- **Props**: `applications: Application[]`
- **Layout**: Grid 3x3 con iconos y etiquetas

### Componentes Reutilizables

#### Card
- **Propósito**: Contenedor base para todo el contenido
- **Props**: `title?: string, children: ReactNode, className?: string`
- **Variantes**: Default, compact, highlighted

#### Button
- **Propósito**: Botón reutilizable con variantes
- **Props**: `variant: 'primary' | 'secondary' | 'ghost', size: 'sm' | 'md' | 'lg'`

#### Avatar
- **Propósito**: Imagen de perfil con fallback
- **Props**: `src?: string, name: string, size: 'sm' | 'md' | 'lg'`

## Modelos de Datos

### Interfaces TypeScript

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  role: string;
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: Date;
  imageUrl?: string;
  category: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  organizer: string;
  attendees?: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: Date;
  avatar?: string;
  bio?: string;
}

interface QuickLink {
  id: string;
  title: string;
  url: string;
  category: string;
  icon?: string;
}

interface Space {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isActive: boolean;
  lastActivity: Date;
}

interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}
```

### Estructura de Datos Mock

El archivo `mockData.json` contendrá:
- Array de noticias (5-10 artículos)
- Array de eventos (8-12 eventos próximos)
- Array de nuevos empleados (6-9 perfiles)
- Array de enlaces rápidos organizados por categorías
- Array de espacios de colaboración
- Array de aplicaciones externas
- Perfil de usuario actual

## Manejo de Errores

### Estrategia de Error Boundaries
- Error Boundary principal para capturar errores de componentes
- Error Boundaries específicos para secciones críticas
- Fallback UI informativos y profesionales

### Validación de Datos
- Validación de tipos en tiempo de ejecución para datos mock
- Manejo graceful de datos faltantes o malformados
- Logs de errores para debugging

### Estados de Carga
- Skeleton loaders para componentes que simulan carga de datos
- Estados de loading específicos por componente
- Indicadores visuales de progreso

## Estrategia de Testing

### Tipos de Tests

#### Tests Unitarios
- Componentes individuales con React Testing Library
- Funciones utilitarias y helpers
- Custom hooks

#### Tests de Integración
- Interacción entre componentes padre-hijo
- Flujos de navegación
- Manejo de estado compartido

#### Tests de Accesibilidad
- Cumplimiento de estándares WCAG 2.1
- Navegación por teclado
- Lectores de pantalla

### Herramientas de Testing
- Jest como test runner
- React Testing Library para testing de componentes
- MSW (Mock Service Worker) para simular APIs futuras
- Axe-core para testing de accesibilidad

## Sistema de Diseño

### Paleta de Colores
```css
/* Colores principales */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Colores neutros */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;

/* Colores de estado */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;
```

### Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Jerarquía**: h1 (2xl), h2 (xl), h3 (lg), body (base), small (sm)
- **Pesos**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Espaciado
- **Sistema de 8px**: Múltiplos de 8 para consistencia
- **Espaciado de componentes**: 16px, 24px, 32px
- **Márgenes de contenido**: 16px (móvil), 24px (tablet), 32px (desktop)

### Breakpoints Responsive
```css
/* Tailwind breakpoints */
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeño */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Sistema de Cards
- **Elevación**: shadow-sm para cards normales, shadow-md para cards destacadas
- **Bordering**: rounded-lg con border-gray-200
- **Padding**: p-4 (móvil), p-6 (desktop)
- **Hover states**: Transiciones suaves con hover:shadow-md

## Consideraciones de Performance

### Optimizaciones
- Lazy loading para componentes no críticos
- Memoización de componentes con React.memo
- useMemo y useCallback para cálculos costosos
- Optimización de imágenes con lazy loading

### Bundle Splitting
- Code splitting por rutas principales
- Componentes pesados cargados dinámicamente
- Vendor chunks separados

## Accesibilidad

### Estándares WCAG 2.1
- Contraste mínimo AA (4.5:1)
- Navegación por teclado completa
- Etiquetas ARIA apropiadas
- Texto alternativo para imágenes

### Consideraciones Específicas
- Focus management en modales y dropdowns
- Anuncios de cambios dinámicos con live regions
- Navegación semántica con landmarks
- Soporte para lectores de pantalla