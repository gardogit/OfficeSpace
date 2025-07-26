import React, { useState, memo } from 'react';
import { NewsArticle } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface NewsGridProps {
  news: NewsArticle[];
  className?: string;
}

type ViewMode = 'rows' | 'grid';

interface NewsCardProps {
  article: NewsArticle;
  viewMode: ViewMode;
  onClick?: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = memo(({ article, viewMode, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(article);
    }
  };

  if (viewMode === 'rows') {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 cursor-pointer group"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`Leer artículo: ${article.title}`}
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          {article.imageUrl && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={article.imageUrl}
                alt={`Imagen del artículo: ${article.title}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                  {article.title}
                </h3>
              </div>
              <span className="badge badge-primary flex-shrink-0">
                {article.category}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(article.publishDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 cursor-pointer group overflow-hidden"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Leer artículo: ${article.title}`}
    >
      {/* Image */}
      {article.imageUrl && (
        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={`Imagen del artículo: ${article.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary shadow-sm">
              {article.category}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 mb-2 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {article.author}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(article.publishDate)}
          </span>
        </div>
      </div>
    </div>
  );
});

NewsCard.displayName = 'NewsCard';

const NewsGridComponent: React.FC<NewsGridProps> = ({
  news,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleArticleClick = (article: NewsArticle) => {
    // En una implementación real, esto navegaría al artículo completo
    console.log('Artículo clickeado:', article.title);
  };

  // Empty state
  if (!news || news.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <div className="text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium mb-2">No hay noticias disponibles</h3>
            <p className="text-sm">Vuelve más tarde para ver las últimas actualizaciones</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Todas las Noticias
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({news.length} {news.length === 1 ? 'artículo' : 'artículos'})
          </span>
        </div>
        
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('rows')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              viewMode === 'rows'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            aria-label="Vista en filas"
            aria-pressed={viewMode === 'rows'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Filas
          </button>
          
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            aria-label="Vista en cuadrícula"
            aria-pressed={viewMode === 'grid'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Cuadrícula
          </button>
        </div>
      </div>

      {/* News Content */}
      <div 
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
        role="feed"
        aria-label="Lista de noticias"
      >
        {news.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            viewMode={viewMode}
            onClick={handleArticleClick}
          />
        ))}
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const NewsGrid = memo(NewsGridComponent, (prevProps, nextProps) => {
  return (
    prevProps.news === nextProps.news &&
    prevProps.className === nextProps.className
  );
});

NewsGrid.displayName = 'NewsGrid';

export default NewsGrid;