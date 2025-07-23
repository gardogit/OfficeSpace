import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpacesList } from '../../../components/dashboard/SpacesList';
import { Space } from '../../../types';

// Mock console.log para las pruebas
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('SpacesList', () => {
  const mockSpaces: Space[] = [
    {
      id: 'space-001',
      name: 'Proyecto Alpha',
      description: 'Desarrollo de la nueva plataforma de e-commerce',
      memberCount: 8,
      isActive: true,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutos atrás
    },
    {
      id: 'space-002',
      name: 'Equipo de Marketing',
      description: 'Coordinación de campañas y estrategias de marketing digital para el próximo trimestre',
      memberCount: 12,
      isActive: true,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 horas atrás
    },
    {
      id: 'space-003',
      name: 'Recursos Humanos',
      description: 'Gestión de talento y cultura organizacional',
      memberCount: 5,
      isActive: false,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 días atrás
    }
  ];

  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar la lista de espacios correctamente', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      // Verificar que todos los espacios se renderizan
      expect(screen.getByText('Proyecto Alpha')).toBeInTheDocument();
      expect(screen.getByText('Equipo de Marketing')).toBeInTheDocument();
      expect(screen.getByText('Recursos Humanos')).toBeInTheDocument();
    });

    it('debe mostrar las descripciones de los espacios', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      expect(screen.getByText('Desarrollo de la nueva plataforma de e-commerce')).toBeInTheDocument();
      expect(screen.getByText(/Coordinación de campañas y estrategias/)).toBeInTheDocument();
      expect(screen.getByText('Gestión de talento y cultura organizacional')).toBeInTheDocument();
    });

    it('debe mostrar el número de miembros correctamente', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      expect(screen.getByText('8 miembros')).toBeInTheDocument();
      expect(screen.getByText('12 miembros')).toBeInTheDocument();
      expect(screen.getByText('5 miembros')).toBeInTheDocument();
    });

    it('debe manejar el singular para un miembro', () => {
      const singleMemberSpace: Space[] = [{
        id: 'space-single',
        name: 'Espacio Individual',
        description: 'Espacio con un solo miembro',
        memberCount: 1,
        isActive: true,
        lastActivity: new Date().toISOString()
      }];

      render(<SpacesList spaces={singleMemberSpace} />);
      expect(screen.getByText('1 miembro')).toBeInTheDocument();
    });
  });

  describe('Indicadores de actividad', () => {
    it('debe mostrar indicador verde para espacios muy activos (< 2 horas)', () => {
      const veryActiveSpace: Space[] = [{
        id: 'space-very-active',
        name: 'Espacio Muy Activo',
        description: 'Actividad reciente',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutos
      }];

      render(<SpacesList spaces={veryActiveSpace} />);
      const indicator = screen.getByTitle('Muy activo');
      expect(indicator).toHaveClass('bg-green-500');
    });

    it('debe mostrar indicador amarillo para espacios activos (< 24 horas)', () => {
      const activeSpace: Space[] = [{
        id: 'space-active',
        name: 'Espacio Activo',
        description: 'Actividad del día',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 horas
      }];

      render(<SpacesList spaces={activeSpace} />);
      const indicator = screen.getByTitle('Activo');
      expect(indicator).toHaveClass('bg-yellow-500');
    });

    it('debe mostrar indicador naranja para espacios poco activos (> 24 horas)', () => {
      const lessActiveSpace: Space[] = [{
        id: 'space-less-active',
        name: 'Espacio Poco Activo',
        description: 'Actividad antigua',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 días
      }];

      render(<SpacesList spaces={lessActiveSpace} />);
      const indicator = screen.getByTitle('Poco activo');
      expect(indicator).toHaveClass('bg-orange-500');
    });

    it('debe mostrar indicador gris para espacios inactivos', () => {
      const inactiveSpace: Space[] = [{
        id: 'space-inactive',
        name: 'Espacio Inactivo',
        description: 'Sin actividad',
        memberCount: 5,
        isActive: false,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      }];

      render(<SpacesList spaces={inactiveSpace} />);
      const indicator = screen.getByTitle('Inactivo');
      expect(indicator).toHaveClass('bg-gray-400');
    });
  });

  describe('Formato de tiempo de última actividad', () => {
    it('debe mostrar "Hace menos de 1 hora" para actividad muy reciente', () => {
      const recentSpace: Space[] = [{
        id: 'space-recent',
        name: 'Espacio Reciente',
        description: 'Actividad muy reciente',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutos
      }];

      render(<SpacesList spaces={recentSpace} />);
      expect(screen.getByText('Hace menos de 1 hora')).toBeInTheDocument();
    });

    it('debe mostrar horas para actividad del día', () => {
      const hourlySpace: Space[] = [{
        id: 'space-hourly',
        name: 'Espacio Horas',
        description: 'Actividad de horas',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 horas
      }];

      render(<SpacesList spaces={hourlySpace} />);
      expect(screen.getByText('Hace 3 horas')).toBeInTheDocument();
    });

    it('debe mostrar días para actividad antigua', () => {
      const dailySpace: Space[] = [{
        id: 'space-daily',
        name: 'Espacio Días',
        description: 'Actividad de días',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 días
      }];

      render(<SpacesList spaces={dailySpace} />);
      expect(screen.getByText('Hace 3 días')).toBeInTheDocument();
    });

    it('debe manejar el singular para 1 hora y 1 día', () => {
      const singleHourSpace: Space[] = [{
        id: 'space-single-hour',
        name: 'Espacio Una Hora',
        description: 'Una hora de actividad',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hora
      }];

      const singleDaySpace: Space[] = [{
        id: 'space-single-day',
        name: 'Espacio Un Día',
        description: 'Un día de actividad',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 día
      }];

      render(<SpacesList spaces={singleHourSpace} />);
      expect(screen.getByText('Hace 1 hora')).toBeInTheDocument();

      render(<SpacesList spaces={singleDaySpace} />);
      expect(screen.getByText('Hace 1 día')).toBeInTheDocument();
    });
  });

  describe('Navegación e interacción', () => {
    it('debe manejar clics en espacios', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      const spaceButton = screen.getByLabelText('Acceder al espacio Proyecto Alpha');
      fireEvent.click(spaceButton);
      
      expect(mockConsoleLog).toHaveBeenCalledWith('Navegando al espacio: Proyecto Alpha');
    });

    it('debe tener botones accesibles con aria-labels', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      expect(screen.getByLabelText('Acceder al espacio Proyecto Alpha')).toBeInTheDocument();
      expect(screen.getByLabelText('Acceder al espacio Equipo de Marketing')).toBeInTheDocument();
      expect(screen.getByLabelText('Acceder al espacio Recursos Humanos')).toBeInTheDocument();
    });

    it('debe tener navegación con role y aria-label', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      const navigation = screen.getByRole('navigation', { name: 'Espacios de colaboración' });
      expect(navigation).toBeInTheDocument();
    });
  });

  describe('Estados vacíos', () => {
    it('debe mostrar mensaje cuando no hay espacios', () => {
      render(<SpacesList spaces={[]} />);
      
      expect(screen.getByText('No hay espacios de colaboración disponibles')).toBeInTheDocument();
    });

    it('debe mostrar icono cuando no hay espacios', () => {
      const { container } = render(<SpacesList spaces={[]} />);
      
      // Verificar que el SVG está presente
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-8', 'h-8', 'text-gray-300');
    });
  });

  describe('Estilos y clases CSS', () => {
    it('debe aplicar className personalizada', () => {
      const { container } = render(<SpacesList spaces={mockSpaces} className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('debe tener estilos hover en los botones', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      const spaceButton = screen.getByLabelText('Acceder al espacio Proyecto Alpha');
      expect(spaceButton).toHaveClass('hover:bg-gray-100');
    });

    it('debe tener estilos de focus para accesibilidad', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      const spaceButton = screen.getByLabelText('Acceder al espacio Proyecto Alpha');
      expect(spaceButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    });
  });

  describe('Truncamiento de texto', () => {
    it('debe truncar nombres largos', () => {
      const longNameSpace: Space[] = [{
        id: 'space-long',
        name: 'Este es un nombre de espacio extremadamente largo que debería ser truncado',
        description: 'Descripción normal',
        memberCount: 5,
        isActive: true,
        lastActivity: new Date().toISOString()
      }];

      render(<SpacesList spaces={longNameSpace} />);
      
      const nameElement = screen.getByText('Este es un nombre de espacio extremadamente largo que debería ser truncado');
      expect(nameElement).toHaveClass('truncate');
    });

    it('debe limitar las líneas de descripción', () => {
      render(<SpacesList spaces={mockSpaces} />);
      
      const description = screen.getByText(/Coordinación de campañas y estrategias/);
      expect(description).toHaveClass('line-clamp-2');
    });
  });
});