import { useState, useCallback, useMemo } from 'react';
import { NavigationSection } from '../components/layout/NavigationBar';

/**
 * Hook personalizado para manejar el estado de navegación
 * 
 * Proporciona:
 * - Estado de sección activa
 * - Función para cambiar sección
 * - Secciones predefinidas del dashboard
 */
export const useNavigation = (initialSection?: string) => {
  // Secciones predefinidas del dashboard corporativo (memoizadas)
  const sections: NavigationSection[] = useMemo(() => [
    { id: 'inicio', label: 'Inicio' },
    { id: 'noticias', label: 'Noticias' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'equipo', label: 'Equipo' },
    { id: 'recursos', label: 'Recursos' },
    { id: 'espacios', label: 'Espacios' }
  ], []);

  const [activeSection, setActiveSection] = useState<string>(
    initialSection || sections[0].id
  );

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    
    // Aquí se podría agregar lógica adicional como:
    // - Logging de navegación
    // - Actualización de URL
    // - Carga de datos específicos de la sección
    console.log(`Navegando a sección: ${sectionId}`);
  }, []);

  return {
    sections,
    activeSection,
    handleSectionChange
  };
};

export default useNavigation;