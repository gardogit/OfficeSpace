import React from 'react';
import UpcomingEventsList from './UpcomingEventsList';
import { Event } from '../../types';

// Demo data for showcasing the component
const demoEvents: Event[] = [
  {
    id: 'demo-event-1',
    title: 'Reunión de Planificación Sprint',
    description: 'Planificación del próximo sprint de desarrollo. Revisaremos las historias de usuario, estimaremos el esfuerzo y definiremos los objetivos del sprint.',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    location: 'Sala de Conferencias Principal',
    organizer: 'Ana Martínez - Scrum Master',
    attendees: 12
  },
  {
    id: 'demo-event-2',
    title: 'Workshop: Introducción a TypeScript',
    description: 'Taller práctico sobre los fundamentos de TypeScript, tipos avanzados y mejores prácticas para desarrollo frontend.',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
    location: 'Laboratorio de Desarrollo',
    organizer: 'Carlos Ruiz - Senior Developer'
  },
  {
    id: 'demo-event-3',
    title: 'Presentación de Resultados Q1',
    description: 'Presentación de los resultados del primer trimestre, métricas de rendimiento y objetivos para Q2.',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 hours later
    location: 'Auditorio Principal',
    organizer: 'Dirección General',
    attendees: 45
  },
  {
    id: 'demo-event-4',
    title: 'Almuerzo de Equipo',
    description: 'Almuerzo informal para fortalecer las relaciones del equipo y celebrar los logros recientes.',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // 1.5 hours later
    location: 'Restaurante La Terraza',
    organizer: 'Comité Social',
    attendees: 18
  },
  {
    id: 'demo-event-5',
    title: 'Hackathon Interno 2024',
    description: 'Competencia de innovación de 24 horas donde los equipos desarrollarán soluciones creativas a desafíos empresariales.',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
    location: 'Espacio de Innovación - Planta 3',
    organizer: 'Equipo de Innovación',
    attendees: 24
  }
];

const UpcomingEventsListDemo: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Demo: Lista de Próximos Eventos
          </h1>
          <p className="text-gray-600">
            Componente que muestra eventos próximos con ordenamiento cronológico y expansión de detalles.
          </p>
        </div>

        <div className="space-y-6">
          {/* Component with events */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Con Eventos Próximos
            </h2>
            <UpcomingEventsList events={demoEvents} />
          </div>

          {/* Component with no upcoming events */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Sin Eventos Próximos
            </h2>
            <UpcomingEventsList events={[]} />
          </div>

          {/* Component with custom styling */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Con Estilo Personalizado
            </h2>
            <UpcomingEventsList 
              events={demoEvents.slice(0, 2)} 
              className="border-2 border-primary-200" 
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Características del Componente:
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Filtrado automático de eventos próximos</li>
            <li>• Ordenamiento cronológico de eventos</li>
            <li>• Expansión/contracción de detalles con clic</li>
            <li>• Formato de fecha y hora consistente</li>
            <li>• Navegación por teclado accesible</li>
            <li>• Estado vacío cuando no hay eventos</li>
            <li>• Contador de eventos en el pie</li>
            <li>• Diseño responsive y profesional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsListDemo;