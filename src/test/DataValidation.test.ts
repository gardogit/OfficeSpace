import { 
  validateMockDataStructure, 
  validateMockDataSafe, 
  sanitizeMockData, 
  sanitizePartialMockData,
  getDataHealthStatus,
  getValidationSummary,
  ValidationError,
  isValidISODate,
  isValidEmail,
  isValidUrl
} from '../utils/dataValidation';
import type { MockData } from '../types';

describe('Data Validation Utilities', () => {
  const validMockData: MockData = {
    currentUser: {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      department: 'IT',
      role: 'Developer',
      avatar: 'avatar.jpg'
    },
    news: [{
      id: 'news1',
      title: 'Test News',
      summary: 'Test summary',
      content: 'Test content',
      author: 'Test Author',
      publishDate: '2024-01-15T10:30:00Z',
      category: 'General',
      imageUrl: 'news.jpg'
    }],
    events: [{
      id: 'event1',
      title: 'Test Event',
      description: 'Test description',
      startDate: '2024-02-15T10:30:00Z',
      endDate: '2024-02-15T12:30:00Z',
      location: 'Conference Room',
      organizer: 'Event Organizer',
      attendees: 25
    }],
    newHires: [{
      id: 'emp1',
      name: 'New Employee',
      position: 'Developer',
      department: 'Engineering',
      startDate: '2024-01-01T00:00:00Z',
      avatar: 'employee.jpg',
      bio: 'New team member'
    }],
    quickLinks: [{
      id: 'link1',
      title: 'Company Portal',
      url: 'https://portal.company.com',
      category: 'Tools',
      icon: 'portal.png'
    }],
    spaces: [{
      id: 'space1',
      name: 'Development Team',
      description: 'Space for development discussions',
      memberCount: 15,
      isActive: true,
      lastActivity: '2024-01-15T10:30:00Z'
    }],
    applications: [{
      id: 'app1',
      name: 'Slack',
      description: 'Team communication',
      url: 'https://company.slack.com',
      icon: 'slack.png',
      category: 'Communication'
    }]
  };

  describe('Basic Validation Functions', () => {
    describe('isValidISODate', () => {
      it('validates correct ISO date strings', () => {
        expect(isValidISODate('2024-01-15T10:30:00Z')).toBe(true);
        expect(isValidISODate('2024-12-31T23:59:59Z')).toBe(true);
        expect(isValidISODate('2024-01-01T00:00:00.000Z')).toBe(true);
      });

      it('rejects invalid date strings', () => {
        expect(isValidISODate('2024-01-15')).toBe(false);
        expect(isValidISODate('invalid-date')).toBe(false);
        expect(isValidISODate('2024-13-01T10:30:00Z')).toBe(false);
        expect(isValidISODate('')).toBe(false);
      });
    });

    describe('isValidEmail', () => {
      it('validates correct email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@company.co.uk')).toBe(true);
        expect(isValidEmail('test+tag@domain.org')).toBe(true);
      });

      it('rejects invalid email addresses', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('')).toBe(false);
      });
    });

    describe('isValidUrl', () => {
      it('validates correct URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://localhost:3000')).toBe(true);
        expect(isValidUrl('https://sub.domain.com/path?query=value')).toBe(true);
      });

      it('rejects invalid URLs', () => {
        expect(isValidUrl('invalid-url')).toBe(false);
        expect(isValidUrl('ftp://example.com')).toBe(false); // Only http/https supported by URL constructor
        expect(isValidUrl('')).toBe(false);
      });
    });
  });

  describe('Mock Data Structure Validation', () => {
    it('validates correct mock data structure', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      expect(validateMockDataStructure(validMockData)).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Mock data validation passed successfully');
      
      consoleSpy.mockRestore();
    });

    it('rejects null or undefined data', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(validateMockDataStructure(null)).toBe(false);
      expect(validateMockDataStructure(undefined)).toBe(false);
      expect(validateMockDataStructure('not an object')).toBe(false);
      
      consoleErrorSpy.mockRestore();
    });

    it('rejects data with missing currentUser', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = { ...validMockData };
      delete (invalidData as any).currentUser;
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('currentUser is missing or invalid');
      
      consoleErrorSpy.mockRestore();
    });

    it('rejects data with invalid currentUser fields', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = {
        ...validMockData,
        currentUser: {
          id: 'user1',
          name: 'Test User',
          email: 'invalid-email', // Invalid email
          department: 'IT',
          role: 'Developer'
        }
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('currentUser email is invalid');
      
      consoleErrorSpy.mockRestore();
    });

    it('rejects data with non-array fields', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = {
        ...validMockData,
        news: 'not an array'
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('news is not an array');
      
      consoleErrorSpy.mockRestore();
    });

    it('validates news articles structure', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = {
        ...validMockData,
        news: [{
          id: 'news1',
          title: 'Test News',
          // Missing required fields
        }]
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('News article missing required fields');
      
      consoleErrorSpy.mockRestore();
    });

    it('validates events structure', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = {
        ...validMockData,
        events: [{
          id: 'event1',
          title: 'Test Event',
          startDate: 'invalid-date', // Invalid date
          endDate: '2024-02-15T12:30:00Z',
        }]
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Event has invalid date format');
      
      consoleErrorSpy.mockRestore();
    });

    it('validates quick links URLs', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidData = {
        ...validMockData,
        quickLinks: [{
          id: 'link1',
          title: 'Company Portal',
          url: 'invalid-url', // Invalid URL
          category: 'Tools'
        }]
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Quick link has invalid URL');
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Safe Validation', () => {
    it('returns data when validation passes', () => {
      expect(validateMockDataSafe(validMockData)).toEqual(validMockData);
    });

    it('throws ValidationError when validation fails', () => {
      const invalidData = { invalid: 'data' };
      
      expect(() => validateMockDataSafe(invalidData)).toThrow(ValidationError);
      expect(() => validateMockDataSafe(invalidData)).toThrow('Mock data structure validation failed');
    });
  });

  describe('Data Sanitization', () => {
    it('returns valid data unchanged', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = sanitizeMockData(validMockData);
      expect(result).toEqual(validMockData);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('returns fallback data for invalid input', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = sanitizeMockData({ invalid: 'data' });
      
      expect(result.currentUser.name).toBe('Usuario Desconocido');
      expect(result.news).toEqual([]);
      expect(result.events).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Using fallback data due to validation error:',
        expect.any(Error)
      );
      
      consoleWarnSpy.mockRestore();
    });

    it('returns fallback data for null input', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = sanitizeMockData(null);
      
      expect(result.currentUser.name).toBe('Usuario Desconocido');
      expect(result.news).toEqual([]);
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Partial Data Sanitization', () => {
    it('recovers valid parts of partially corrupted data', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      const partiallyCorruptedData = {
        currentUser: validMockData.currentUser, // Valid
        news: validMockData.news, // Valid
        events: 'corrupted', // Invalid
        newHires: [], // Valid but empty
        quickLinks: [{ invalid: 'link' }], // Invalid items
        spaces: validMockData.spaces, // Valid
        applications: validMockData.applications // Valid
      };
      
      const result = sanitizePartialMockData(partiallyCorruptedData);
      
      expect(result.currentUser).toEqual(validMockData.currentUser);
      expect(result.news).toEqual(validMockData.news);
      expect(result.events).toEqual([]); // Corrupted data filtered out
      expect(result.newHires).toEqual([]);
      expect(result.quickLinks).toEqual([]); // Invalid items filtered out
      expect(result.spaces).toEqual(validMockData.spaces);
      expect(result.applications).toEqual(validMockData.applications);
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to recover events:', expect.any(Error));
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to recover quickLinks:', expect.any(Error));
      expect(consoleLogSpy).toHaveBeenCalledWith('Partial data recovery completed:', expect.any(Object));
      
      consoleWarnSpy.mockRestore();
      consoleLogSpy.mockRestore();
    });

    it('uses fallback for completely invalid data', () => {
      const result = sanitizePartialMockData(null);
      
      expect(result.currentUser.name).toBe('Usuario Desconocido');
      expect(result.news).toEqual([]);
      expect(result.events).toEqual([]);
    });

    it('filters out invalid items from arrays', () => {
      const mixedValidityData = {
        currentUser: validMockData.currentUser,
        news: [
          validMockData.news[0], // Valid
          { id: 'news2', title: 'Invalid News' }, // Missing required fields
          {
            id: 'news3',
            title: 'Valid News 2',
            summary: 'Summary',
            content: 'Content',
            author: 'Author',
            publishDate: '2024-01-16T10:30:00Z',
            category: 'Tech'
          } // Valid
        ],
        events: [],
        newHires: [],
        quickLinks: [],
        spaces: [],
        applications: []
      };
      
      const result = sanitizePartialMockData(mixedValidityData);
      
      expect(result.news).toHaveLength(2); // Only valid items kept
      expect(result.news[0]).toEqual(validMockData.news[0]);
      expect(result.news[1].title).toBe('Valid News 2');
    });
  });

  describe('Data Health Status', () => {
    it('reports healthy status for complete data', () => {
      const health = getDataHealthStatus(validMockData);
      
      expect(health.status).toBe('healthy');
      expect(health.issues).toEqual([]);
      expect(health.recommendations).toEqual([]);
    });

    it('reports degraded status for missing some data', () => {
      const incompleteData = {
        ...validMockData,
        news: [], // No news
        events: [] // No events
      };
      
      const health = getDataHealthStatus(incompleteData);
      
      expect(health.status).toBe('degraded');
      expect(health.issues).toContain('No hay noticias disponibles');
      expect(health.issues).toContain('No hay eventos disponibles');
      expect(health.recommendations).toContain('Verificar fuente de noticias');
      expect(health.recommendations).toContain('Verificar calendario de eventos');
    });

    it('reports critical status for missing most data', () => {
      const criticalData = {
        ...validMockData,
        news: [],
        events: [],
        newHires: [],
        quickLinks: []
      };
      
      const health = getDataHealthStatus(criticalData);
      
      expect(health.status).toBe('critical');
      expect(health.issues.length).toBeGreaterThan(2);
    });

    it('reports issues with missing user data', () => {
      const dataWithoutUser = {
        ...validMockData,
        currentUser: { ...validMockData.currentUser, name: '' }
      };
      
      const health = getDataHealthStatus(dataWithoutUser);
      
      expect(health.issues).toContain('Usuario actual no disponible');
      expect(health.recommendations).toContain('Verificar datos de autenticación');
    });
  });

  describe('Validation Summary', () => {
    it('provides summary for valid data', () => {
      const summary = getValidationSummary(validMockData);
      
      expect(summary).toContain('Validation successful:');
      expect(summary).toContain('Current user: Test User');
      expect(summary).toContain('News articles: 1');
      expect(summary).toContain('Events: 1');
      expect(summary).toContain('New hires: 1');
    });

    it('provides failure message for invalid data', () => {
      const summary = getValidationSummary({ invalid: 'data' });
      
      expect(summary).toBe('Validation failed - check console for details');
    });
  });

  describe('ValidationError Class', () => {
    it('creates error with message and optional field/value', () => {
      const error = new ValidationError('Test validation error', 'testField', 'testValue');
      
      expect(error.message).toBe('Test validation error');
      expect(error.name).toBe('ValidationError');
      expect(error.field).toBe('testField');
      expect(error.value).toBe('testValue');
      expect(error instanceof Error).toBe(true);
    });

    it('creates error with just message', () => {
      const error = new ValidationError('Simple validation error');
      
      expect(error.message).toBe('Simple validation error');
      expect(error.name).toBe('ValidationError');
      expect(error.field).toBeUndefined();
      expect(error.value).toBeUndefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles circular references gracefully', () => {
      const circularData: any = { ...validMockData };
      circularData.circular = circularData; // Create circular reference
      
      // Should not throw and should handle gracefully
      expect(() => sanitizePartialMockData(circularData)).not.toThrow();
    });

    it('handles very large datasets', () => {
      const largeData = {
        ...validMockData,
        news: Array(1000).fill(validMockData.news[0]).map((item, index) => ({
          ...item,
          id: `news${index}`
        }))
      };
      
      const result = sanitizePartialMockData(largeData);
      expect(result.news).toHaveLength(1000);
    });

    it('handles empty strings and null values in required fields', () => {
      const dataWithEmptyFields = {
        currentUser: {
          id: '',
          name: null,
          email: 'test@example.com',
          department: 'IT',
          role: 'Developer'
        },
        news: [],
        events: [],
        newHires: [],
        quickLinks: [],
        spaces: [],
        applications: []
      };
      
      const result = sanitizePartialMockData(dataWithEmptyFields);
      
      // Should fall back to default user
      expect(result.currentUser.name).toBe('Usuario Desconocido');
    });
  });
});