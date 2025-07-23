import { MockDataService } from '../mockDataUtils';

describe('MockDataService', () => {
  
  test('should validate mock data structure', () => {
    expect(MockDataService.validateData()).toBe(true);
  });

  test('should get current user', () => {
    const user = MockDataService.getCurrentUser();
    expect(user).toBeDefined();
    expect(user.id).toBe('user-001');
    expect(user.name).toBe('María González');
  });

  test('should get all news articles', () => {
    const news = MockDataService.getNews();
    expect(Array.isArray(news)).toBe(true);
    expect(news.length).toBeGreaterThan(0);
    expect(news[0]).toHaveProperty('id');
    expect(news[0]).toHaveProperty('title');
  });

  test('should get featured news (first 3 articles)', () => {
    const featuredNews = MockDataService.getFeaturedNews();
    expect(featuredNews).toHaveLength(3);
    expect(featuredNews[0].id).toBe('news-001');
  });

  test('should get upcoming events sorted by date', () => {
    const events = MockDataService.getUpcomingEvents();
    expect(Array.isArray(events)).toBe(true);
    
    // Check if events are sorted by start date
    for (let i = 1; i < events.length; i++) {
      const prevDate = new Date(events[i - 1].startDate);
      const currentDate = new Date(events[i].startDate);
      expect(prevDate.getTime()).toBeLessThanOrEqual(currentDate.getTime());
    }
  });

  test('should get new hires sorted by start date (newest first)', () => {
    const newHires = MockDataService.getNewHires();
    expect(Array.isArray(newHires)).toBe(true);
    expect(newHires.length).toBeGreaterThan(0);
    
    // Check if new hires are sorted by start date (newest first)
    for (let i = 1; i < newHires.length; i++) {
      const prevDate = new Date(newHires[i - 1].startDate);
      const currentDate = new Date(newHires[i].startDate);
      expect(prevDate.getTime()).toBeGreaterThanOrEqual(currentDate.getTime());
    }
  });

  test('should group quick links by category', () => {
    const groupedLinks = MockDataService.getQuickLinksByCategory();
    expect(typeof groupedLinks).toBe('object');
    
    // Check that categories exist
    expect(groupedLinks).toHaveProperty('Desarrollo');
    expect(Array.isArray(groupedLinks['Desarrollo'])).toBe(true);
  });

  test('should get only active spaces', () => {
    const activeSpaces = MockDataService.getActiveSpaces();
    expect(Array.isArray(activeSpaces)).toBe(true);
    
    // All returned spaces should be active
    activeSpaces.forEach(space => {
      expect(space.isActive).toBe(true);
    });
  });

  test('should get LaunchPad applications (first 9)', () => {
    const launchPadApps = MockDataService.getLaunchPadApplications();
    expect(launchPadApps).toHaveLength(9);
    expect(launchPadApps[0].id).toBe('app-001');
  });

  test('should search across different data types', () => {
    const searchResults = MockDataService.search('React');
    
    expect(searchResults).toHaveProperty('news');
    expect(searchResults).toHaveProperty('events');
    expect(searchResults).toHaveProperty('employees');
    expect(searchResults).toHaveProperty('spaces');
    expect(searchResults).toHaveProperty('applications');
    
    expect(Array.isArray(searchResults.news)).toBe(true);
    expect(Array.isArray(searchResults.events)).toBe(true);
  });

  test('should format dates correctly', () => {
    const dateString = '2024-01-15T09:00:00Z';
    const formattedDate = MockDataService.formatDate(dateString);
    const formattedDateTime = MockDataService.formatDateTime(dateString);
    
    expect(typeof formattedDate).toBe('string');
    expect(typeof formattedDateTime).toBe('string');
    expect(formattedDate).toContain('2024');
  });

  test('should get relative time', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const relativeTime = MockDataService.getRelativeTime(yesterday.toISOString());
    
    expect(relativeTime).toBe('Ayer');
  });

  test('should filter news by category', () => {
    const productNews = MockDataService.getNewsByCategory('Producto');
    expect(Array.isArray(productNews)).toBe(true);
    
    productNews.forEach(article => {
      expect(article.category).toBe('Producto');
    });
  });

  test('should group applications by category', () => {
    const groupedApps = MockDataService.getApplicationsByCategory();
    expect(typeof groupedApps).toBe('object');
    
    // Check that categories exist
    expect(groupedApps).toHaveProperty('Comunicación');
    expect(Array.isArray(groupedApps['Comunicación'])).toBe(true);
  });
});