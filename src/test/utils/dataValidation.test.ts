import {
  isValidISODate,
  isValidEmail,
  isValidUrl,
  validateMockDataStructure,
  ValidationError,
  validateMockDataSafe,
  sanitizeMockData,
  sanitizePartialMockData,
  getDataHealthStatus,
  getValidationSummary
} from '../../utils/dataValidation';

// Mock console methods
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
});

describe('Validation utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('user123@test-domain.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
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
      expect(isValidUrl('just-text')).toBe(false);
    });
  });
});

describe('Mock data validation', () => {
  const validMockData = {
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
      organizer: 'Test Organizer',
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

  describe('validateMockDataStructure', () => {
    it('validates correct mock data structure', () => {
      const result = validateMockDataStructure(validMockData);
      
      expect(result).toBe(true);
      expect(console.log).toHaveBeenCalledWith('Mock data validation passed successfully');
    });

    it('rejects null or undefined data', () => {
      expect(validateMockDataStructure(null)).toBe(false);
      expect(validateMockDataStructure(undefined)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Mock data is not an object');
    });

    it('rejects data without currentUser', () => {
      const invalidData = { ...validMockData };
      delete invalidData.currentUser;
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('currentUser is missing or invalid');
    });

    it('rejects currentUser with invalid email', () => {
      const invalidData = {
        ...validMockData,
        currentUser: {
          ...validMockData.currentUser,
          email: 'invalid-email'
        }
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('currentUser email is invalid');
    });

    it('rejects data with non-array fields', () => {
      const invalidData = {
        ...validMockData,
        news: 'not-an-array'
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('news is not an array');
    });

    it('rejects news articles with invalid dates', () => {
      const invalidData = {
        ...validMockData,
        news: [{
          ...validMockData.news[0],
          publishDate: 'invalid-date'
        }]
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('News article has invalid date format');
    });

    it('rejects events with invalid dates', () => {
      const invalidData = {
        ...validMockData,
        events: [{
          ...validMockData.events[0],
          startDate: 'invalid-date'
        }]
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Event has invalid date format');
    });

    it('rejects quick links with invalid URLs', () => {
      const invalidData = {
        ...validMockData,
        quickLinks: [{
          ...validMockData.quickLinks[0],
          url: 'invalid-url'
        }]
      };
      
      expect(validateMockDataStructure(invalidData)).toBe(false);
      expect(console.error).toHaveBeenCalledWith('Quick link has invalid URL');
    });
  });

  describe('validateMockDataSafe', () => {
    it('returns data when validation passes', () => {
      const result = validateMockDataSafe(validMockData);
      expect(result).toEqual(validMockData);
    });

    it('throws ValidationError when validation fails', () => {
      const invalidData = { invalid: 'data' };
      
      expect(() => validateMockDataSafe(invalidData)).toThrow(ValidationError);
      expect(() => validateMockDataSafe(invalidData)).toThrow('Mock data structure validation failed');
    });
  });

  describe('sanitizeMockData', () => {
    it('returns valid data unchanged', () => {
      const result = sanitizeMockData(validMockData);
      expect(result).toEqual(validMockData);
    });

    it('returns fallback data for invalid input', () => {
      const invalidData = { invalid: 'data' };
      const result = sanitizeMockData(invalidData);
      
      expect(result.currentUser.name).toBe('Usuario Desconocido');
      expect(result.news).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        'Using fallback data due to validation error:',
        expect.any(ValidationError)
      );
    });
  });

  describe('sanitizePartialMockData', () => {
    it('returns valid data unchanged', () => {
      const result = sanitizePartialMockData(validMockData);
      expect(result).toEqual(validMockData);
    });

    it('recovers valid parts from partially invalid data', () => {
      const partiallyInvalidData = {
        currentUser: validMockData.currentUser,
        news: [
          validMockData.news[0], // Valid
          { id: 'invalid', title: 'Invalid News' } // Invalid (missing required fields)
        ],
        events: 'not-an-array', // Invalid
        newHires: validMockData.newHires,
        quickLinks: [],
        spaces: [],
        applications: []
      };
      
      const result = sanitizePartialMockData(partiallyInvalidData);
      
      expect(result.currentUser).toEqual(validMockData.currentUser);
      expect(result.news).toHaveLength(1); // Only valid news item
      expect(result.events).toEqual([]); // Invalid array replaced with empty
      expect(result.newHires).toEqual(validMockData.newHires);
      
      expect(console.warn).toHaveBeenCalledWith('Failed to recover events:', expect.any(Error));
    });

    it('returns fallback data for completely invalid input', () => {
      const result = sanitizePartialMockData(null);
      
      expect(result.currentUser.name).toBe('Usuario Desconocido');
      expect(result.news).toEqual([]);
    });

    it('logs recovery summary', () => {
      const result = sanitizePartialMockData(validMockData);
      
      expect(console.log).toHaveBeenCalledWith(
        'Partial data recovery completed:',
        expect.objectContaining({
          news: 1,
          events: 1,
          newHires: 1,
          quickLinks: 1,
          spaces: 1,
          applications: 1
        })
      );
    });
  });

  describe('getDataHealthStatus', () => {
    it('returns healthy status for complete data', () => {
      const status = getDataHealthStatus(validMockData);
      
      expect(status.status).toBe('healthy');
      expect(status.issues).toEqual([]);
      expect(status.recommendations).toEqual([]);
    });

    it('returns degraded status for missing some data', () => {
      const incompleteData = {
        ...validMockData,
        news: [],
        events: []
      };
      
      const status = getDataHealthStatus(incompleteData);
      
      expect(status.status).toBe('degraded');
      expect(status.issues).toContain('No hay noticias disponibles');
      expect(status.issues).toContain('No hay eventos disponibles');
      expect(status.recommendations).toContain('Verificar fuente de noticias');
    });

    it('returns critical status for missing most data', () => {
      const criticalData = {
        ...validMockData,
        currentUser: { ...validMockData.currentUser, name: '' },
        news: [],
        events: [],
        newHires: [],
        quickLinks: []
      };
      
      const status = getDataHealthStatus(criticalData);
      
      expect(status.status).toBe('critical');
      expect(status.issues.length).toBeGreaterThan(2);
    });
  });

  describe('getValidationSummary', () => {
    it('returns success summary for valid data', () => {
      const summary = getValidationSummary(validMockData);
      
      expect(summary).toContain('Validation successful');
      expect(summary).toContain('Current user: Test User');
      expect(summary).toContain('News articles: 1');
    });

    it('returns failure message for invalid data', () => {
      const invalidData = { invalid: 'data' };
      const summary = getValidationSummary(invalidData);
      
      expect(summary).toBe('Validation failed - check console for details');
    });
  });
});

describe('ValidationError', () => {
  it('creates error with message', () => {
    const error = new ValidationError('Test message');
    
    expect(error.message).toBe('Test message');
    expect(error.name).toBe('ValidationError');
    expect(error).toBeInstanceOf(Error);
  });

  it('creates error with field and value', () => {
    const error = new ValidationError('Invalid field', 'email', 'invalid-email');
    
    expect(error.message).toBe('Invalid field');
    expect(error.field).toBe('email');
    expect(error.value).toBe('invalid-email');
  });
});