import React from 'react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  componentName?: string;
  showDetails?: boolean;
}

/**
 * Generic error fallback component for use in error boundaries
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  componentName = 'Componente',
  showDetails = false
}) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-red-900 mb-2">
          Error en {componentName}
        </h3>
        
        <p className="text-sm text-red-700 mb-4">
          Ha ocurrido un error inesperado. Esta sección no está funcionando correctamente.
        </p>

        {showDetails && error && (
          <details className="mb-4 text-left">
            <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
              Ver detalles técnicos
            </summary>
            <div className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 font-mono">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {resetError && (
            <button
              onClick={resetError}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Reintentar
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact error fallback for smaller components
 */
export const CompactErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  componentName = 'Sección'
}) => {
  return (
    <div className="min-h-[100px] flex items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h4 className="text-sm font-medium text-yellow-900 mb-1">
          Error en {componentName}
        </h4>
        
        <p className="text-xs text-yellow-700 mb-3">
          Esta sección no está disponible temporalmente
        </p>

        {resetError && (
          <button
            onClick={resetError}
            className="text-xs px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Network error specific fallback
 */
export const NetworkErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  componentName = 'Datos'
}) => {
  return (
    <div className="min-h-[150px] flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <svg
            className="w-8 h-8 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </div>
        
        <h4 className="text-sm font-medium text-blue-900 mb-1">
          Problema de conexión
        </h4>
        
        <p className="text-xs text-blue-700 mb-3">
          No se pudieron cargar los {componentName.toLowerCase()}. Verifica tu conexión a internet.
        </p>

        {resetError && (
          <button
            onClick={resetError}
            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Reintentar conexión
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Empty state fallback (when no data is available)
 */
export const EmptyStateFallback: React.FC<{
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}> = ({
  title = 'No hay datos disponibles',
  description = 'No se encontró información para mostrar en esta sección.',
  icon,
  action
}) => {
  const defaultIcon = (
    <svg
      className="w-12 h-12 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div className="min-h-[200px] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {icon || defaultIcon}
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 max-w-sm">
          {description}
        </p>

        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};