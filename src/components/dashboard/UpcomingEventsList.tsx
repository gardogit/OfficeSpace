import React, { useState, useMemo } from 'react';
import { Event } from '../../types';
import { Card } from '../ui/Card';
import { formatEventDate, formatEventDuration, sortEventsByDate, isEventUpcoming } from '../../utils/dateUtils';

export interface UpcomingEventsListProps {
  events: Event[];
  className?: string;
  showTitle?: boolean;
}

interface EventItemProps {
  event: Event;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, isExpanded, onToggleExpand }) => {
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0 mb-4 last:mb-0">
      <div 
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-md transition-colors duration-200"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Contraer' : 'Expandir'} detalles del evento: ${event.title}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
              {event.title}
            </h4>
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
              {formatEventDate(event.startDate)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📍 {event.location}
            </p>
          </div>
          <div className="flex-shrink-0 ml-3">
            <span 
              className={`inline-block transform transition-transform duration-200 text-gray-400 dark:text-gray-500 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div 
          className="mt-3 pl-3 border-l-2 border-primary-200 dark:border-primary-700 bg-gray-50 dark:bg-gray-700 p-3 rounded-md"
          role="region"
          aria-label="Detalles del evento"
        >
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Descripción:</span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Duración:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {formatEventDuration(event.startDate, event.endDate)}
                </p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Organizador:</span>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{event.organizer}</p>
              </div>
              
              {event.attendees && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Asistentes:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {event.attendees} {event.attendees === 1 ? 'persona' : 'personas'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({ 
  events, 
  className = '',
  showTitle = true
}) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Filter and sort upcoming events chronologically
  const upcomingEvents = useMemo(() => {
    const upcoming = events.filter(event => isEventUpcoming(event.startDate));
    return sortEventsByDate(upcoming);
  }, [events]);

  const handleToggleExpand = (eventId: string) => {
    setExpandedEventId(prev => prev === eventId ? null : eventId);
  };

  if (upcomingEvents.length === 0) {
    return (
      <Card title={showTitle ? "Próximos Eventos" : undefined} className={className}>
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📅</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No hay eventos próximos programados
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={showTitle ? "Próximos Eventos" : undefined} className={className}>
      <div className="space-y-0">
        {upcomingEvents.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            isExpanded={expandedEventId === event.id}
            onToggleExpand={() => handleToggleExpand(event.id)}
          />
        ))}
      </div>
      
      {upcomingEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Mostrando {upcomingEvents.length} {upcomingEvents.length === 1 ? 'evento próximo' : 'eventos próximos'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default UpcomingEventsList;