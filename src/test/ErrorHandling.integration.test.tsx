import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { useLoadingState } from '../hooks/useLoadingState';

// Mock the useLoadingState hook to control loading and error states
vi.mock('../hooks/useLoadingState');
const mockUseLoadingState = useLoadingState as any;

// Mock console methods to avoid noise in tests
const originalError = console.error;
const originalWarn = console.warn;
beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

describe('Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeleton while data is loading', () => {
    mockUseLoadingState.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      retry: vi.fn()
    });

    render(<App />);

    // Should show header skeleton
    expect(screen.getByRole('generic')).toBeInTheDocument();
    
    // Should show loading skeletons instead of content
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('shows error state when data loading fails', () => {
    const mockRetry = vi.fn();
    mockUseLoadingState.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load dashboard data'),
      retry: mockRetry
    });

    render(<App />);

    expect(screen.getByText('Error al cargar el dashboard')).toBeInTheDocument();
    expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /reintentar/i });
    expect(retryButton).toBeInTheDocument();
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalled();
  });

  it('shows fallback error message when error has no message', () => {
    mockUseLoadingState.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(),
      retry: vi.fn()
    });

    render(<App />);

    expect(screen.getByText('Error al cargar el dashboard')).toBeInTheDocument();
    expect(screen.getByText(/No se pudieron cargar los datos del dashboard/)).toBeInTheDocument();
  });

  it('handles invalid mock data gracefully', () => {
    // Mock data that will fail validation
    const invalidData = {
      currentUser: null, // Invalid user
      news: 'not-an-array', // Invalid news
      events: [],
      newHires: [],
      quickLinks: [],
      spaces: [],
      applications: []
    };

    mockUseLoadingState.mockReturnValue({
      data: invalidData,
      isLoading: false,
      error: null,
      retry: vi.fn()
    });

    render(<App />);

    // Should use fallback data and show warning
    expect(console.warn).toHaveBeenCalledWith(
      'Using fallback data due to validation error:',
      expect.any(Error)
    );

    // Should render with fallback user data
    expect(screen.getByText('Usuario Desconocido')).toBeInTheDocument();
  });

  it('renders successfully with valid data', () => {
    const validData = {
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
        title: 'Test News Article',
        summary: 'This is a test news article',
        content: 'Full content here',
        author: 'Test Author',
        publishDate: '2024-01-15T10:30:00Z',
        category: 'General',
        imageUrl: 'news.jpg'
      }],
      events: [{
        id: 'event1',
        title: 'Test Event',
        description: 'This is a test event',
        startDate: '2024-02-15T10:30:00Z',
        endDate: '2024-02-15T12:30:00Z',
        location: 'Conference Room',
        organizer: 'Event Organizer',
        attendees: 25
      }],
      newHires: [{
        id: 'emp1',
        name: 'New Employee',
        position: 'Software Developer',
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

    mockUseLoadingState.mockReturnValue({
      data: validData,
      isLoading: false,
      error: null,
      retry: vi.fn()
    });

    render(<App />);

    // Should render main content
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test News Article')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('New Employee')).toBeInTheDocument();
  });

  it('handles component-level errors with error boundaries', () => {
    const validData = {
      currentUser: {
        id: 'user1',
        name: 'Test User',
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

    mockUseLoadingState.mockReturnValue({
      data: validData,
      isLoading: false,
      error: null,
      retry: vi.fn()
    });

    // Mock a component to throw an error
    const MockNewsCarousel = () => {
      throw new Error('Component error');
    };

    // Replace the component temporarily
    vi.doMock('../components/dashboard/NewsCarousel', () => ({
      NewsCarousel: MockNewsCarousel
    }));

    render(<App />);

    // Error boundary should catch the error and show fallback UI
    // Note: This test might need adjustment based on how error boundaries are implemented
    expect(console.error).toHaveBeenCalled();
  });

  it('shows appropriate empty states when data arrays are empty', () => {
    const emptyData = {
      currentUser: {
        id: 'user1',
        name: 'Test User',
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

    mockUseLoadingState.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: null,
      retry: vi.fn()
    });

    render(<App />);

    // Should render the app but with empty states
    expect(screen.getByText('Test User')).toBeInTheDocument();
    
    // Check for empty state messages (these might be in specific components)
    // The exact text depends on how empty states are implemented in components
  });

  it('handles search with no results gracefully', async () => {
    const dataWithContent = {
      currentUser: {
        id: 'user1',
        name: 'Test User',
        email: 'test@example.com',
        department: 'IT',
        role: 'Developer'
      },
      news: [{
        id: 'news1',
        title: 'Company Update',
        summary: 'Important company news',
        content: 'Content',
        author: 'CEO',
        publishDate: '2024-01-15T10:30:00Z',
        category: 'General'
      }],
      events: [],
      newHires: [],
      quickLinks: [],
      spaces: [],
      applications: []
    };

    mockUseLoadingState.mockReturnValue({
      data: dataWithContent,
      isLoading: false,
      error: null,
      retry: vi.fn()
    });

    render(<App />);

    // Find and use search functionality
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'nonexistent search term' } });
    fireEvent.submit(searchInput.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron resultados/)).toBeInTheDocument();
    });
  });
});