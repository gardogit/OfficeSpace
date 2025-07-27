/**
 * Error recovery utilities for handling component failures gracefully
 */

export interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackData?: any;
  onError?: (error: Error, attempt: number) => void;
  onRecovery?: (attempt: number) => void;
}

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: ErrorRecoveryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRecovery
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      if (attempt > 1 && onRecovery) {
        onRecovery(attempt);
      }
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (onError) {
        onError(lastError, attempt);
      }

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      const delay = retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

/**
 * Safe async operation wrapper
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  options: ErrorRecoveryOptions = {}
): Promise<T> => {
  try {
    return await retryWithBackoff(fn, options);
  } catch (error) {
    console.warn('Safe async operation failed, using fallback:', error);
    return fallback;
  }
};

/**
 * Component error recovery hook
 */
export const createErrorRecovery = (componentName: string) => {
  let errorCount = 0;
  let lastErrorTime = 0;
  const ERROR_THRESHOLD = 5;
  const ERROR_WINDOW = 60000; // 1 minute

  return {
    shouldRecover: (_error: Error): boolean => {
      const now = Date.now();
      
      // Reset counter if enough time has passed
      if (now - lastErrorTime > ERROR_WINDOW) {
        errorCount = 0;
      }

      errorCount++;
      lastErrorTime = now;

      // Don't recover if too many errors in short time
      if (errorCount > ERROR_THRESHOLD) {
        console.error(`${componentName}: Too many errors, disabling recovery`);
        return false;
      }

      return true;
    },

    logError: (error: Error, context?: any) => {
      console.error(`${componentName} error:`, {
        error: error.message,
        stack: error.stack,
        context,
        errorCount,
        timestamp: new Date().toISOString()
      });
    },

    getErrorSummary: () => ({
      componentName,
      errorCount,
      lastErrorTime: new Date(lastErrorTime).toISOString()
    })
  };
};

/**
 * Network error recovery
 */
export const isNetworkError = (error: Error): boolean => {
  return error.message.includes('fetch') ||
         error.message.includes('network') ||
         error.message.includes('timeout') ||
         error.name === 'NetworkError';
};

/**
 * Data corruption error recovery
 */
export const isDataError = (error: Error): boolean => {
  return error.message.includes('validation') ||
         error.message.includes('parse') ||
         error.message.includes('JSON') ||
         error.name === 'ValidationError';
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: Error): string => {
  if (isNetworkError(error)) {
    return 'Problema de conexión. Verifica tu conexión a internet e intenta nuevamente.';
  }

  if (isDataError(error)) {
    return 'Los datos no se pudieron cargar correctamente. Intenta recargar la página.';
  }

  if (error.message.includes('timeout')) {
    return 'La operación tardó demasiado tiempo. Intenta nuevamente.';
  }

  if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    return 'No tienes permisos para acceder a esta información.';
  }

  return 'Ha ocurrido un error inesperado. Si el problema persiste, contacta al soporte técnico.';
};

/**
 * Error boundary recovery strategies
 */
export const getRecoveryStrategy = (error: Error, componentName: string): {
  canRecover: boolean;
  strategy: 'reload' | 'retry' | 'fallback' | 'redirect';
  message: string;
} => {
  if (isNetworkError(error)) {
    return {
      canRecover: true,
      strategy: 'retry',
      message: 'Reintentando conexión...'
    };
  }

  if (isDataError(error)) {
    return {
      canRecover: true,
      strategy: 'fallback',
      message: 'Usando datos de respaldo...'
    };
  }

  if (componentName === 'Header' || componentName === 'MainLayout') {
    return {
      canRecover: true,
      strategy: 'reload',
      message: 'Recargando aplicación...'
    };
  }

  return {
    canRecover: true,
    strategy: 'fallback',
    message: 'Mostrando contenido alternativo...'
  };
};

/**
 * Performance monitoring for error recovery
 */
export class ErrorMetrics {
  private static instance: ErrorMetrics;
  private errors: Array<{
    component: string;
    error: string;
    timestamp: number;
    recovered: boolean;
  }> = [];

  static getInstance(): ErrorMetrics {
    if (!ErrorMetrics.instance) {
      ErrorMetrics.instance = new ErrorMetrics();
    }
    return ErrorMetrics.instance;
  }

  recordError(component: string, error: Error, recovered: boolean = false) {
    this.errors.push({
      component,
      error: error.message,
      timestamp: Date.now(),
      recovered
    });

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
  }

  getErrorStats() {
    const now = Date.now();
    const lastHour = now - 3600000; // 1 hour ago

    const recentErrors = this.errors.filter(e => e.timestamp > lastHour);
    const totalErrors = recentErrors.length;
    const recoveredErrors = recentErrors.filter(e => e.recovered).length;
    const recoveryRate = totalErrors > 0 ? (recoveredErrors / totalErrors) * 100 : 100;

    const componentStats = recentErrors.reduce((acc, error) => {
      acc[error.component] = (acc[error.component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalErrors,
      recoveredErrors,
      recoveryRate: Math.round(recoveryRate),
      componentStats,
      timeWindow: '1 hour'
    };
  }

  clearMetrics() {
    this.errors = [];
  }
}