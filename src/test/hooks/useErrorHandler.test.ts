import { renderHook, act } from '@testing-library/react';
import { useErrorHandler, useAsyncErrorHandler, useNetworkErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorMetrics } from '../../utils/errorRecovery';

// Mock console methods
const originalError = console.error;
const originalLog = console.log;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = vi.fn();
  console.log = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.error = originalError;
  console.log = originalLog;
  console.warn = originalWarn;
});

// Mock ErrorMetrics
vi.mock('../../utils/errorRecovery', () => ({
  ErrorMetrics: {
    getInstance: vi.fn(() => ({
      recordError: vi.fn()
    }))
  }
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with no error', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ componentName: 'TestComponent' })
    );

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
    expect(result.current.isRetrying).toBe(false);
    expect(result.current.retryCount).toBe(0);
    expect(result.current.canRetry).toBe(true);
  });

  it('handles error correctly', () => {
    const onError = vi.fn();
    const { result } = renderHook(() => 
      useErrorHandler({ 
        componentName: 'TestComponent',
        onError 
      })
    );

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.hasError).toBe(true);
    expect(result.current.retryCount).toBe(1);
    expect(result.current.canRetry).toBe(true);
    expect(onError).toHaveBeenCalledWith(testError, 1);
  });

  it('prevents retry when max retries reached', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ 
        componentName: 'TestComponent',
        maxRetries: 2
      })
    );

    const testError = new Error('Test error');

    // First error
    act(() => {
      result.current.handleError(testError);
    });
    expect(result.current.canRetry).toBe(true);

    // Second error
    act(() => {
      result.current.handleError(testError);
    });
    expect(result.current.canRetry).toBe(false);
  });

  it('clears error state', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ componentName: 'TestComponent' })
    );

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
    expect(result.current.retryCount).toBe(0);
  });

  it('resets error state', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ componentName: 'TestComponent' })
    );

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.hasError).toBe(false);
  });

  it('records error in metrics', () => {
    const mockErrorMetrics = {
      recordError: vi.fn()
    };
    (ErrorMetrics.getInstance as any).mockReturnValue(mockErrorMetrics);

    const { result } = renderHook(() => 
      useErrorHandler({ componentName: 'TestComponent' })
    );

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(mockErrorMetrics.recordError).toHaveBeenCalledWith(
      'TestComponent',
      testError,
      false
    );
  });
});

describe('useAsyncErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('executes async function successfully', async () => {
    const asyncFn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => 
      useAsyncErrorHandler(asyncFn, { componentName: 'TestComponent' })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBe('success');
    expect(result.current.hasError).toBe(false);
    expect(asyncFn).toHaveBeenCalled();
  });

  it('handles async function error', async () => {
    const testError = new Error('Async error');
    const asyncFn = vi.fn().mockRejectedValue(testError);
    const { result } = renderHook(() => 
      useAsyncErrorHandler(asyncFn, { componentName: 'TestComponent' })
    );

    await act(async () => {
      try {
        await result.current.execute();
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.hasError).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('manages loading state correctly', async () => {
    let resolvePromise: (value: string) => void;
    const asyncFn = vi.fn(() => new Promise<string>(resolve => {
      resolvePromise = resolve;
    }));

    const { result } = renderHook(() => 
      useAsyncErrorHandler(asyncFn, { componentName: 'TestComponent' })
    );

    // Start execution
    act(() => {
      result.current.execute();
    });

    expect(result.current.isLoading).toBe(true);

    // Resolve promise
    await act(async () => {
      resolvePromise!('success');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('success');
  });
});

describe('useNetworkErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('identifies network errors correctly', () => {
    const { result } = renderHook(() => 
      useNetworkErrorHandler('TestComponent')
    );

    expect(result.current.isNetworkError(new Error('fetch failed'))).toBe(true);
    expect(result.current.isNetworkError(new Error('network timeout'))).toBe(true);
    expect(result.current.isNetworkError(new Error('Failed to fetch'))).toBe(true);
    
    const networkError = new Error('Connection failed');
    networkError.name = 'NetworkError';
    expect(result.current.isNetworkError(networkError)).toBe(true);

    expect(result.current.isNetworkError(new Error('validation error'))).toBe(false);
  });

  it('handles network errors with warning', () => {
    const { result } = renderHook(() => 
      useNetworkErrorHandler('TestComponent')
    );

    const networkError = new Error('fetch failed');

    act(() => {
      result.current.handleError(networkError);
    });

    expect(console.warn).toHaveBeenCalledWith(
      'Network error in TestComponent:',
      'fetch failed'
    );
    expect(result.current.error).toBe(networkError);
  });

  it('handles non-network errors normally', () => {
    const { result } = renderHook(() => 
      useNetworkErrorHandler('TestComponent')
    );

    const regularError = new Error('validation error');

    act(() => {
      result.current.handleError(regularError);
    });

    expect(console.warn).not.toHaveBeenCalled();
    expect(result.current.error).toBe(regularError);
  });
});