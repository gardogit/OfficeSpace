import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NewsGrid } from '../components/dashboard/NewsGrid';
import { NewsArticle } from '../types';

// Mock window.matchMedia for theme context
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const mockNews: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'Nueva Política de Trabajo Remoto',
    summary: 'La empresa implementa una política flexible de trabajo híbrido para mejorar el equilibrio vida-trabajo.',
    content: 'Contenido completo del artículo...',
    author: 'Recursos Humanos',
    publishDate: '2024-01-15T09:00:00Z',
    imageUrl: 'https://example.com/image1.jpg',
    category: 'Políticas'
  },
  {
    id: 'news-002',
    title: 'Lanzamiento de Nueva Plataforma',
    summary: 'Presentamos nuestra nueva plataforma de colaboración interna.',
    content: 'Contenido completo del artículo...',
    author: 'Tecnología',
    publishDate: '2024-01-10T14:30:00Z',
    imageUrl: 'https://example.com/image2.jpg',
    category: 'Tecnología'
  },
  {
    id: 'news-003',
    title: 'Resultados del Trimestre',
    summary: 'Excelentes resultados financieros para el último trimestre.',
    content: 'Contenido completo del artículo...',
    author: 'Finanzas',
    publishDate: '2024-01-05T11:15:00Z',
    category: 'Finanzas'
  }
];

const NewsGridWithTheme = ({ news = mockNews }: { news?: NewsArticle[] }) => (
  <ThemeProvider>
    <NewsGrid news={news} />
  </ThemeProvider>
);

describe('NewsGrid', () => {
  it('renders news grid with view mode toggle', () => {
    render(<NewsGridWithTheme />);
    
    // Should show title and article count
    expect(screen.getByText('Todas las Noticias')).toBeInTheDocument();
    expect(screen.getByText('(3 artículos)')).toBeInTheDocument();
    
    // Should show view mode toggle buttons
    expect(screen.getByLabelText('Vista en filas')).toBeInTheDocument();
    expect(screen.getByLabelText('Vista en cuadrícula')).toBeInTheDocument();
    
    // Should show all news articles
    expect(screen.getByText('Nueva Política de Trabajo Remoto')).toBeInTheDocument();
    expect(screen.getByText('Lanzamiento de Nueva Plataforma')).toBeInTheDocument();
    expect(screen.getByText('Resultados del Trimestre')).toBeInTheDocument();
  });

  it('starts in grid view by default', () => {
    render(<NewsGridWithTheme />);
    
    // Grid view button should be active
    const gridButton = screen.getByLabelText('Vista en cuadrícula');
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    
    // Rows view button should not be active
    const rowsButton = screen.getByLabelText('Vista en filas');
    expect(rowsButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches between grid and rows view', async () => {
    render(<NewsGridWithTheme />);
    
    // Switch to rows view
    const rowsButton = screen.getByLabelText('Vista en filas');
    fireEvent.click(rowsButton);
    
    await waitFor(() => {
      expect(rowsButton).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByLabelText('Vista en cuadrícula')).toHaveAttribute('aria-pressed', 'false');
    });
    
    // Switch back to grid view
    const gridButton = screen.getByLabelText('Vista en cuadrícula');
    fireEvent.click(gridButton);
    
    await waitFor(() => {
      expect(gridButton).toHaveAttribute('aria-pressed', 'true');
      expect(rowsButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('displays article information correctly', () => {
    render(<NewsGridWithTheme />);
    
    // Check first article details
    expect(screen.getByText('Nueva Política de Trabajo Remoto')).toBeInTheDocument();
    expect(screen.getByText('La empresa implementa una política flexible de trabajo híbrido para mejorar el equilibrio vida-trabajo.')).toBeInTheDocument();
    expect(screen.getByText('Recursos Humanos')).toBeInTheDocument();
    expect(screen.getByText('Políticas')).toBeInTheDocument();
    
    // Check that date is formatted correctly (should show Spanish format)
    expect(screen.getByText(/15 de enero de 2024/)).toBeInTheDocument();
  });

  it('handles article clicks', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<NewsGridWithTheme />);
    
    // Click on first article
    const firstArticle = screen.getByLabelText('Leer artículo: Nueva Política de Trabajo Remoto');
    fireEvent.click(firstArticle);
    
    expect(consoleSpy).toHaveBeenCalledWith('Artículo clickeado:', 'Nueva Política de Trabajo Remoto');
    
    consoleSpy.mockRestore();
  });

  it('handles keyboard navigation on articles', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<NewsGridWithTheme />);
    
    // Use keyboard to activate article
    const firstArticle = screen.getByLabelText('Leer artículo: Nueva Política de Trabajo Remoto');
    fireEvent.keyDown(firstArticle, { key: 'Enter' });
    
    expect(consoleSpy).toHaveBeenCalledWith('Artículo clickeado:', 'Nueva Política de Trabajo Remoto');
    
    // Test space key
    fireEvent.keyDown(firstArticle, { key: ' ' });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    
    consoleSpy.mockRestore();
  });

  it('shows empty state when no news available', () => {
    render(<NewsGridWithTheme news={[]} />);
    
    expect(screen.getByText('No hay noticias disponibles')).toBeInTheDocument();
    expect(screen.getByText('Vuelve más tarde para ver las últimas actualizaciones')).toBeInTheDocument();
    
    // Should not show view toggle when empty
    expect(screen.queryByText('Todas las Noticias')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Vista en filas')).not.toBeInTheDocument();
  });

  it('handles articles without images gracefully', () => {
    const newsWithoutImages = mockNews.map(article => ({ ...article, imageUrl: undefined }));
    render(<NewsGridWithTheme news={newsWithoutImages} />);
    
    // Should still render articles without images
    expect(screen.getByText('Nueva Política de Trabajo Remoto')).toBeInTheDocument();
    expect(screen.getByText('Lanzamiento de Nueva Plataforma')).toBeInTheDocument();
  });

  it('shows correct article count for single article', () => {
    render(<NewsGridWithTheme news={[mockNews[0]]} />);
    
    expect(screen.getByText('(1 artículo)')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<NewsGridWithTheme />);
    
    // Check for proper ARIA attributes
    expect(screen.getByRole('feed')).toBeInTheDocument();
    expect(screen.getByLabelText('Lista de noticias')).toBeInTheDocument();
    
    // Check article buttons have proper labels
    const articles = screen.getAllByRole('button');
    const articleButtons = articles.filter(button => 
      button.getAttribute('aria-label')?.startsWith('Leer artículo:')
    );
    expect(articleButtons).toHaveLength(3);
  });
});