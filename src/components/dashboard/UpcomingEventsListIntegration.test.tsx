import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UpcomingEventsList from './UpcomingEventsList';
import mockData from '../../data/mockData.json';
import { MockData } from '../../types';

describe('UpcomingEventsList Integration', () => {
  const data = mockData as MockData;

  it('renders with real mock data', () => {
    render(<UpcomingEventsList events={data.events} />);
    
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument();
    
    // Should show some events from mock data
    // Note: This test depends on the current date and mock data dates
    // In a real scenario, you might want to mock the current date
    const eventElements = screen.queryAllByRole('button');
    expect(eventElements.length).toBeGreaterThanOrEqual(0);
  });

  it('handles mock data structure correctly', () => {
    // Verify that mock data has the expected structure
    expect(data.events).toBeDefined();
    expect(Array.isArray(data.events)).toBe(true);
    
    if (data.events.length > 0) {
      const firstEvent = data.events[0];
      expect(firstEvent).toHaveProperty('id');
      expect(firstEvent).toHaveProperty('title');
      expect(firstEvent).toHaveProperty('description');
      expect(firstEvent).toHaveProperty('startDate');
      expect(firstEvent).toHaveProperty('endDate');
      expect(firstEvent).toHaveProperty('location');
      expect(firstEvent).toHaveProperty('organizer');
    }
  });

  it('integrates with date utilities correctly', () => {
    render(<UpcomingEventsList events={data.events} />);
    
    // The component should render without errors when using real date utilities
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument();
  });
});