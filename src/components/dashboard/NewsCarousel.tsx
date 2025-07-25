import React, { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useErrorHandler } from '../../hooks/useErrorHandler';

import { ErrorFallback } from '../common/ErrorFallback';

export interface NewsCarouselProps {
  news: NewsArticle[];
  autoRotate?: boolean;
  autoRotateInterval?: number;
  className?: string;
}

export const NewsCarousel: React.FC<NewsCarouselProps> = ({
  news,
  autoRotate = true,
  autoRotateInterval = 5000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Auto-rotation logic
  useEffect(() => {
    if (!autoRotate || isLoading || errorHandler.hasError || !news || news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, autoRotateInterval, news?.length, isLoading, errorHandler.hasError]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? news.length - 1 : prevIndex - 1
    );
  }, [news?.length]);

  const goToNext = useCallback(() => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
  }, [news?.length]);

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
      <Card className={`${className} animate-pulse`}>
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
    <Card className={`${className} relative overflow-hidden`}>
      {/* Main content */}
      <div className="space-y-4">
        {/* Article image */}
        {currentArticle.imageUrl && (
          <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100 group">
            <img
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span className="badge badge-primary shadow-sm">
                {currentArticle.category}
              </span>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* Article content */}
        <div className="content-spacing">
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
          
          <h2 className="heading-2 text-balance hover:text-primary-700 transition-colors duration-200 cursor-pointer">
            {currentArticle.title}
          </h2>
          
          <p className="body-base text-gray-600">
            {currentArticle.summary}
          </p>
        </div>

        {/* Navigation controls */}
        {news.length > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Previous/Next buttons */}
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="p-2 hover-lift"
                aria-label="Artículo anterior"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                aria-label="Siguiente artículo"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                Siguiente
              </Button>
            </div>

            {/* Position indicators */}
            <div className="flex space-x-2">
              {news.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 hover-lift ${
                    index === currentIndex
                      ? 'bg-primary-600 scale-110'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir al artículo ${index + 1}`}
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
  );
};

export default NewsCarousel;