import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  formatEventDate, 
  formatEventDuration, 
  sortEventsByDate, 
  isEventUpcoming 
} from '../dateUtils';
import { Event } from '../../types';

// Mock the current date for consistent testing
const mockCurrentDate = new Date('2024-01-23T12:00:00Z');

describe('dateUtils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatEventDate', () => {
    it('formats today events correctly', () => {
      const todayDate = '2024-01-23T15:30:00Z';
      const result = formatEventDate(todayDate);
      expect(result).toBe('Hoy, 15:30');
    });

    it('formats tomorrow events correctly', () => {
      const tomorrowDate = '2024-01-24T10:00:00Z';
      const result = formatEventDate(tomorrowDate);
      expect(result).toBe('Mañana, 10:00');
    });

    it('formats events within the week with weekday', () => {
      const thisWeekDate = '2024-01-26T14:00:00Z'; // Friday
      const result = formatEventDate(thisWeekDate);
      expect(result).toBe('viernes, 14:00');
    });

    it('formats events beyond a week with full date', () => {
      const futureDate = '2024-02-15T09:00:00Z';
      const result = formatEventDate(futureDate);
      expect(result).toContain('jueves, 15 de febrero de 2024, 09:00');
    });
  });

  describe('formatEventDuration', () => {
    it('formats same-day events correctly', () => {
      const startDate = '2024-01-25T10:00:00Z';
      const endDate = '2024-01-25T11:30:00Z';
      const result = formatEventDuration(startDate, endDate);
      expect(result).toBe('10:00 - 11:30');
    });

    it('formats multi-day events correctly', () => {
      const startDate = '2024-01-25T10:00:00Z';
      const endDate = '2024-01-26T15:00:00Z';
      const result = formatEventDuration(startDate, endDate);
      expect(result).toContain('25 ene 10:00 - 26 ene 15:00');
    });
  });

  describe('sortEventsByDate', () => {
    it('sorts events chronologically', () => {
      const events: Event[] = [
        {
          id: '1',
          title: 'Event 3',
          description: 'Third event',
          startDate: '2024-01-27T10:00:00Z',
          endDate: '2024-01-27T11:00:00Z',
          location: 'Room C',
          organizer: 'Organizer C'
        },
        {
          id: '2',
          title: 'Event 1',
          description: 'First event',
          startDate: '2024-01-25T10:00:00Z',
          endDate: '2024-01-25T11:00:00Z',
          location: 'Room A',
          organizer: 'Organizer A'
        },
        {
          id: '3',
          title: 'Event 2',
          description: 'Second event',
          startDate: '2024-01-26T10:00:00Z',
          endDate: '2024-01-26T11:00:00Z',
          location: 'Room B',
          organizer: 'Organizer B'
        }
      ];

      const sorted = sortEventsByDate(events);
      
      expect(sorted[0].title).toBe('Event 1');
      expect(sorted[1].title).toBe('Event 2');
      expect(sorted[2].title).toBe('Event 3');
    });

    it('does not mutate original array', () => {
      const events: Event[] = [
        {
          id: '1',
          title: 'Event B',
          description: 'Second event',
          startDate: '2024-01-27T10:00:00Z',
          endDate: '2024-01-27T11:00:00Z',
          location: 'Room B',
          organizer: 'Organizer B'
        },
        {
          id: '2',
          title: 'Event A',
          description: 'First event',
          startDate: '2024-01-25T10:00:00Z',
          endDate: '2024-01-25T11:00:00Z',
          location: 'Room A',
          organizer: 'Organizer A'
        }
      ];

      const originalOrder = events.map(e => e.title);
      sortEventsByDate(events);
      
      expect(events.map(e => e.title)).toEqual(originalOrder);
    });
  });

  describe('isEventUpcoming', () => {
    it('returns true for future events', () => {
      const futureDate = '2024-01-25T10:00:00Z';
      expect(isEventUpcoming(futureDate)).toBe(true);
    });

    it('returns false for past events', () => {
      const pastDate = '2024-01-20T10:00:00Z';
      expect(isEventUpcoming(pastDate)).toBe(false);
    });

    it('returns false for current time', () => {
      const currentDate = '2024-01-23T12:00:00Z';
      expect(isEventUpcoming(currentDate)).toBe(false);
    });

    it('handles edge case of events starting in the next minute', () => {
      const nextMinute = '2024-01-23T12:01:00Z';
      expect(isEventUpcoming(nextMinute)).toBe(true);
    });
  });
});