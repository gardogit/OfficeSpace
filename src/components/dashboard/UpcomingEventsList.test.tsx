import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UpcomingEventsList from './UpcomingEventsList';
import { Event } from '../../types';

// Mock date utilities to have predictable test results
vi.mock('../../utils/dateUtils', () => ({
  formatEventDate: vi.fn((date: string) => `Formatted: ${date}`),
  formatEventDuration: vi.fn((start: string, end: string) => `${start} - ${end}`),
  sortEventsByDate: vi.fn((events: Event[]) => [...events].sort((a, b) => a.title.localeCompare(b.title))),
  isEventUpcoming: vi.fn((date: string) => new Date(date) > new Date('2024-01-20T00:00:00Z'))
}));

const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Reunión de Equipo',
    description: 'Reunión semanal del equipo de desarrollo',
    startDate: '2024-01-25T10:00:00Z',
    endDate: '2024-01-25T11:00:00Z',
    location: 'Sala A',
    organizer: 'Ana García',
    attendees: 8
  },
  {
    id: 'event-2',
    title: 'Workshop de React',
    description: 'Taller práctico sobre React hooks avanzados',
    startDate: '2024-01-28T14:00:00Z',
    endDate: '2024-01-28T17:00:00Z',
    location: 'Lab de Desarrollo',
    organizer: 'Carlos Ruiz'
  },
  {
    id: 'event-3',
    title: 'Evento Pasado',
    description: 'Este evento ya pasó',
    startDate: '2024-01-15T10:00:00Z',
    endDate: '2024-01-15T11:00:00Z',
    location: 'Sala B',
    organizer: 'María López',
    attendees: 5
  }
];

describe('UpcomingEventsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with title', () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument();
  });

  it('displays upcoming events only', () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    // Should show upcoming events
    expect(screen.getByText('Reunión de Equipo')).toBeInTheDocument();
    expect(screen.getByText('Workshop de React')).toBeInTheDocument();
    
    // Should not show past events
    expect(screen.queryByText('Evento Pasado')).not.toBeInTheDocument();
  });

  it('shows empty state when no upcoming events', () => {
    const pastEvents = [mockEvents[2]]; // Only past event
    render(<UpcomingEventsList events={pastEvents} />);
    
    expect(screen.getByText('No hay eventos próximos programados')).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();
  });

  it('displays event basic information', () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    // Check event titles
    expect(screen.getByText('Reunión de Equipo')).toBeInTheDocument();
    expect(screen.getByText('Workshop de React')).toBeInTheDocument();
    
    // Check locations
    expect(screen.getByText('📍 Sala A')).toBeInTheDocument();
    expect(screen.getByText('📍 Lab de Desarrollo')).toBeInTheDocument();
  });

  it('expands event details when clicked', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    
    // Initially, details should not be visible
    expect(screen.queryByText('Reunión semanal del equipo de desarrollo')).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(eventButton);
    
    await waitFor(() => {
      expect(screen.getByText('Reunión semanal del equipo de desarrollo')).toBeInTheDocument();
      expect(screen.getByText('Ana García')).toBeInTheDocument();
      expect(screen.getByText('8 personas')).toBeInTheDocument();
    });
  });

  it('collapses event details when clicked again', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    
    // Expand first
    fireEvent.click(eventButton);
    await waitFor(() => {
      expect(screen.getByText('Reunión semanal del equipo de desarrollo')).toBeInTheDocument();
    });
    
    // Collapse
    fireEvent.click(eventButton);
    await waitFor(() => {
      expect(screen.queryByText('Reunión semanal del equipo de desarrollo')).not.toBeInTheDocument();
    });
  });

  it('handles keyboard navigation for expansion', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    
    // Test Enter key
    fireEvent.keyDown(eventButton, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('Reunión semanal del equipo de desarrollo')).toBeInTheDocument();
    });
    
    // Test Space key to collapse
    fireEvent.keyDown(eventButton, { key: ' ' });
    await waitFor(() => {
      expect(screen.queryByText('Reunión semanal del equipo de desarrollo')).not.toBeInTheDocument();
    });
  });

  it('shows only one expanded event at a time', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    const firstEventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    const secondEventButton = screen.getByRole('button', { name: /expandir detalles del evento: workshop de react/i });
    
    // Expand first event
    fireEvent.click(firstEventButton);
    await waitFor(() => {
      expect(screen.getByText('Reunión semanal del equipo de desarrollo')).toBeInTheDocument();
    });
    
    // Expand second event (should collapse first)
    fireEvent.click(secondEventButton);
    await waitFor(() => {
      expect(screen.queryByText('Reunión semanal del equipo de desarrollo')).not.toBeInTheDocument();
      expect(screen.getByText('Taller práctico sobre React hooks avanzados')).toBeInTheDocument();
    });
  });

  it('displays attendee count correctly', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    // Expand event with attendees
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    fireEvent.click(eventButton);
    
    await waitFor(() => {
      expect(screen.getByText('8 personas')).toBeInTheDocument();
    });
  });

  it('handles events without attendee count', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    // Expand event without attendees
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: workshop de react/i });
    fireEvent.click(eventButton);
    
    await waitFor(() => {
      expect(screen.getByText('Taller práctico sobre React hooks avanzados')).toBeInTheDocument();
      expect(screen.queryByText(/personas/)).not.toBeInTheDocument();
    });
  });

  it('shows event count in footer', () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    expect(screen.getByText('Mostrando 2 eventos próximos')).toBeInTheDocument();
  });

  it('shows singular form for single event', () => {
    const singleEvent = [mockEvents[0]];
    render(<UpcomingEventsList events={singleEvent} />);
    
    expect(screen.getByText('Mostrando 1 evento próximo')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<UpcomingEventsList events={mockEvents} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    
    expect(eventButton).toHaveAttribute('aria-expanded', 'false');
    expect(eventButton).toHaveAttribute('tabIndex', '0');
  });

  it('updates aria-expanded when event is expanded', async () => {
    render(<UpcomingEventsList events={mockEvents} />);
    
    const eventButton = screen.getByRole('button', { name: /expandir detalles del evento: reunión de equipo/i });
    
    fireEvent.click(eventButton);
    
    await waitFor(() => {
      expect(eventButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});