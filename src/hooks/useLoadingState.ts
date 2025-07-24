import { useState, useEffect } from 'react';

export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  data: any;
}

export const useLoadingState = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    error: Error | null;
    data: T | null;
  }>({
    isLoading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const executeAsync = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await asyncFunction();
        
        if (!isCancelled) {
          setState({
            isLoading: false,
            error: null,
            data: result,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            isLoading: false,
            error: error instanceof Error ? error : new Error('Unknown error'),
            data: null,
          });
        }
      }
    };

    executeAsync();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  const retry = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
  };

  return {
    ...state,
    retry,
  };
};

// Simulate async data loading for mock data
export const simulateAsyncLoad = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional errors (5% chance)
      if (Math.random() < 0.05) {
        reject(new Error('Simulated network error'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Hook specifically for mock data loading
export const useMockDataLoader = <T>(data: T, delay: number = 1000) => {
  return useLoadingState(() => simulateAsyncLoad(data, delay), []);
};