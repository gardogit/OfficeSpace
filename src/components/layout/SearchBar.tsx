import React, { useState, useId } from 'react';
import { useAnnouncements } from '../../hooks/useAccessibility';

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar - Componente de barra de búsqueda funcional
 * 
 * Funcionalidades:
 * - Input de búsqueda con icono
 * - Manejo de eventos de búsqueda
 * - Diseño responsive
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar en el portal..."
}) => {
  const [query, setQuery] = useState('');
  const searchId = useId();
  const { announce } = useAnnouncements();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
      announce(`Buscando: ${query.trim()}`, 'polite');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" role="search" aria-label="Búsqueda en el portal">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus-ring sm:text-sm"
          placeholder={placeholder}
          aria-label="Campo de búsqueda"
          aria-describedby={`${searchId}-help`}
          autoComplete="off"
        />

        {/* Hidden help text for screen readers */}
        <div id={`${searchId}-help`} className="sr-only">
          Escribe tu consulta y presiona Enter para buscar, o usa el botón de limpiar para borrar el texto
        </div>

        {/* Clear Button */}
        {query && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={() => {
                setQuery('');
                announce('Campo de búsqueda limpiado', 'polite');
              }}
              className="text-gray-400 hover:text-gray-600 focus-ring rounded p-1"
              aria-label="Limpiar búsqueda"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;