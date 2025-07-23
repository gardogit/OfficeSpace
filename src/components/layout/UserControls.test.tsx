import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserControls } from './UserControls';
import { UserProfile } from '../../types';

// Mock the Avatar component
vi.mock('../ui/Avatar', () => ({
  Avatar: ({ name, size }: { name: string; size: string }) => (
    <div data-testid={`avatar-${size}`} data-name={name}>
      {name.split(' ').map(n => n[0]).join('')}
    </div>
  )
}));

describe('UserControls Component', () => {
  const mockUser: UserProfile = {
    id: 'user-001',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    avatar: 'https://example.com/avatar.jpg',
    department: 'Tecnología',
    role: 'Desarrolladora Senior'
  };

  beforeEach(() => {
    // Mock console.log to avoid noise in tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders user button with avatar and info', () => {
    render(<UserControls user={mockUser} />);
    
    // Check for user button
    const userButton = screen.getByRole('button');
    expect(userButton).toBeInTheDocument();
    expect(userButton).toHaveAttribute('aria-haspopup', 'true');
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
    
    // Check for avatar
    expect(screen.getByTestId('avatar-sm')).toBeInTheDocument();
    
    // Check for user name and role (hidden on mobile)
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('Desarrolladora Senior')).toBeInTheDocument();
  });

  it('shows dropdown arrow icon', () => {
    const { container } = render(<UserControls user={mockUser} />);
    
    // Check for dropdown arrow SVG
    const arrowIcon = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(arrowIcon).toBeInTheDocument();
    
    // Check for arrow path
    const arrowPath = container.querySelector('path[d*="M19 9l-7 7-7-7"]');
    expect(arrowPath).toBeInTheDocument();
  });

  it('toggles dropdown when button is clicked', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    const userButton = screen.getByRole('button');
    
    // Initially dropdown should be closed
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Ver Perfil')).not.toBeInTheDocument();
    
    // Click to open dropdown
    await user.click(userButton);
    
    expect(userButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Ver Perfil')).toBeInTheDocument();
    
    // Click again to close dropdown
    await user.click(userButton);
    
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Ver Perfil')).not.toBeInTheDocument();
  });

  it('displays user information in dropdown header', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    // Open dropdown
    await user.click(screen.getByRole('button'));
    
    // Check user info in dropdown - use getAllByText since name appears twice
    const nameElements = screen.getAllByText('María González');
    expect(nameElements).toHaveLength(2); // Once in button, once in dropdown
    expect(screen.getByText('maria.gonzalez@empresa.com')).toBeInTheDocument();
    expect(screen.getByText('Desarrolladora Senior • Tecnología')).toBeInTheDocument();
    
    // Check for medium avatar in dropdown
    expect(screen.getByTestId('avatar-md')).toBeInTheDocument();
  });

  it('displays all menu items', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    // Open dropdown
    await user.click(screen.getByRole('button'));
    
    // Check all menu items
    expect(screen.getByText('Ver Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Ayuda y Soporte')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('handles menu item clicks', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    // Open dropdown
    await user.click(screen.getByRole('button'));
    
    // Click profile menu item
    await user.click(screen.getByText('Ver Perfil'));
    
    expect(console.log).toHaveBeenCalledWith('User action: profile');
    
    // Dropdown should close after clicking menu item
    expect(screen.queryByText('Ver Perfil')).not.toBeInTheDocument();
  });

  it('handles settings menu item click', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Configuración'));
    
    expect(console.log).toHaveBeenCalledWith('User action: settings');
  });

  it('handles logout menu item click', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Cerrar Sesión'));
    
    expect(console.log).toHaveBeenCalledWith('User action: logout');
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <UserControls user={mockUser} />
        <div data-testid="outside-element">Outside</div>
      </div>
    );
    
    // Open dropdown
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Ver Perfil')).toBeInTheDocument();
    
    // Click outside
    await user.click(screen.getByTestId('outside-element'));
    
    // Dropdown should close
    await waitFor(() => {
      expect(screen.queryByText('Ver Perfil')).not.toBeInTheDocument();
    });
  });

  it('rotates arrow icon when dropdown is open', async () => {
    const user = userEvent.setup();
    const { container } = render(<UserControls user={mockUser} />);
    
    const arrowIcon = container.querySelector('svg');
    
    // Initially not rotated
    expect(arrowIcon).not.toHaveClass('rotate-180');
    
    // Open dropdown
    await user.click(screen.getByRole('button'));
    
    // Should be rotated
    expect(arrowIcon).toHaveClass('rotate-180');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<UserControls user={mockUser} />);
    
    // Check main container
    const mainContainer = container.querySelector('.relative');
    expect(mainContainer).toBeInTheDocument();
    
    // Check button styling
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex',
      'items-center',
      'space-x-3',
      'p-2',
      'rounded-lg',
      'hover:bg-gray-100'
    );
  });

  it('has responsive user info display', () => {
    const { container } = render(<UserControls user={mockUser} />);
    
    // Check for hidden on mobile class
    const userInfo = container.querySelector('.hidden.md\\:block');
    expect(userInfo).toBeInTheDocument();
  });

  it('dropdown has correct positioning and styling', async () => {
    const user = userEvent.setup();
    const { container } = render(<UserControls user={mockUser} />);
    
    await user.click(screen.getByRole('button'));
    
    // Check dropdown styling
    const dropdown = container.querySelector('.absolute.right-0.mt-2');
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass(
      'w-64',
      'bg-white',
      'rounded-lg',
      'shadow-lg',
      'border',
      'border-gray-200'
    );
  });

  it('logout menu item has red styling', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    await user.click(screen.getByRole('button'));
    
    const logoutButton = screen.getByText('Cerrar Sesión').closest('button');
    expect(logoutButton).toHaveClass('text-red-700', 'hover:bg-red-50');
  });

  it('menu items have hover effects', async () => {
    const user = userEvent.setup();
    render(<UserControls user={mockUser} />);
    
    await user.click(screen.getByRole('button'));
    
    const profileButton = screen.getByText('Ver Perfil').closest('button');
    expect(profileButton).toHaveClass('hover:bg-gray-100');
  });
});