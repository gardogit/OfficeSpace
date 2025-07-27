import { SidebarTabsDemo } from './components/layout/SidebarTabsDemo';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * SidebarTabsApp - Aplicación de demostración para el nuevo SidebarTabs
 * 
 * Esta aplicación muestra cómo se vería el dashboard con el nuevo componente
 * SidebarTabs que agrupa Enlaces rápidos, Espacios de Colaboración y Aplicaciones
 * en un mismo componente con pestañas.
 */
function SidebarTabsApp() {
  return (
    <ThemeProvider>
      <SidebarTabsDemo />
    </ThemeProvider>
  );
}

export default SidebarTabsApp;