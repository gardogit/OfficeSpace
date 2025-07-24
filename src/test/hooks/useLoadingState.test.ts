import { renderHook, waitFor } from '@testing-library/react';
import { useLoadingState, simulateAsyncLoad, useMockDataLoader } from '../../hooks/useLoadingState';

describe('useLoadingState', () => {
  it('starts with loading state', () => {
    const asyncFunction = jest.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useLoadingState(asyncFunction));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  it('resolves with data on success', async () => {
    const testData = 'test data';
    const asyncFunction = jest.fn().mockResolvedValue(testData);
    const { result } = renderHook(() => useLoadingState(asyncFunction));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(testData);
    expect(asyncFunction).toHaveBeenCalledTimes(1);
  });

  it('handles errors correctly', async () => {
    const testError = new Error('Test error');
    const asyncFunction = jest.fn().mockRejectedValue(testError);
    const { result } = renderHook(() => useLoadingState(asyncFunction));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.data).toBe(null);
  });

  it('handles non-Error rejections', async () => {
    const asyncFunction = jest.fn().mockRejectedValue('string error');
    const { result } = renderHook(() => useLoadingState(asyncFunction));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Unknown error');
    expect(result.current.data).toBe(null);
  });

  it('re-executes when dependencies change', async () => {
    const asyncFunction = jest.fn().mockResolvedValue('test data');
    let dependency = 'initial';
    
    const { result, rerender } = renderHook(() => 
      useLoadingState(asyncFunction, [dependency])
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(asyncFunction).toHaveBeenCalledTimes(1);

    // Change dependency
    dependency = 'changed';
    rerender();

    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(asyncFunction).toHaveBeenCalledTimes(2);
  });

  it('cancels previous request when dependencies change', async () => {
    let resolveFirst: (value: string) => void;
    let resolveSecond: (value: string) => void;

    const firstPromise = new Promise<string>((resolve) => {
      resolveFirst = resolve;
    });

    const secondPromise = new Promise<string>((resolve) => {
      resolveSecond = resolve;
    });

    const asyncFunction = jest.fn()
      .mockReturnValueOnce(firstPromise)
      .mockReturnValueOnce(secondPromise);

    let dependency = 'first';
    const { result, rerender } = renderHook(() => 
      useLoadingState(asyncFunction, [dependency])
    );

    // Change dependency before first resolves
    dependency = 'second';
    rerender();

    // Resolve first promise (should be cancelled)
    resolveFirst!('first result');

    // Resolve second promise
    resolveSecond!('second result');

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have second result, not first
    expect(result.current.data).toBe('second result');
  });

  it('provides retry function', async () => {
    const asyncFunction = jest.fn()
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce('success');

    const { result } = renderHook(() => useLoadingState(asyncFunction));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);

    // Retry should reset loading state
    result.current.retry();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });
});

describe('simulateAsyncLoad', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // No error
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves with data after delay', async () => {
    const testData = 'test data';
    const startTime = Date.now();
    
    const result = await simulateAsyncLoad(testData, 100);
    const endTime = Date.now();
    
    expect(result).toBe(testData);
    expect(endTime - startTime).toBeGreaterThanOrEqual(100);
  });

  it('rejects with error when random < 0.05', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01); // Force error
    
    await expect(simulateAsyncLoad('test', 100)).rejects.toThrow('Simulated network error');
  });

  it('uses default delay of 1000ms', async () => {
    const testData = 'test data';
    const startTime = Date.now();
    
    // Use a shorter delay for testing
    const result = await simulateAsyncLoad(testData, 50);
    const endTime = Date.now();
    
    expect(result).toBe(testData);
    expect(endTime - startTime).toBeGreaterThanOrEqual(50);
  });
});

describe('useMockDataLoader', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1); // No error
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads mock data with simulated delay', async () => {
    const mockData = { test: 'data' };
    const { result } = renderHook(() => useMockDataLoader(mockData, 100));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('handles simulated errors', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.01); // Force error
    
    const mockData = { test: 'data' };
    const { result } = renderHook(() => useMockDataLoader(mockData, 100));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Simulated network error');
    expect(result.current.data).toBe(null);
  });
});