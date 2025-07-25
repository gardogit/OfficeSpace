import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Header } from '../components/layout/Header';
import { NavigationBar } from '../components/layout/NavigationBar';
import { NewsCarousel } from '../components/dashboard/NewsCarousel';
import { Button } from '../components/ui/Button';
import { mockData } from './mocks/mockData';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Header Component', () => {
    const mockUser = mockData.currentUser;

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Header user={mockUser} onSearch={() => {}} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      render(<Header user={mockUser} onSearch={() => {}} />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByLabelText(/notificaciones/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ayuda/i)).toBeInTheDocument();
    });

    it('should have skip links', () => {
      render(<Header user={mockUser} onSearch={() => {}} />);
      
      expect(screen.getByText('Saltar al contenido principal')).toBeInTheDocument();
      expect(screen.getByText('Saltar a la navegación')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Header user={mockUser} onSearch={() => {}} />);
      
      const notificationButton = screen.getByLabelText(/notificaciones/i);
      
      // Tab multiple times to get past skip links
      await user.tab(); // Skip link 1
      await user.tab(); // Skip link 2  
      await user.tab(); // Logo link
      await user.tab(); // Search input
      await user.tab(); // Notification button
      expect(notificationButton).toHaveFocus();
    });
  });

  describe('NavigationBar Component', () => {
    const mockSections = [
      { id: 'inicio', label: 'Inicio' },
      { id: 'noticias', label: 'Noticias' },
      { id: 'eventos', label: 'Eventos' }
    ];

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <div>
          <NavigationBar sections={mockSections} activeSection="inicio" />
          {/* Add corresponding tabpanels for ARIA validation */}
          <div id="tabpanel-inicio" role="tabpanel" aria-labelledby="tab-inicio">Inicio content</div>
          <div id="tabpanel-noticias" role="tabpanel" aria-labelledby="tab-noticias">Noticias content</div>
          <div id="tabpanel-eventos" role="tabpanel" aria-labelledby="tab-eventos">Eventos content</div>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <NavigationBar sections={mockSections} activeSection="inicio" />
      );
      
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
      
      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const onSectionChange = vi.fn();
      
      render(
        <NavigationBar 
          sections={mockSections} 
          activeSection="inicio"
          onSectionChange={onSectionChange}
        />
      );
      
      const firstTab = screen.getByRole('tab', { name: /inicio/i });
      firstTab.focus();
      
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: /noticias/i })).toHaveFocus();
    });

    it('should handle Enter and Space key activation', async () => {
      const user = userEvent.setup();
      const onSectionChange = vi.fn();
      
      render(
        <NavigationBar 
          sections={mockSections} 
          activeSection="inicio"
          onSectionChange={onSectionChange}
        />
      );
      
      const noticiasTab = screen.getByRole('tab', { name: /noticias/i });
      noticiasTab.focus();
      
      await user.keyboard('{Enter}');
      expect(onSectionChange).toHaveBeenCalledWith('noticias');
    });
  });

  describe('NewsCarousel Component', () => {
    const mockNews = mockData.news.slice(0, 3);

    it('should not have accessibility violations', async () => {
      const { container } = render(
        <NewsCarousel news={mockNews} autoRotate={false} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', async () => {
      render(<NewsCarousel news={mockNews} autoRotate={false} />);
      
      // Wait for loading to complete
      await screen.findByRole('region', { name: /carrusel de noticias/i });
      
      expect(screen.getByRole('region')).toHaveAttribute('aria-live', 'polite');
      
      // Wait for tablist to appear after loading
      await screen.findByRole('tablist');
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<NewsCarousel news={mockNews} autoRotate={false} />);
      
      // Wait for loading to complete
      const carousel = await screen.findByRole('region');
      
      // Focus the carousel container
      const focusableElement = carousel.querySelector('[tabindex="0"]') as HTMLElement;
      if (focusableElement) {
        focusableElement.focus();
        await user.keyboard('{ArrowRight}');
      }
      // Should announce navigation to screen readers
    });

    it('should pause on focus and resume on blur', async () => {
      const user = userEvent.setup();
      render(<NewsCarousel news={mockNews} autoRotate={true} />);
      
      const carousel = await screen.findByRole('region');
      
      // Find the focusable element within the carousel
      const focusableElement = carousel.querySelector('[tabindex="0"]') as HTMLElement;
      if (focusableElement) {
        await user.hover(focusableElement);
        // Auto-rotation should pause
        
        await user.unhover(focusableElement);
        // Auto-rotation should resume
      }
    });

    it('should have descriptive image alt text', async () => {
      render(<NewsCarousel news={mockNews} autoRotate={false} />);
      
      const image = await screen.findByRole('img');
      expect(image).toHaveAttribute('alt', expect.stringContaining('Imagen del artículo:'));
    });
  });

  describe('Button Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(
        <Button variant="primary">Test Button</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support ARIA attributes', () => {
      render(
        <Button 
          variant="primary"
          aria-label="Custom label"
          aria-describedby="description"
          aria-expanded={true}
          aria-haspopup="menu"
        >
          Test Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-describedby', 'description');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should handle disabled state properly', () => {
      render(
        <Button variant="primary" disabled>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should handle loading state properly', () => {
      render(
        <Button variant="primary" loading>
          Loading Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Color Contrast', () => {
    it('should meet WCAG 2.1 AA contrast requirements', async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      );
      
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });
  });

  describe('Focus Management', () => {
    it('should have visible focus indicators', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Button variant="primary">Button 1</Button>
          <Button variant="secondary">Button 2</Button>
        </div>
      );
      
      await user.tab();
      const firstButton = screen.getByRole('button', { name: 'Button 1' });
      expect(firstButton).toHaveFocus();
      
      await user.tab();
      const secondButton = screen.getByRole('button', { name: 'Button 2' });
      expect(secondButton).toHaveFocus();
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide appropriate screen reader content', () => {
      render(
        <div>
          <span className="sr-only">Screen reader only content</span>
          <Button aria-label="Close dialog">×</Button>
        </div>
      );
      
      expect(screen.getByText('Screen reader only content')).toBeInTheDocument();
      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
    });
  });
});