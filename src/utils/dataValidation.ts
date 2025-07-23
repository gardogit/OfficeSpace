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