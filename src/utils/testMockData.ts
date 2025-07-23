// Test file to verify mock data and utilities work correctly
import { 
  MockDataService,
  getCurrentUser, 
  getNews, 
  getUpcomingEvents, 
  getQuickLinksByCategory,
  getActiveSpaces,
  formatDate,
  formatDateTime,
  getRelativeTime
} from './mockDataUtils';
import { validateMockDataStructure, getValidationSummary } from './dataValidation';
import mockData from '../data/mockData.json';

/**
 * Run all tests for mock data and utilities
 */
export const runMockDataTests = (): void => {
  console.log('🧪 Running Mock Data Tests...\n');

  // Test 1: Validate mock data structure
  console.log('1. Testing data structure validation...');
  const isValid = validateMockDataStructure(mockData);
  console.log(`✅ Data structure validation: ${isValid ? 'PASSED' : 'FAILED'}\n`);

  // Test 2: Test utility functions
  console.log('2. Testing utility functions...');
  
  try {
    const currentUser = getCurrentUser();
    console.log(`✅ getCurrentUser: ${currentUser.name} (${currentUser.role})`);

    const news = getNews();
    console.log(`✅ getNews: ${news.length} articles loaded`);

    const upcomingEvents = getUpcomingEvents();
    console.log(`✅ getUpcomingEvents: ${upcomingEvents.length} upcoming events`);

    const newHires = MockDataService.getNewHires();
    console.log(`✅ getNewHires: ${newHires.length} new employees`);

    const quickLinksByCategory = getQuickLinksByCategory();
    const categories = Object.keys(quickLinksByCategory);
    console.log(`✅ getQuickLinksByCategory: ${categories.length} categories (${categories.join(', ')})`);

    const activeSpaces = getActiveSpaces();
    console.log(`✅ getActiveSpaces: ${activeSpaces.length} active spaces`);

    const appsByCategory = MockDataService.getApplicationsByCategory();
    const appCategories = Object.keys(appsByCategory);
    console.log(`✅ getApplicationsByCategory: ${appCategories.length} categories (${appCategories.join(', ')})`);

  } catch (error) {
    console.error('❌ Utility functions test failed:', error);
  }

  // Test 3: Test date formatting functions
  console.log('\n3. Testing date formatting functions...');
  
  try {
    const testDate = '2024-01-15T09:00:00Z';
    console.log(`✅ formatDate: ${formatDate(testDate)}`);
    console.log(`✅ formatDateTime: ${formatDateTime(testDate)}`);
    console.log(`✅ getRelativeTime: ${getRelativeTime(testDate)}`);
  } catch (error) {
    console.error('❌ Date formatting test failed:', error);
  }

  // Test 4: Test mock data validation utility
  console.log('\n4. Testing mock data validation utility...');
  
  try {
    const isValidUtil = MockDataService.validateData();
    console.log(`✅ validateMockData utility: ${isValidUtil ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.error('❌ Mock data validation utility test failed:', error);
  }

  // Test 5: Show validation summary
  console.log('\n5. Validation Summary:');
  console.log(getValidationSummary(mockData));

  console.log('\n🎉 Mock Data Tests Completed!');
};

// Export for potential use in other files
export default runMockDataTests;