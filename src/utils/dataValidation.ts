// Simple validation utilities for mock data
import type { MockData } from '../types';

/**
 * Validate that a date string is in ISO format
 */
export const isValidISODate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes('T') && dateString.includes('Z');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate mock data structure and content
 */
export const validateMockDataStructure = (data: any): data is MockData => {
  // Check if data exists
  if (!data || typeof data !== 'object') {
    console.error('Mock data is not an object');
    return false;
  }

  // Validate currentUser
  if (!data.currentUser || typeof data.currentUser !== 'object') {
    console.error('currentUser is missing or invalid');
    return false;
  }

  const user = data.currentUser;
  if (!user.id || !user.name || !user.email || !user.department || !user.role) {
    console.error('currentUser is missing required fields');
    return false;
  }

  if (!isValidEmail(user.email)) {
    console.error('currentUser email is invalid');
    return false;
  }

  // Validate arrays exist and are arrays
  const requiredArrays = ['news', 'events', 'newHires', 'quickLinks', 'spaces', 'applications'];
  for (const arrayName of requiredArrays) {
    if (!Array.isArray(data[arrayName])) {
      console.error(`${arrayName} is not an array`);
      return false;
    }
  }

  // Validate news articles
  for (const article of data.news) {
    if (!article.id || !article.title || !article.author || !article.publishDate) {
      console.error('News article missing required fields');
      return false;
    }
    if (!isValidISODate(article.publishDate)) {
      console.error('News article has invalid date format');
      return false;
    }
  }

  // Validate events
  for (const event of data.events) {
    if (!event.id || !event.title || !event.startDate || !event.endDate) {
      console.error('Event missing required fields');
      return false;
    }
    if (!isValidISODate(event.startDate) || !isValidISODate(event.endDate)) {
      console.error('Event has invalid date format');
      return false;
    }
  }

  // Validate new hires
  for (const employee of data.newHires) {
    if (!employee.id || !employee.name || !employee.position || !employee.department || !employee.startDate) {
      console.error('Employee missing required fields');
      return false;
    }
    if (!isValidISODate(employee.startDate)) {
      console.error('Employee has invalid start date format');
      return false;
    }
  }

  // Validate quick links
  for (const link of data.quickLinks) {
    if (!link.id || !link.title || !link.url || !link.category) {
      console.error('Quick link missing required fields');
      return false;
    }
    if (!isValidUrl(link.url)) {
      console.error('Quick link has invalid URL');
      return false;
    }
  }

  // Validate spaces
  for (const space of data.spaces) {
    if (!space.id || !space.name || !space.description || typeof space.memberCount !== 'number' || typeof space.isActive !== 'boolean' || !space.lastActivity) {
      console.error('Space missing required fields');
      return false;
    }
    if (!isValidISODate(space.lastActivity)) {
      console.error('Space has invalid lastActivity date format');
      return false;
    }
  }

  // Validate applications
  for (const app of data.applications) {
    if (!app.id || !app.name || !app.url || !app.icon || !app.category) {
      console.error('Application missing required fields');
      return false;
    }
    if (!isValidUrl(app.url)) {
      console.error('Application has invalid URL');
      return false;
    }
  }

  console.log('Mock data validation passed successfully');
  return true;
};

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string, public value?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Safe data validator that throws ValidationError on failure
 */
export const validateMockDataSafe = (data: any): MockData => {
  if (!validateMockDataStructure(data)) {
    throw new ValidationError('Mock data structure validation failed');
  }
  return data as MockData;
};

/**
 * Sanitize and provide fallback for invalid data
 */
export const sanitizeMockData = (data: any): MockData => {
  const fallbackData: MockData = {
    currentUser: {
      id: 'fallback-user',
      name: 'Usuario Desconocido',
      email: 'usuario@empresa.com',
      department: 'General',
      role: 'Empleado',
    },
    news: [],
    events: [],
    newHires: [],
    quickLinks: [],
    spaces: [],
    applications: [],
  };

  try {
    return validateMockDataSafe(data);
  } catch (error) {
    console.warn('Using fallback data due to validation error:', error);
    return fallbackData;
  }
};

/**
 * Partial data sanitization - attempts to recover valid parts of data
 */
export const sanitizePartialMockData = (data: any): MockData => {
  const fallbackData = sanitizeMockData(null);
  
  if (!data || typeof data !== 'object') {
    return fallbackData;
  }

  const result: MockData = { ...fallbackData };

  // Try to recover currentUser
  try {
    if (data.currentUser && typeof data.currentUser === 'object') {
      const user = data.currentUser;
      if (user.id && user.name && user.email && user.department && user.role) {
        if (isValidEmail(user.email)) {
          result.currentUser = user;
        }
      }
    }
  } catch (error) {
    console.warn('Failed to recover currentUser:', error);
  }

  // Try to recover news array
  try {
    if (Array.isArray(data.news)) {
      result.news = data.news.filter((article: any) => {
        return article && 
               article.id && 
               article.title && 
               article.author && 
               article.publishDate &&
               isValidISODate(article.publishDate);
      });
    }
  } catch (error) {
    console.warn('Failed to recover news:', error);
  }

  // Try to recover events array
  try {
    if (Array.isArray(data.events)) {
      result.events = data.events.filter((event: any) => {
        return event && 
               event.id && 
               event.title && 
               event.startDate && 
               event.endDate &&
               isValidISODate(event.startDate) &&
               isValidISODate(event.endDate);
      });
    }
  } catch (error) {
    console.warn('Failed to recover events:', error);
  }

  // Try to recover newHires array
  try {
    if (Array.isArray(data.newHires)) {
      result.newHires = data.newHires.filter((employee: any) => {
        return employee && 
               employee.id && 
               employee.name && 
               employee.position && 
               employee.department && 
               employee.startDate &&
               isValidISODate(employee.startDate);
      });
    }
  } catch (error) {
    console.warn('Failed to recover newHires:', error);
  }

  // Try to recover quickLinks array
  try {
    if (Array.isArray(data.quickLinks)) {
      result.quickLinks = data.quickLinks.filter((link: any) => {
        return link && 
               link.id && 
               link.title && 
               link.url && 
               link.category &&
               isValidUrl(link.url);
      });
    }
  } catch (error) {
    console.warn('Failed to recover quickLinks:', error);
  }

  // Try to recover spaces array
  try {
    if (Array.isArray(data.spaces)) {
      result.spaces = data.spaces.filter((space: any) => {
        return space && 
               space.id && 
               space.name && 
               space.description && 
               typeof space.memberCount === 'number' && 
               typeof space.isActive === 'boolean' && 
               space.lastActivity &&
               isValidISODate(space.lastActivity);
      });
    }
  } catch (error) {
    console.warn('Failed to recover spaces:', error);
  }

  // Try to recover applications array
  try {
    if (Array.isArray(data.applications)) {
      result.applications = data.applications.filter((app: any) => {
        return app && 
               app.id && 
               app.name && 
               app.url && 
               app.icon && 
               app.category &&
               isValidUrl(app.url);
      });
    }
  } catch (error) {
    console.warn('Failed to recover applications:', error);
  }

  console.log('Partial data recovery completed:', {
    news: result.news.length,
    events: result.events.length,
    newHires: result.newHires.length,
    quickLinks: result.quickLinks.length,
    spaces: result.spaces.length,
    applications: result.applications.length
  });

  return result;
};

/**
 * Data health check - returns status of data integrity
 */
export const getDataHealthStatus = (data: MockData): {
  status: 'healthy' | 'degraded' | 'critical';
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check user data
  if (!data.currentUser || !data.currentUser.name) {
    issues.push('Usuario actual no disponible');
    recommendations.push('Verificar datos de autenticación');
  }

  // Check content availability
  if (data.news.length === 0) {
    issues.push('No hay noticias disponibles');
    recommendations.push('Verificar fuente de noticias');
  }

  if (data.events.length === 0) {
    issues.push('No hay eventos disponibles');
    recommendations.push('Verificar calendario de eventos');
  }

  if (data.newHires.length === 0) {
    issues.push('No hay información de nuevos empleados');
    recommendations.push('Verificar datos de RRHH');
  }

  if (data.quickLinks.length === 0) {
    issues.push('No hay enlaces rápidos configurados');
    recommendations.push('Configurar enlaces útiles');
  }

  // Determine overall status
  let status: 'healthy' | 'degraded' | 'critical';
  if (issues.length === 0) {
    status = 'healthy';
  } else if (issues.length <= 2) {
    status = 'degraded';
  } else {
    status = 'critical';
  }

  return { status, issues, recommendations };
};

/**
 * Get validation summary
 */
export const getValidationSummary = (data: any): string => {
  if (!validateMockDataStructure(data)) {
    return 'Validation failed - check console for details';
  }

  const summary = {
    currentUser: data.currentUser.name,
    newsCount: data.news.length,
    eventsCount: data.events.length,
    newHiresCount: data.newHires.length,
    quickLinksCount: data.quickLinks.length,
    spacesCount: data.spaces.length,
    applicationsCount: data.applications.length
  };

  return `Validation successful:
- Current user: ${summary.currentUser}
- News articles: ${summary.newsCount}
- Events: ${summary.eventsCount}
- New hires: ${summary.newHiresCount}
- Quick links: ${summary.quickLinksCount}
- Spaces: ${summary.spacesCount}
- Applications: ${summary.applicationsCount}`;
};