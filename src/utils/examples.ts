/**
 * Examples of how to use the MockDataService utilities
 * This file demonstrates the usage patterns for the mock data utilities
 */

import { 
  MockDataService,
  getCurrentUser,
  getFeaturedNews,
  getUpcomingEvents,
  getRecentNewHires,
  getQuickLinksByCategory,
  getActiveSpaces,
  getLaunchPadApplications
} from './mockDataUtils';

// Example 1: Get current user information
export function exampleGetCurrentUser() {
  const user = getCurrentUser();
  console.log('Current user:', user.name, '-', user.role);
  return user;
}

// Example 2: Get featured news for carousel
export function exampleGetFeaturedNews() {
  const featuredNews = getFeaturedNews();
  console.log('Featured news count:', featuredNews.length);
  featuredNews.forEach(article => {
    console.log(`- ${article.title} (${article.category})`);
  });
  return featuredNews;
}

// Example 3: Get upcoming events
export function exampleGetUpcomingEvents() {
  const events = getUpcomingEvents();
  console.log('Upcoming events:');
  events.forEach(event => {
    console.log(`- ${event.title} on ${MockDataService.formatDateTime(event.startDate)}`);
  });
  return events;
}

// Example 4: Get recent new hires
export function exampleGetRecentNewHires() {
  const newHires = getRecentNewHires();
  console.log('Recent new hires:');
  newHires.forEach(employee => {
    console.log(`- ${employee.name} (${employee.position}) - Started ${MockDataService.getRelativeTime(employee.startDate)}`);
  });
  return newHires;
}

// Example 5: Get quick links grouped by category
export function exampleGetQuickLinksByCategory() {
  const groupedLinks = getQuickLinksByCategory();
  console.log('Quick links by category:');
  Object.entries(groupedLinks).forEach(([category, links]) => {
    console.log(`${category}:`);
    links.forEach(link => {
      console.log(`  - ${link.title} (${link.url})`);
    });
  });
  return groupedLinks;
}

// Example 6: Get active collaboration spaces
export function exampleGetActiveSpaces() {
  const spaces = getActiveSpaces();
  console.log('Active collaboration spaces:');
  spaces.forEach(space => {
    console.log(`- ${space.name}: ${space.memberCount} members, last activity ${MockDataService.getRelativeTime(space.lastActivity)}`);
  });
  return spaces;
}

// Example 7: Get applications for LaunchPad
export function exampleGetLaunchPadApplications() {
  const apps = getLaunchPadApplications();
  console.log('LaunchPad applications:');
  apps.forEach(app => {
    console.log(`- ${app.name} (${app.category}): ${app.description}`);
  });
  return apps;
}

// Example 8: Search functionality
export function exampleSearch(query: string = 'React') {
  const results = MockDataService.search(query);
  console.log(`Search results for "${query}":`);
  console.log(`- News: ${results.news.length} articles`);
  console.log(`- Events: ${results.events.length} events`);
  console.log(`- Employees: ${results.employees.length} employees`);
  console.log(`- Spaces: ${results.spaces.length} spaces`);
  console.log(`- Applications: ${results.applications.length} applications`);
  return results;
}

// Example 9: Data validation
export function exampleValidateData() {
  const isValid = MockDataService.validateData();
  console.log('Mock data validation:', isValid ? '✓ Valid' : '✗ Invalid');
  return isValid;
}

// Example usage function that runs all examples
export function runAllExamples() {
  console.log('=== Mock Data Service Examples ===\n');
  
  exampleValidateData();
  console.log('\n---\n');
  
  exampleGetCurrentUser();
  console.log('\n---\n');
  
  exampleGetFeaturedNews();
  console.log('\n---\n');
  
  exampleGetUpcomingEvents();
  console.log('\n---\n');
  
  exampleGetRecentNewHires();
  console.log('\n---\n');
  
  exampleGetQuickLinksByCategory();
  console.log('\n---\n');
  
  exampleGetActiveSpaces();
  console.log('\n---\n');
  
  exampleGetLaunchPadApplications();
  console.log('\n---\n');
  
  exampleSearch('React');
  console.log('\n=== End Examples ===');
}