import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

interface UsePerformanceOptions {
  componentName: string;
  enableLogging?: boolean;
  threshold?: number; // ms - warn if render time exceeds this
}

export const usePerformance = ({ 
  componentName, 
  enableLogging = false, // Default to false for production builds
  threshold = 16 // 16ms = 60fps
}: UsePerformanceOptions) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const totalRenderTime = useRef<number>(0);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  // End performance measurement and log results
  const endMeasurement = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now()
    };

    if (enableLogging) {
      if (renderTime > threshold) {
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      } else {
        console.log(
          `⚡ ${componentName} rendered in ${renderTime.toFixed(2)}ms`
        );
      }
    }

    // Store metrics for potential analytics
    if (typeof window !== 'undefined' && (window as any).__PERFORMANCE_METRICS__) {
      (window as any).__PERFORMANCE_METRICS__.push(metrics);
    }

    return metrics;
  }, [componentName, enableLogging, threshold]);

  // Get average render time
  const getAverageRenderTime = useCallback(() => {
    return renderCount.current > 0 
      ? totalRenderTime.current / renderCount.current 
      : 0;
  }, []);

  // Get render statistics
  const getStats = useCallback(() => {
    return {
      componentName,
      renderCount: renderCount.current,
      totalRenderTime: totalRenderTime.current,
      averageRenderTime: getAverageRenderTime()
    };
  }, [componentName, getAverageRenderTime]);

  // Initialize performance metrics storage
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).__PERFORMANCE_METRICS__) {
      (window as any).__PERFORMANCE_METRICS__ = [];
    }
  }, []);

  return {
    startMeasurement,
    endMeasurement,
    getAverageRenderTime,
    getStats
  };
};

// Hook for measuring component lifecycle performance
export const useComponentPerformance = (componentName: string) => {
  const { startMeasurement, endMeasurement, getStats } = usePerformance({ 
    componentName 
  });

  useEffect(() => {
    startMeasurement();
    return () => {
      endMeasurement();
    };
  });

  return { getStats };
};

// Utility function to get all performance metrics
export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  if (typeof window !== 'undefined' && (window as any).__PERFORMANCE_METRICS__) {
    return (window as any).__PERFORMANCE_METRICS__;
  }
  return [];
};

// Utility function to clear performance metrics
export const clearPerformanceMetrics = (): void => {
  if (typeof window !== 'undefined') {
    (window as any).__PERFORMANCE_METRICS__ = [];
  }
};

// Performance monitoring HOC
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  options: { componentName?: string; enableLogging?: boolean } = {}
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props: P) => {
    const { getStats } = useComponentPerformance(
      options.componentName || Component.displayName || Component.name || 'Unknown'
    );

    useEffect(() => {
      // Log stats periodically in development
      if (options.enableLogging) {
        const interval = setInterval(() => {
          const stats = getStats();
          if (stats.renderCount > 0) {
            console.log(`📊 Performance stats for ${stats.componentName}:`, stats);
          }
        }, 10000); // Log every 10 seconds

        return () => clearInterval(interval);
      }
    }, [getStats, options.enableLogging]);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${
    options.componentName || Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};