import {
  retryWithBackoff,
  safeAsync,
  createErrorRecovery,
  isNetworkError,
  isDataError,
  getUserFriendlyErrorMessage,
  getRecoveryStrategy,
  ErrorMetrics
} from '../../utils/errorRecovery';

// Mock console methods
const originalError = console.error;
const originalWarn = console.warn;
beforeAll(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns result on first success', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');

    const result = await retryWithBackoff(mockFn);

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and eventually succeeds', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValue('success');

    const promise = retryWithBackoff(mockFn, { maxRetries: 3, retryDelay: 10 });

    // Fast-forward through the delay
    vi.advanceTimersByTime(20);

    const result = await promise;

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(2);
  }, 10000);

  it('throws last error after max retries', async () => {
    const error = new Error('Persistent failure');
    const mockFn = vi.fn().mockRejectedValue(error);

    const promise = retryWithBackoff(mockFn, { maxRetries: 2, retryDelay: 10 });

    // Fast-forward through all retries
    vi.advanceTimersByTime(50); // 10 + 20 (exponential backoff)

    await expect(promise).rejects.toThrow('Persistent failure');
    expect(mockFn).toHaveBeenCalledTimes(2);
  }, 10000);

  it('calls onError callback for each failure', async () => {
    const error = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(error);
    const onError = vi.fn();

    const promise = retryWithBackoff(mockFn, { 
      maxRetries: 2, 
      retryDelay: 10,
      onError 
    });

    vi.advanceTimersByTime(50);

    await expect(promise).rejects.toThrow();
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledWith(error, 1);
    expect(onError).toHaveBeenCalledWith(error, 2);
  }, 10000);

  it('calls onRecovery callback when recovering after failure', async () => {
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Failure'))
      .mockResolvedValue('success');
    const onRecovery = vi.fn();

    const promise = retryWithBackoff(mockFn, { 
      maxRetries: 3, 
      retryDelay: 10,
      onRecovery 
    });

    vi.advanceTimersByTime(20);

    await promise;

    expect(onRecovery).toHaveBeenCalledWith(2);
  }, 10000);

  it('uses exponential backoff for delays', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Failure'));
    const onError = vi.fn();

    const promise = retryWithBackoff(mockFn, { 
      maxRetries: 3, 
      retryDelay: 10,
      onError 
    });

    // Fast-forward through all delays
    vi.advanceTimersByTime(100); // 10 + 20 + 40

    await expect(promise).rejects.toThrow();
    expect(onError).toHaveBeenCalledTimes(3);
  }, 10000);
});

describe('safeAsync', () => {
  it('returns result on success', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const fallback = 'fallback';

    const result = await safeAsync(mockFn, fallback);

    expect(result).toBe('success');
  });

  it('returns fallback on failure', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Failure'));
    const fallback = 'fallback';

    const result = await safeAsync(mockFn, fallback);

    expect(result).toBe('fallback');
    expect(console.warn).toHaveBeenCalledWith(
      'Safe async operation failed, using fallback:',
      expect.any(Error)
    );
  });
});

describe('createErrorRecovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows recovery for initial errors', () => {
    const recovery = createErrorRecovery('TestComponent');
    const error = new Error('Test error');

    const shouldRecover = recovery.shouldRecover(error);

    expect(shouldRecover).toBe(true);
  });

  it('prevents recovery after too many errors', () => {
    const recovery = createErrorRecovery('TestComponent');
    const error = new Error('Test error');

    // Trigger multiple errors
    for (let i = 0; i < 6; i++) {
      recovery.shouldRecover(error);
    }

    const shouldRecover = recovery.shouldRecover(error);

    expect(shouldRecover).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'TestComponent: Too many errors, disabling recovery'
    );
  });

  it('resets error count after time window', () => {
    const recovery = createErrorRecovery('TestComponent');
    const error = new Error('Test error');

    // Mock Date.now to control time
    const originalNow = Date.now;
    let currentTime = 1000;
    Date.now = vi.fn(() => currentTime);

    // Trigger multiple errors
    for (let i = 0; i < 5; i++) {
      recovery.shouldRecover(error);
    }

    // Advance time beyond error window (60 seconds)
    currentTime += 61000;

    const shouldRecover = recovery.shouldRecover(error);

    expect(shouldRecover).toBe(true);

    Date.now = originalNow;
  });

  it('logs errors with context', () => {
    const recovery = createErrorRecovery('TestComponent');
    const error = new Error('Test error');
    const context = { userId: '123', action: 'load' };

    recovery.logError(error, context);

    expect(console.error).toHaveBeenCalledWith(
      'TestComponent error:',
      expect.objectContaining({
        error: 'Test error',
        context,
        errorCount: expect.any(Number),
        timestamp: expect.any(String)
      })
    );
  });

  it('provides error summary', () => {
    const recovery = createErrorRecovery('TestComponent');
    const error = new Error('Test error');

    recovery.shouldRecover(error);

    const summary = recovery.getErrorSummary();

    expect(summary).toEqual({
      componentName: 'TestComponent',
      errorCount: 1,
      lastErrorTime: expect.any(String)
    });
  });
});

describe('Error type detection', () => {
  describe('isNetworkError', () => {
    it('detects network errors', () => {
      expect(isNetworkError(new Error('fetch failed'))).toBe(true);
      expect(isNetworkError(new Error('network timeout'))).toBe(true);
      expect(isNetworkError(new Error('connection timeout'))).toBe(true);
      
      const networkError = new Error('Connection failed');
      networkError.name = 'NetworkError';
      expect(isNetworkError(networkError)).toBe(true);
    });

    it('does not detect non-network errors', () => {
      expect(isNetworkError(new Error('validation failed'))).toBe(false);
      expect(isNetworkError(new Error('parse error'))).toBe(false);
    });
  });

  describe('isDataError', () => {
    it('detects data errors', () => {
      expect(isDataError(new Error('validation failed'))).toBe(true);
      expect(isDataError(new Error('JSON parse error'))).toBe(true);
      
      const validationError = new Error('Invalid data');
      validationError.name = 'ValidationError';
      expect(isDataError(validationError)).toBe(true);
    });

    it('does not detect non-data errors', () => {
      expect(isDataError(new Error('network failed'))).toBe(false);
      expect(isDataError(new Error('timeout'))).toBe(false);
    });
  });
});

describe('getUserFriendlyErrorMessage', () => {
  it('returns network error message for network errors', () => {
    const error = new Error('fetch failed');
    const message = getUserFriendlyErrorMessage(error);
    
    expect(message).toContain('Problema de conexión');
  });

  it('returns data error message for data errors', () => {
    const error = new Error('validation failed');
    const message = getUserFriendlyErrorMessage(error);
    
    expect(message).toContain('Los datos no se pudieron cargar');
  });

  it('returns timeout message for timeout errors', () => {
    const error = new Error('timeout occurred');
    const message = getUserFriendlyErrorMessage(error);
    
    expect(message).toContain('La operación tardó demasiado tiempo');
  });

  it('returns permission message for permission errors', () => {
    const error = new Error('unauthorized access');
    const message = getUserFriendlyErrorMessage(error);
    
    expect(message).toContain('No tienes permisos');
  });

  it('returns generic message for unknown errors', () => {
    const error = new Error('unknown error');
    const message = getUserFriendlyErrorMessage(error);
    
    expect(message).toContain('Ha ocurrido un error inesperado');
  });
});

describe('getRecoveryStrategy', () => {
  it('returns retry strategy for network errors', () => {
    const error = new Error('network failed');
    const strategy = getRecoveryStrategy(error, 'TestComponent');
    
    expect(strategy).toEqual({
      canRecover: true,
      strategy: 'retry',
      message: 'Reintentando conexión...'
    });
  });

  it('returns fallback strategy for data errors', () => {
    const error = new Error('validation failed');
    const strategy = getRecoveryStrategy(error, 'TestComponent');
    
    expect(strategy).toEqual({
      canRecover: true,
      strategy: 'fallback',
      message: 'Usando datos de respaldo...'
    });
  });

  it('returns reload strategy for critical components', () => {
    const error = new Error('generic error');
    const strategy = getRecoveryStrategy(error, 'Header');
    
    expect(strategy).toEqual({
      canRecover: true,
      strategy: 'reload',
      message: 'Recargando aplicación...'
    });
  });

  it('returns fallback strategy for non-critical components', () => {
    const error = new Error('generic error');
    const strategy = getRecoveryStrategy(error, 'NewsCarousel');
    
    expect(strategy).toEqual({
      canRecover: true,
      strategy: 'fallback',
      message: 'Mostrando contenido alternativo...'
    });
  });
});

describe('ErrorMetrics', () => {
  let metrics: ErrorMetrics;

  beforeEach(() => {
    metrics = ErrorMetrics.getInstance();
    metrics.clearMetrics();
  });

  it('records errors', () => {
    const error = new Error('Test error');
    
    metrics.recordError('TestComponent', error, false);
    
    const stats = metrics.getErrorStats();
    expect(stats.totalErrors).toBe(1);
    expect(stats.recoveredErrors).toBe(0);
    expect(stats.recoveryRate).toBe(0);
  });

  it('tracks recovery rate', () => {
    const error = new Error('Test error');
    
    metrics.recordError('TestComponent', error, false);
    metrics.recordError('TestComponent', error, true);
    
    const stats = metrics.getErrorStats();
    expect(stats.totalErrors).toBe(2);
    expect(stats.recoveredErrors).toBe(1);
    expect(stats.recoveryRate).toBe(50);
  });

  it('tracks component-specific errors', () => {
    const error = new Error('Test error');
    
    metrics.recordError('Component1', error, false);
    metrics.recordError('Component1', error, false);
    metrics.recordError('Component2', error, false);
    
    const stats = metrics.getErrorStats();
    expect(stats.componentStats).toEqual({
      Component1: 2,
      Component2: 1
    });
  });

  it('only considers recent errors in stats', () => {
    const error = new Error('Test error');
    
    // Mock Date.now to control time
    const originalNow = Date.now;
    let currentTime = 1000;
    Date.now = vi.fn(() => currentTime);
    
    // Record old error
    metrics.recordError('TestComponent', error, false);
    
    // Advance time beyond 1 hour
    currentTime += 3700000; // 1 hour + 100 seconds
    
    // Record new error
    metrics.recordError('TestComponent', error, false);
    
    const stats = metrics.getErrorStats();
    expect(stats.totalErrors).toBe(1); // Only recent error
    
    Date.now = originalNow;
  });

  it('limits stored errors to 100', () => {
    const error = new Error('Test error');
    
    // Record 150 errors
    for (let i = 0; i < 150; i++) {
      metrics.recordError('TestComponent', error, false);
    }
    
    // Should only keep last 100
    const stats = metrics.getErrorStats();
    expect(stats.totalErrors).toBe(100);
  });

  it('provides singleton instance', () => {
    const instance1 = ErrorMetrics.getInstance();
    const instance2 = ErrorMetrics.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  it('clears metrics', () => {
    const error = new Error('Test error');
    
    metrics.recordError('TestComponent', error, false);
    expect(metrics.getErrorStats().totalErrors).toBe(1);
    
    metrics.clearMetrics();
    expect(metrics.getErrorStats().totalErrors).toBe(0);
  });
});