import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import NewsCarousel from './NewsCarousel';
import { NewsArticle } from '../../types';

// Mock data
const mockNews: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'Primera Noticia',
    summary: 'Resumen de la primera noticia para testing',
    content: 'Contenido completo de la primera noticia',
    author: 'Autor Uno',
    publishDate: '2024-01-15T09:00:00Z',
    imageUrl: 'https://example.com/image1.jpg',
    category: 'Tecnología'
  },
  {
    id: 'news-002',
    title: 'Segunda Noticia',
    summary: 'Resumen de la segunda noticia para testing',
    content: 'Contenido completo de la segunda noticia',
    author: 'Autor Dos',
    publishDate: '2024-01-14T14:30:00Z',
    imageUrl: 'https://example.com/image2.jpg',
    category: 'Empresa'
  },
  {
    id: 'news-003',
    title: 'Tercera Noticia',
    summary: 'Resumen de la tercera noticia para testing',
    content: 'Contenido completo de la tercera noticia',
    author: 'Autor Tres',
    publishDate: '2024-01-13T11:15:00Z',
    category: 'Eventos'
  }
];

describe('NewsCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Loading State', () => {
    it('should show loading skeleton initially', () => {
      render(<NewsCarousel news={mockNews} />);
      
      // Should show loading skeleton
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('should hide loading state after timeout', () => {
      render(<NewsCarousel news={mockNews} />);
      
      // Should show loading initially
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
      
      // Fast-forward time to complete loading
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when news array is empty', () => {
      render(<NewsCarousel news={[]} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText('Error al cargar noticias')).toBeInTheDocument();
      expect(screen.getByText('No hay noticias disponibles')).toBeInTheDocument();
    });

    it('should show empty state when news is undefined', () => {
      render(<NewsCarousel news={undefined as any} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText('No hay noticias disponibles')).toBeInTheDocument();
      expect(screen.getByText('Vuelve más tarde para ver las últimas actualizaciones')).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    beforeEach(() => {
      render(<NewsCarousel news={mockNews} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
    });

    it('should display the first article initially', () => {
      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();
      expect(screen.getByText('Resumen de la primera noticia para testing')).toBeInTheDocument();
      expect(screen.getByText('Por Autor Uno')).toBeInTheDocument();
      expect(screen.getByText('Tecnología')).toBeInTheDocument();
    });

    it('should display formatted date', () => {
      expect(screen.getByText('15 de enero de 2024')).toBeInTheDocument();
    });

    it('should display article image with correct alt text', () => {
      const image = screen.getByAltText('Primera Noticia');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
    });

    it('should display category badge', () => {
      expect(screen.getByText('Tecnología')).toBeInTheDocument();
    });

    it('should display article counter', () => {
      expect(screen.getByText('1 de 3')).toBeInTheDocument();
    });
  });

  describe('Manual Navigation', () => {
    beforeEach(() => {
      render(<NewsCarousel news={mockNews} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
    });

    it('should navigate to next article when next button is clicked', () => {
      const nextButton = screen.getByLabelText('Siguiente artículo');
      fireEvent.click(nextButton);

      expect(screen.getByText('Segunda Noticia')).toBeInTheDocument();
      expect(screen.getByText('2 de 3')).toBeInTheDocument();
    });

    it('should navigate to previous article when previous button is clicked', () => {
      // First go to second article
      const nextButton = screen.getByLabelText('Siguiente artículo');
      fireEvent.click(nextButton);

      // Then go back to first
      const prevButton = screen.getByLabelText('Artículo anterior');
      fireEvent.click(prevButton);

      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();
      expect(screen.getByText('1 de 3')).toBeInTheDocument();
    });

    it('should wrap around when navigating past the last article', () => {
      const nextButton = screen.getByLabelText('Siguiente artículo');
      
      // Navigate to last article (index 2)
      fireEvent.click(nextButton); // index 1
      fireEvent.click(nextButton); // index 2
      
      expect(screen.getByText('Tercera Noticia')).toBeInTheDocument();
      
      // Navigate past last article should wrap to first
      fireEvent.click(nextButton); // should wrap to index 0
      
      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();
    });

    it('should wrap around when navigating before the first article', () => {
      const prevButton = screen.getByLabelText('Artículo anterior');
      
      // Navigate before first article should wrap to last
      fireEvent.click(prevButton);
      
      expect(screen.getByText('Tercera Noticia')).toBeInTheDocument();
      expect(screen.getByText('3 de 3')).toBeInTheDocument();
    });
  });

  describe('Position Indicators', () => {
    beforeEach(() => {
      render(<NewsCarousel news={mockNews} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
    });

    it('should display correct number of indicators', () => {
      const indicators = screen.getAllByLabelText(/Ir al artículo \d+/);
      expect(indicators).toHaveLength(3);
    });

    it('should highlight the active indicator', () => {
      const firstIndicator = screen.getByLabelText('Ir al artículo 1');
      expect(firstIndicator).toHaveClass('bg-primary-600');
    });

    it('should navigate to specific article when indicator is clicked', () => {
      const thirdIndicator = screen.getByLabelText('Ir al artículo 3');
      fireEvent.click(thirdIndicator);

      expect(screen.getByText('Tercera Noticia')).toBeInTheDocument();
      expect(screen.getByText('3 de 3')).toBeInTheDocument();
    });

    it('should update active indicator when navigating', () => {
      const nextButton = screen.getByLabelText('Siguiente artículo');
      fireEvent.click(nextButton);

      const secondIndicator = screen.getByLabelText('Ir al artículo 2');
      expect(secondIndicator).toHaveClass('bg-primary-600');
    });
  });

  describe('Auto-rotation', () => {
    it('should auto-rotate by default', () => {
      render(<NewsCarousel news={mockNews} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();

      // Advance time by auto-rotate interval (5000ms)
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText('Segunda Noticia')).toBeInTheDocument();
    });

    it('should not auto-rotate when autoRotate is false', () => {
      render(<NewsCarousel news={mockNews} autoRotate={false} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();

      // Advance time by auto-rotate interval
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should still be on first article
      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();
    });

    it('should use custom auto-rotate interval', () => {
      render(<NewsCarousel news={mockNews} autoRotateInterval={2000} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();

      // Advance time by custom interval (2000ms)
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText('Segunda Noticia')).toBeInTheDocument();
    });

    it('should not auto-rotate with single article', () => {
      render(<NewsCarousel news={[mockNews[0]]} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();

      // Advance time by auto-rotate interval
      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Should still be on the same article
      expect(screen.getByText('Primera Noticia')).toBeInTheDocument();
    });
  });

  describe('Single Article Display', () => {
    it('should not show navigation controls with single article', () => {
      render(<NewsCarousel news={[mockNews[0]]} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.queryByLabelText('Siguiente artículo')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Artículo anterior')).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Ir al artículo \d+/)).not.toBeInTheDocument();
    });
  });

  describe('Image Error Handling', () => {
    it('should handle image load errors gracefully', () => {
      render(<NewsCarousel news={mockNews} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      const image = screen.getByAltText('Primera Noticia');
      
      // Simulate image error
      fireEvent.error(image);
      
      expect(image).toHaveStyle('display: none');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      render(<NewsCarousel news={mockNews} />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
    });

    it('should have proper aria labels for navigation buttons', () => {
      expect(screen.getByLabelText('Artículo anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Siguiente artículo')).toBeInTheDocument();
    });

    it('should have proper aria labels for indicators', () => {
      expect(screen.getByLabelText('Ir al artículo 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Ir al artículo 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Ir al artículo 3')).toBeInTheDocument();
    });

    it('should have proper alt text for images', () => {
      expect(screen.getByAltText('Primera Noticia')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<NewsCarousel news={mockNews} className="custom-class" />);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});