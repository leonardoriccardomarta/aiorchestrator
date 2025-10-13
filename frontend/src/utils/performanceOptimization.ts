import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useState } from 'react';

// Performance optimization configuration
const PERFORMANCE_CONFIG = {
  // Debounce settings
  debounce: {
    defaultDelay: 300,
    maxDelay: 1000,
    minDelay: 50
  },
  
  // Throttle settings
  throttle: {
    defaultDelay: 100,
    maxDelay: 500,
    minDelay: 16 // ~60fps
  },
  
  // Memoization settings
  memoization: {
    maxCacheSize: 1000,
    defaultTTL: 300000, // 5 minutes
    maxTTL: 3600000 // 1 hour
  },
  
  // Performance monitoring
  monitoring: {
    enabled: process.env.NODE_ENV === 'development',
    logSlowOperations: true,
    slowOperationThreshold: 16, // ms
    maxLogEntries: 100
  }
};

// Debounce utility
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = PERFORMANCE_CONFIG.debounce.defaultDelay
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay) as any;
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number = PERFORMANCE_CONFIG.throttle.defaultDelay
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Performance monitoring utility
export class PerformanceMonitor {
  private static logs: Array<{
    operation: string;
    duration: number;
    timestamp: number;
    metadata?: unknown;
  }> = [];

  /**
   * Measure operation performance
   */
  static measure<T>(
    operation: string,
    fn: () => T,
    metadata?: unknown
  ): T {
    const startTime = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      
      this.logOperation(operation, duration, metadata);
      
      if (PERFORMANCE_CONFIG.monitoring.logSlowOperations && 
          duration > PERFORMANCE_CONFIG.monitoring.slowOperationThreshold) {
        console.warn(`[Performance] Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.logOperation(operation, duration, { ...(metadata as Record<string, unknown>), error: true });
      throw error;
    }
  }

  /**
   * Measure async operation performance
   */
  static async measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: any
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      this.logOperation(operation, duration, metadata);
      
      if (PERFORMANCE_CONFIG.monitoring.logSlowOperations && 
          duration > PERFORMANCE_CONFIG.monitoring.slowOperationThreshold) {
        console.warn(`[Performance] Slow async operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.logOperation(operation, duration, { ...(metadata as Record<string, unknown>), error: true });
      throw error;
    }
  }

  /**
   * Log operation performance
   */
  private static logOperation(operation: string, duration: number, metadata?: any): void {
    if (!PERFORMANCE_CONFIG.monitoring.enabled) return;

    this.logs.push({
      operation,
      duration,
      timestamp: Date.now(),
      metadata
    });

    // Keep logs within size limit
    if (this.logs.length > PERFORMANCE_CONFIG.monitoring.maxLogEntries) {
      this.logs = this.logs.slice(-PERFORMANCE_CONFIG.monitoring.maxLogEntries);
    }
  }

  /**
   * Get performance statistics
   */
  static getStats(): {
    totalOperations: number;
    averageDuration: number;
    slowOperations: number;
    recentOperations: Array<{ operation: string; duration: number; timestamp: number }>;
  } {
    const totalOperations = this.logs.length;
    const averageDuration = totalOperations > 0 
      ? this.logs.reduce((sum, log) => sum + log.duration, 0) / totalOperations 
      : 0;
    
    const slowOperations = this.logs.filter(
      log => log.duration > PERFORMANCE_CONFIG.monitoring.slowOperationThreshold
    ).length;

    const recentOperations = this.logs
      .slice(-10)
      .map(log => ({
        operation: log.operation,
        duration: log.duration,
        timestamp: log.timestamp
      }));

    return {
      totalOperations,
      averageDuration,
      slowOperations,
      recentOperations
    };
  }

  /**
   * Clear performance logs
   */
  static clearLogs(): void {
    this.logs = [];
  }
}

// React performance optimization hooks

/**
 * Optimized useCallback with performance monitoring
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  operationName?: string
): T {
  const optimizedCallback = useCallback((...args: Parameters<T>) => {
    if (operationName) {
      return PerformanceMonitor.measure(operationName, () => callback(...args));
    }
    return callback(...args);
  }, [callback, operationName]);

  return optimizedCallback as T;
}

/**
 * Optimized useMemo with performance monitoring
 */
export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  operationName?: string
): T {
  const memoizedValue = useMemo(() => {
    if (operationName) {
      return PerformanceMonitor.measure(operationName, factory);
    }
    return factory();
  }, deps);
  return memoizedValue;
}

/**
 * Hook for debounced state updates
 */
export function useDebouncedState<T>(
  initialState: T,
  delay: number = PERFORMANCE_CONFIG.debounce.defaultDelay
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const timeoutRef = useRef<number>();

  const debouncedSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState(value);
    }, delay) as any;
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, debouncedSetState];
}

/**
 * Hook for throttled state updates
 */
export function useThrottledState<T>(
  initialState: T,
  delay: number = PERFORMANCE_CONFIG.throttle.defaultDelay
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const lastUpdateRef = useRef<number>(0);

  const throttledSetState = useCallback((value: T | ((prev: T) => T)) => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= delay) {
      lastUpdateRef.current = now;
      setState(value);
    }
  }, [delay]);

  return [state, throttledSetState];
}

/**
 * Hook for optimized list rendering
 */
export function useOptimizedList<T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string | number,
  renderItem: (item: T, index: number) => React.ReactNode,
  options: {
    batchSize?: number;
    delay?: number;
    enableVirtualization?: boolean;
  } = {}
) {
  const {
    batchSize = 50,
    delay = 16
  } = options;

  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const batchIndexRef = useRef(0);

  // Process items in batches
  useEffect(() => {
    if (items.length === 0) {
      setVisibleItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    batchIndexRef.current = 0;

    const processBatch = () => {
      const startIndex = batchIndexRef.current * batchSize;
      const endIndex = Math.min(startIndex + batchSize, items.length);
      const newBatch = items.slice(startIndex, endIndex);

      setVisibleItems(prev => [...prev, ...newBatch]);
      batchIndexRef.current++;

      if (endIndex < items.length) {
        setTimeout(processBatch, delay);
      } else {
        setIsLoading(false);
      }
    };

    setVisibleItems([]);
    processBatch();
  }, [items, batchSize, delay]);

  // Memoized render function
  const renderOptimizedItem = useOptimizedCallback(
    (item: T, index: number) => renderItem(item, index),
    'render-list-item'
  );

  return {
    items: visibleItems,
    isLoading,
    totalItems: items.length,
    renderedItems: visibleItems.length,
    renderItem: renderOptimizedItem,
    keyExtractor
  };
}

/**
 * Hook for optimized form handling
 */
export function useOptimizedForm<T extends Record<string, any>>(
  initialValues: T,
  options: {
    debounceDelay?: number;
    validateOnChange?: boolean;
    enablePerformanceMonitoring?: boolean;
  } = {}
) {
  const {
    debounceDelay = PERFORMANCE_CONFIG.debounce.defaultDelay,
    validateOnChange = true,
    enablePerformanceMonitoring = true
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation
  const debouncedValidate = useMemo(
    () => debounce(async (newValues: T) => {
      if (!validateOnChange) return;

      setIsValidating(true);
      
      try {
        // Simulate validation - replace with actual validation logic
        const newErrors: Partial<Record<keyof T, string>> = {};
        
        // Example validation
        Object.keys(newValues).forEach(key => {
          const value = newValues[key as keyof T];
          if (typeof value === 'string' && value.length === 0) {
            newErrors[key as keyof T] = 'This field is required';
          }
        });

        setErrors(newErrors);
      } finally {
        setIsValidating(false);
      }
    }, debounceDelay),
    [validateOnChange, debounceDelay]
  );

  // Optimized setValue function
  const setValue = useOptimizedCallback(
    (key: keyof T, value: T[keyof T]) => {
      const newValues = { ...values, [key]: value };
      setValues(newValues);
      
      if (enablePerformanceMonitoring) {
        PerformanceMonitor.measure('form-set-value', () => {
          debouncedValidate(newValues);
        });
      } else {
        debouncedValidate(newValues);
      }
    },
    'form-set-value'
  );

  // Optimized setValues function
  const setValuesOptimized = useOptimizedCallback(
    (newValues: Partial<T>) => {
      const updatedValues = { ...values, ...newValues };
      setValues(updatedValues);
      
      if (enablePerformanceMonitoring) {
        PerformanceMonitor.measure('form-set-values', () => {
          debouncedValidate(updatedValues);
        });
      } else {
        debouncedValidate(updatedValues);
      }
    },
    'form-set-values'
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isValidating,
    setValue,
    setValues: setValuesOptimized,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

/**
 * Hook for optimized API calls
 */
export function useOptimizedApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    enableCaching?: boolean;
    cacheTTL?: number;
    enableRetry?: boolean;
    maxRetries?: number;
    retryDelay?: number;
  } = {}
) {
  const {
    enableCaching = true,
    cacheTTL = PERFORMANCE_CONFIG.memoization.defaultTTL,
    enableRetry = true,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const executeCall = useOptimizedCallback(
    async (cacheKey?: string) => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        if (enableCaching && cacheKey) {
          const cached = cacheRef.current.get(cacheKey);
          if (cached && Date.now() - cached.timestamp < cacheTTL) {
            setData(cached.data);
            setLoading(false);
            return cached.data;
          }
        }

        // Execute API call with retry logic
        let lastError: Error;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const result = await PerformanceMonitor.measureAsync(
              'api-call',
              apiCall
            );

            setData(result);

            // Cache result
            if (enableCaching && cacheKey) {
              cacheRef.current.set(cacheKey, {
                data: result,
                timestamp: Date.now()
              });
            }

            return result;
          } catch (err) {
            lastError = err as Error;
            
            if (attempt < maxRetries && enableRetry) {
              await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
            }
          }
        }

        throw lastError!;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    'optimized-api-call'
  );

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    data,
    loading,
    error,
    executeCall,
    clearCache
  };
}

// Export configuration
export { PERFORMANCE_CONFIG };