import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { NewsArticle } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useAnnouncements } from '../../hooks/useAccessibility';
import { KEYS } from '../../utils/accessibility';

import { ErrorFallback } from '../common/ErrorFallback';

export interface NewsCarouselProps {
  news: NewsArticle[];
  autoRotate?: boolean;
  autoRotateInterval?: number;
  className?: string;
}

const NewsCarouselComponent: React.FC<NewsCarouselProps> = ({
  news,
  autoRotate = true,
  autoRotateInterval = 5000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { announce } = useAnnouncements();
  
  // Enhanced error handling
  const errorHandler = useErrorHandler({
    componentName: 'NewsCarousel',
    maxRetries: 2,
    onError: (error, attempt) => {
      console.error(`NewsCarousel error (attempt ${attempt}):`, error);
    }
  });

  // Simulate loading state with error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!news) {
          throw new Error('No se pudieron cargar las noticias');
        }
        
        if (news.length === 0) {
          // This is not an error, just empty state
          setIsLoading(false);
          return;
        }

        // Validate news data structure
        const invalidNews = news.find(article => 
          !article.id || !article.title || !article.author || !article.publishDate
        );
        
        if (invalidNews) {
          throw new Error('Datos de noticias inválidos');
        }

        setIsLoading(false);
        errorHandler.clearError(); // Clear any previous errors
      } catch (error) {
        setIsLoading(false);
        errorHandler.handleError(error instanceof Error ? error : new Error('Error desconocido'));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [news, errorHandler]);

  // Auto-rotation logic with pause support
  useEffect(() => {
    if (!autoRotate || isLoading || errorHandler.hasError || !news || news.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % news.length;
        const article = news[newIndex];
        if (article) {
          announce(`Artículo ${newIndex + 1} de ${news.length}: ${article.title}`, 'polite');
        }
        return newIndex;
      });
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, autoRotateInterval, news?.length, isLoading, errorHandler.hasError, isPaused, announce]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    const article = news?.[index];
    if (article) {
      announce(`Navegando al artículo ${index + 1}: ${article.title}`, 'polite');
    }
  }, [news, announce]);

  const goToPrevious = useCallback(() => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? news.length - 1 : prevIndex - 1;
      const article = news[newIndex];
      if (article) {
        announce(`Artículo anterior: ${article.title}`, 'polite');
      }
      return newIndex;
    });
  }, [news, announce]);

  const goToNext = useCallback(() => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % news.length;
      const article = news[newIndex];
      if (article) {
        announce(`Siguiente artículo: ${article.title}`, 'polite');
      }
      return newIndex;
    });
  }, [news, announce]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!news || news.length <= 1) return;

    switch (event.key) {
      case KEYS.ARROW_LEFT:
        event.preventDefault();
        goToPrevious();
        break;
      case KEYS.ARROW_RIGHT:
        event.preventDefault();
        goToNext();
        break;
      case KEYS.SPACE:
        event.preventDefault();
        setIsPaused(prev => !prev);
        announce(isPaused ? 'Carrusel reanudado' : 'Carrusel pausado', 'polite');
        break;
    }
  }, [news, goToPrevious, goToNext, isPaused, announce]);

  // Add keyboard event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.addEventListener('keydown', handleKeyDown);
    return () => carousel.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (errorHandler.hasError) {
    return (
      <ErrorFallback
        error={errorHandler.error || undefined}
        resetError={errorHandler.clearError}
        componentName="NewsCarousel"
      />
    );
  }

  // Empty state
  if (!news || news.length === 0) {
    return (
      <Card className={`${className} text-center py-8`}>
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">No hay noticias disponibles</p>
          <p className="text-gray-600">Vuelve más tarde para ver las últimas actualizaciones</p>
        </div>
      </Card>
    );
  }

  const currentArticle = news[currentIndex];

  return (
    <div 
      className={`${className} relative overflow-hidden`}
      role="region"
      aria-label="Carrusel de noticias"
      aria-live="polite"
      aria-atomic="false"
    >
      <Card className="h-full">
      <div 
        ref={carouselRef}
        className="space-y-4 -mt-4"
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Screen reader instructions */}
        <div className="sr-only">
          Carrusel de noticias. Usa las flechas izquierda y derecha para navegar. 
          Presiona espacio para pausar o reanudar la rotación automática.
        </div>
        {/* Article image */}
        {currentArticle.imageUrl && (
          <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 group">
            <img
              src={currentArticle.imageUrl}
              alt={`Imagen del artículo: ${currentArticle.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="badge badge-primary shadow-sm" role="text">
                Categoría: {currentArticle.category}
              </span>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
          </div>
        )}

        {/* Article content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between caption">
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Por {currentArticle.author}</span>
            </span>
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(currentArticle.publishDate)}</span>
            </span>
          </div>
          
          <h2 
            className="heading-2 text-balance hover:text-primary-700 transition-colors duration-200 cursor-pointer"
            id={`article-title-${currentIndex}`}
          >
            {currentArticle.title}
          </h2>
          
          <p className="body-base text-gray-600 dark:text-gray-400">
            {currentArticle.summary}
          </p>
        </div>

        {/* Navigation controls */}
        {news.length > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            {/* Previous/Next buttons */}
            <div className="flex space-x-1" role="group" aria-label="Controles de navegación del carrusel">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="p-2 hover-lift"
                aria-label={`Ir al artículo anterior (${currentIndex === 0 ? news.length : currentIndex} de ${news.length})`}
                iconPosition="left"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                }
              >
                Anterior
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="p-2 hover-lift"
                aria-label={`Ir al siguiente artículo (${currentIndex + 2 > news.length ? 1 : currentIndex + 2} de ${news.length})`}
                iconPosition="right"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                Siguiente
              </Button>


            </div>

            {/* Position indicators */}
            <div className="flex space-x-2" role="tablist" aria-label="Indicadores de posición del carrusel">
              {news.map((article, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 hover-lift focus-ring ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-controls={`article-${index}`}
                  aria-label={`Ir al artículo ${index + 1}: ${article.title}`}
                  tabIndex={index === currentIndex ? 0 : -1}
                />
              ))}
            </div>

            {/* Article counter */}
            <div className="caption flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>{currentIndex + 1} de {news.length}</span>
            </div>
          </div>
        )}
      </div>
      </Card>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const NewsCarousel = memo(NewsCarouselComponent, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.news === nextProps.news &&
    prevProps.autoRotate === nextProps.autoRotate &&
    prevProps.autoRotateInterval === nextProps.autoRotateInterval &&
    prevProps.className === nextProps.className
  );
});

NewsCarousel.displayName = 'NewsCarousel';

export default NewsCarousel;