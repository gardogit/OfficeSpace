import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Header } from '../components/layout/Header';
import { mockData } from './mocks/mockData';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Test component to access theme context
const TestComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
    </div>
  );
};

describe('Theme System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    document.documentElement.classList.remove('dark');
    
    // Mock matchMedia to return light theme preference by default
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false, // This makes prefers-color-scheme: dark return false
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  describe('ThemeProvider', () => {
    it('should provide default light theme', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('should load theme from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should respect system preference when no saved theme', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('should toggle theme correctly', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      await user.click(screen.getByTestId('toggle-theme'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should set theme directly', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('set-dark'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

      await user.click(screen.getByTestId('set-light'));

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should apply dark class to document element', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(false);

      await user.click(screen.getByTestId('set-dark'));

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      await user.click(screen.getByTestId('set-light'));

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('ThemeToggle Component', () => {
    it('should render with correct initial state', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Cambiar a tema oscuro');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should toggle theme when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');

      await user.click(button);

      expect(button).toHaveAttribute('aria-label', 'Cambiar a tema claro');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');

      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should have proper accessibility attributes', () => {
      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('aria-pressed');
      expect(button).toHaveAttribute('title');
    });

    it('should animate icons correctly', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      const button = screen.getByRole('button');
      
      // Check initial state (light theme - sun visible)
      const sunIcon = button.querySelector('svg:first-child');
      const moonIcon = button.querySelector('svg:last-child');

      expect(sunIcon).toHaveClass('opacity-100');
      expect(moonIcon).toHaveClass('opacity-0');

      await user.click(button);

      // After toggle (dark theme - moon visible)
      await waitFor(() => {
        expect(sunIcon).toHaveClass('opacity-0');
        expect(moonIcon).toHaveClass('opacity-100');
      });
    });
  });

  describe('Header Component with Theme', () => {
    it('should render with theme toggle instead of help button', () => {
      render(
        <ThemeProvider>
          <Header user={mockData.currentUser} />
        </ThemeProvider>
      );

      // Should have theme toggle
      expect(screen.getByRole('button', { name: /cambiar a tema/i })).toBeInTheDocument();
      
      // Should not have help button
      expect(screen.queryByLabelText(/ayuda/i)).not.toBeInTheDocument();
    });

    it('should apply dark theme styles', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <Header user={mockData.currentUser} />
        </ThemeProvider>
      );

      const themeToggle = screen.getByRole('button', { name: /cambiar a tema/i });
      await user.click(themeToggle);

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('dark:bg-gray-800');
    });
  });

  describe('Theme Persistence', () => {
    it('should save theme preference to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      );

      await user.click(screen.getByRole('button'));

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should restore theme from localStorage on mount', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('System Theme Detection', () => {
    it('should detect system dark mode preference', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('should listen for system theme changes', () => {
      const mockMediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      window.matchMedia = vi.fn().mockReturnValue(mockMediaQuery);

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('Theme CSS Classes', () => {
    it('should apply correct CSS classes for light theme', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should apply correct CSS classes for dark theme', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId('set-dark'));

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class when switching to light theme', async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Set to dark first
      await user.click(screen.getByTestId('set-dark'));
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // Switch back to light
      await user.click(screen.getByTestId('set-light'));
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('Theme Toggle Sizes', () => {
    it('should render with different sizes', () => {
      const { rerender } = render(
        <ThemeProvider>
          <ThemeToggle size="sm" />
        </ThemeProvider>
      );

      let button = screen.getByRole('button');
      expect(button).toHaveClass('btn-sm');

      rerender(
        <ThemeProvider>
          <ThemeToggle size="lg" />
        </ThemeProvider>
      );

      button = screen.getByRole('button');
      expect(button).toHaveClass('btn-lg');
    });
  });
});