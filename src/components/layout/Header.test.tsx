import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { UserProfile } from '../../types';

// Mock the child components
vi.mock('./SearchBar', () => ({
  SearchBar: ({ onSearch }: { onSearch?: (query: string) => void }) => (
    <div data-testid="search-bar">
      <input 
        data-testid="search-input" 
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  )
}));

vi.mock('./UserControls', () => ({
  UserControls: ({ user }: { user: UserProfile }) => (
    <div data-testid="user-controls">
      <span data-testid="user-name">{user.name}</span>
    </div>
  )
}));

describe('Header Component', () => {
  const mockUser: UserProfile = {
    id: 'user-001',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    avatar: 'https://example.com/avatar.jpg',
    department: 'Tecnología',
    role: 'Desarrolladora Senior'
  };

  it('renders header structure correctly', () => {
    const { container } = render(<Header user={mockUser} />);
    
    // Check main container
    const header = container.querySelector('.flex.items-center.justify-between');
    
    expect(header).toBeInTheDocument();
  });

  it('displays company logo and name', () => {
    render(<Header user={mockUser} />);
    
    // Check for logo (the "C" in the blue circle)
    expect(screen.getByText('C')).toBeInTheDocument();
    
    // Check for company name
    expect(screen.getByText('Corporate Hub')).toBeInTheDocument();
  });

  it('renders SearchBar component', () => {
    render(<Header user={mockUser} />);
    
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('renders UserControls component with user data', () => {
    render(<Header user={mockUser} />);
    
    expect(screen.getByTestId('user-controls')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('María González');
  });

  it('passes onSearch prop to SearchBar', () => {
    const mockOnSearch = vi.fn();
    render(<Header user={mockUser} onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // The mock SearchBar should call onSearch
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('applies correct CSS classes for layout', () => {
    const { container } = render(<Header user={mockUser} />);
    
    // Check for flex layout classes
    const headerContainer = container.querySelector('.flex.items-center.justify-between');
    expect(headerContainer).toBeInTheDocument();
    
    // Check for height and padding classes
    expect(headerContainer).toHaveClass('h-16', 'px-4');
  });

  it('has responsive design classes', () => {
    const { container } = render(<Header user={mockUser} />);
    
    // Check for responsive padding classes
    const headerContainer = container.querySelector('.sm\\:px-6.lg\\:px-8');
    expect(headerContainer).toBeInTheDocument();
  });

  it('logo section has correct structure', () => {
    const { container } = render(<Header user={mockUser} />);
    
    // Check logo container
    const logoContainer = container.querySelector('.flex-shrink-0');
    expect(logoContainer).toBeInTheDocument();
    
    // Check logo styling
    const logoIcon = container.querySelector('.w-8.h-8.bg-primary-600.rounded-lg');
    expect(logoIcon).toBeInTheDocument();
  });

  it('search section has correct flex classes', () => {
    const { container } = render(<Header user={mockUser} />);
    
    // Check search section flex classes
    const searchSection = container.querySelector('.flex-1.max-w-lg');
    expect(searchSection).toBeInTheDocument();
  });

  it('company name is hidden on small screens', () => {
    const { container } = render(<Header user={mockUser} />);
    
    // Check for hidden class on small screens
    const companyName = container.querySelector('.hidden.sm\\:block');
    expect(companyName).toBeInTheDocument();
    expect(companyName).toHaveTextContent('Corporate Hub');
  });
});