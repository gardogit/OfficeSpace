import mockDataJson from '../data/mockData.json';
import type { 
  MockData, 
  UserProfile, 
  NewsArticle, 
  Event, 
  Employee, 
  QuickLink, 
  Space, 
  Application 
} from '../types';

// Type assertion to ensure mock data matches our interface
const mockData = mockDataJson as MockData;

/**
 * Utility functions for handling mock data
 */
export class MockDataService {
  
  /**
   * Get current user profile
   */
  static getCurrentUser(): UserProfile {
    return mockData.currentUser;
  }

  /**
   * Get all news articles
   */
  static getNews(): NewsArticle[] {
    return mockData.news;
  }

  /**
   * Get news articles by category
   */
  static getNewsByCategory(category: string): NewsArticle[] {
    return mockData.news.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get featured news (first 3 articles for carousel)
   */
  static getFeaturedNews(): NewsArticle[] {
    return mockData.news.slice(0, 3);
  }

  /**
   * Get all upcoming events
   */
  static getEvents(): Event[] {
    return mockData.events.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  /**
   * Get upcoming events (next 5 events)
   */
  static getUpcomingEvents(): Event[] {
    const now = new Date();
    return mockData.events
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5);
  }

  /**
   * Get all new hires
   */
  static getNewHires(): Employee[] {
    return mockData.newHires.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  }

  /**
   * Get recent new hires (last 30 days)
   */
  static getRecentNewHires(): Employee[] {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return mockData.newHires
      .filter(employee => new Date(employee.startDate) > thirtyDaysAgo)
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  /**
   * Get all quick links
   */
  static getQuickLinks(): QuickLink[] {
    return mockData.quickLinks;
  }

  /**
   * Get quick links grouped by category
   */
  static getQuickLinksByCategory(): Record<string, QuickLink[]> {
    return mockData.quickLinks.reduce((acc, link) => {
      if (!acc[link.category]) {
        acc[link.category] = [];
      }
      acc[link.category].push(link);
      return acc;
    }, {} as Record<string, QuickLink[]>);
  }

  /**
   * Get all collaboration spaces
   */
  static getSpaces(): Space[] {
    return mockData.spaces.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  }

  /**
   * Get active spaces only
   */
  static getActiveSpaces(): Space[] {
    return mockData.spaces
      .filter(space => space.isActive)
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }

  /**
   * Get all applications
   */
  static getApplications(): Application[] {
    return mockData.applications;
  }

  /**
   * Get applications grouped by category
   */
  static getApplicationsByCategory(): Record<string, Application[]> {
    return mockData.applications.reduce((acc, app) => {
      if (!acc[app.category]) {
        acc[app.category] = [];
      }
      acc[app.category].push(app);
      return acc;
    }, {} as Record<string, Application[]>);
  }

  /**
   * Get applications for LaunchPad (first 9 apps)
   */
  static getLaunchPadApplications(): Application[] {
    return mockData.applications.slice(0, 9);
  }

  /**
   * Search functionality across different data types
   */
  static search(query: string): {
    news: NewsArticle[];
    events: Event[];
    employees: Employee[];
    spaces: Space[];
    applications: Application[];
  } {
    const searchTerm = query.toLowerCase();
    
    return {
      news: mockData.news.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.category.toLowerCase().includes(searchTerm)
      ),
      events: mockData.events.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
      ),
      employees: mockData.newHires.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
      ),
      spaces: mockData.spaces.filter(space =>
        space.name.toLowerCase().includes(searchTerm) ||
        space.description.toLowerCase().includes(searchTerm)
      ),
      applications: mockData.applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm) ||
        app.description.toLowerCase().includes(searchTerm) ||
        app.category.toLowerCase().includes(searchTerm)
      )
    };
  }

  /**
   * Validate mock data structure
   */
  static validateData(): boolean {
    try {
      // Basic validation checks
      if (!mockData.currentUser || !mockData.currentUser.id) return false;
      if (!Array.isArray(mockData.news)) return false;
      if (!Array.isArray(mockData.events)) return false;
      if (!Array.isArray(mockData.newHires)) return false;
      if (!Array.isArray(mockData.quickLinks)) return false;
      if (!Array.isArray(mockData.spaces)) return false;
      if (!Array.isArray(mockData.applications)) return false;
      
      return true;
    } catch (error) {
      console.error('Mock data validation failed:', error);
      return false;
    }
  }

  /**
   * Get formatted date string for display
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get formatted datetime string for display
   */
  static formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get relative time string (e.g., "hace 2 días")
   */
  static getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  }
}

// Export individual getter functions for convenience
export const getCurrentUser = MockDataService.getCurrentUser;
export const getNews = MockDataService.getNews;
export const getFeaturedNews = MockDataService.getFeaturedNews;
export const getUpcomingEvents = MockDataService.getUpcomingEvents;
export const getRecentNewHires = MockDataService.getRecentNewHires;
export const getQuickLinksByCategory = MockDataService.getQuickLinksByCategory;
export const getActiveSpaces = MockDataService.getActiveSpaces;
export const getLaunchPadApplications = MockDataService.getLaunchPadApplications;
export const search = MockDataService.search;
export const formatDate = MockDataService.formatDate;
export const formatDateTime = MockDataService.formatDateTime;
export const getRelativeTime = MockDataService.getRelativeTime;