import React, { useState, useEffect } from 'react';
import { ErrorMetrics } from '../../utils/errorRecovery';
import { Card } from '../ui/Card';

interface ErrorMonitorProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

/**
 * Development tool for monitoring error metrics and system health
 * Only shown in development mode
 */
export const ErrorMonitor: React.FC<ErrorMonitorProps> = ({
  isVisible = false,
  onToggle
}) => {
  const [errorStats, setErrorStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const updateStats = () => {
        const metrics = ErrorMetrics.getInstance();
        setErrorStats(metrics.getErrorStats());
      };

      updateStats();
      const interval = setInterval(updateStats, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // if (!isVisible || import.meta.env.MODE === 'production') {
  //   return null;
  // }

  const getHealthStatus = () => {
    if (!errorStats) return 'unknown';
    
    if (errorStats.totalErrors === 0) return 'healthy';
    if (errorStats.recoveryRate >= 80) return 'warning';
    return 'critical';
  };

  const healthStatus = getHealthStatus();
  const statusColors = {
    healthy: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
    unknown: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`mb-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          statusColors[healthStatus]
        } hover:opacity-80`}
        title="Error Monitor"
      >
        🔍 Errors: {errorStats?.totalErrors || 0}
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="w-80 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Error Monitor</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {errorStats && (
              <>
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">
                      {errorStats.totalErrors}
                    </div>
                    <div className="text-sm text-gray-600">Total Errors</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {errorStats.recoveryRate}%
                    </div>
                    <div className="text-sm text-gray-600">Recovery Rate</div>
                  </div>
                </div>

                {/* Component Breakdown */}
                {Object.keys(errorStats.componentStats).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Errors by Component
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(errorStats.componentStats).map(([component, count]) => (
                        <div key={component} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{component}</span>
                          <span className="text-sm font-medium text-red-600">{String(count)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      ErrorMetrics.getInstance().clearMetrics();
                      setErrorStats(ErrorMetrics.getInstance().getErrorStats());
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Clear Metrics
                  </button>
                  <button
                    onClick={() => {
                      const stats = ErrorMetrics.getInstance().getErrorStats();
                      console.log('Error Statistics:', stats);
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Log Stats
                  </button>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Time window: {errorStats.timeWindow}
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Expand Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="block w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Show Details
        </button>
      )}
    </div>
  );
};

/**
 * Hook to control error monitor visibility
 */
export const useErrorMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Toggle with Ctrl+Shift+E
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return {
    isVisible,
    toggle: () => setIsVisible(prev => !prev),
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false)
  };
};