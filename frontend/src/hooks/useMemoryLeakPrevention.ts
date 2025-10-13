import { useEffect, useRef, useCallback } from 'react';

interface CleanupFunction {
  (): void;
}

interface MemoryLeakPreventionOptions {
  enableLogging?: boolean;
  maxCleanupTime?: number;
  enablePerformanceMonitoring?: boolean;
}

/**
 * Custom hook for memory leak prevention and cleanup management
 */
export const useMemoryLeakPrevention = (options: MemoryLeakPreventionOptions = {}) => {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    maxCleanupTime = 5000,
    enablePerformanceMonitoring = process.env.NODE_ENV === 'development'
  } = options;

  const cleanupFunctions = useRef<Set<CleanupFunction>>(new Set());
  const performanceMetrics = useRef<{
    cleanupCount: number;
    totalCleanupTime: number;
    memoryUsage: number[];
  }>({
    cleanupCount: 0,
    totalCleanupTime: 0,
    memoryUsage: []
  });

  // Register cleanup function
  const registerCleanup = useCallback((cleanupFn: CleanupFunction) => {
    cleanupFunctions.current.add(cleanupFn);
    
    if (enableLogging) {
      console.log(`[MemoryLeakPrevention] Registered cleanup function. Total: ${cleanupFunctions.current.size}`);
    }
  }, [enableLogging]);

  // Execute all cleanup functions
  const executeCleanup = useCallback(async () => {
    const startTime = performance.now();
    const functions = Array.from(cleanupFunctions.current);
    
    if (functions.length === 0) return;

    try {
      // Execute cleanup functions in parallel with timeout
      const cleanupPromises = functions.map(async (cleanupFn) => {
        try {
          await Promise.race([
            Promise.resolve(cleanupFn()),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Cleanup timeout')), maxCleanupTime)
            )
          ]);
        } catch (error) {
          if (enableLogging) {
            console.warn('[MemoryLeakPrevention] Cleanup function failed:', error);
          }
        }
      });

      await Promise.all(cleanupPromises);
      
      const endTime = performance.now();
      const cleanupTime = endTime - startTime;
      
      // Update performance metrics
      performanceMetrics.current.cleanupCount += functions.length;
      performanceMetrics.current.totalCleanupTime += cleanupTime;
      
      if (enablePerformanceMonitoring) {
        performanceMetrics.current.memoryUsage.push(
          (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0
        );
      }

      if (enableLogging) {
        console.log(`[MemoryLeakPrevention] Cleanup completed in ${cleanupTime.toFixed(2)}ms`);
      }

      // Clear cleanup functions
      cleanupFunctions.current.clear();
      
    } catch (error) {
      if (enableLogging) {
        console.error('[MemoryLeakPrevention] Cleanup execution failed:', error);
      }
    }
  }, [maxCleanupTime, enableLogging, enablePerformanceMonitoring]);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    const metrics = performanceMetrics.current;
    const avgMemoryUsage = metrics.memoryUsage.length > 0 
      ? metrics.memoryUsage.reduce((a, b) => a + b, 0) / metrics.memoryUsage.length 
      : 0;

    return {
      cleanupCount: metrics.cleanupCount,
      totalCleanupTime: metrics.totalCleanupTime,
      averageCleanupTime: metrics.cleanupCount > 0 
        ? metrics.totalCleanupTime / metrics.cleanupCount 
        : 0,
      averageMemoryUsage: avgMemoryUsage,
      memoryUsageHistory: metrics.memoryUsage
    };
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      executeCleanup();
    };
  }, [executeCleanup]);

  return {
    registerCleanup,
    executeCleanup,
    getPerformanceMetrics,
    cleanupCount: cleanupFunctions.current.size
  };
};

/**
 * Hook for managing event listeners with automatic cleanup
 */
export const useEventListener = (
  eventName: string,
  handler: EventListener,
  element: EventTarget = window,
  options?: AddEventListenerOptions
) => {
  const { registerCleanup } = useMemoryLeakPrevention();

  useEffect(() => {
    element.addEventListener(eventName, handler, options);
    
    const cleanup = () => {
      element.removeEventListener(eventName, handler, options);
    };
    
    registerCleanup(cleanup);
    
    return cleanup;
  }, [eventName, handler, element, options, registerCleanup]);
};

/**
 * Hook for managing intervals with automatic cleanup
 */
export const useInterval = (
  callback: () => void,
  delay: number | null
) => {
  const { registerCleanup } = useMemoryLeakPrevention();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (delay !== null) {
      intervalRef.current = window.setInterval(callback, delay);
      
      const cleanup = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
      
      registerCleanup(cleanup);
      
      return cleanup;
    }
  }, [callback, delay, registerCleanup]);

  return intervalRef.current;
};

/**
 * Hook for managing timeouts with automatic cleanup
 */
export const useTimeout = (
  callback: () => void,
  delay: number | null
) => {
  const { registerCleanup } = useMemoryLeakPrevention();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (delay !== null) {
      timeoutRef.current = window.setTimeout(callback, delay);
      
      const cleanup = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      
      registerCleanup(cleanup);
      
      return cleanup;
    }
  }, [callback, delay, registerCleanup]);

  return timeoutRef.current;
};

/**
 * Hook for managing AbortController with automatic cleanup
 */
export const useAbortController = () => {
  const { registerCleanup } = useMemoryLeakPrevention();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    
    const cleanup = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
    
    registerCleanup(cleanup);
    
    return cleanup;
  }, [registerCleanup]);

  return abortControllerRef.current;
};

/**
 * Hook for managing WebSocket connections with automatic cleanup
 */
export const useWebSocket = (
  url: string,
  protocols?: string | string[]
) => {
  const { registerCleanup } = useMemoryLeakPrevention();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket(url, protocols);
    
    const cleanup = () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
    
    registerCleanup(cleanup);
    
    return cleanup;
  }, [url, protocols, registerCleanup]);

  return wsRef.current;
};

/**
 * Hook for managing ResizeObserver with automatic cleanup
 */
export const useResizeObserver = (
  callback: ResizeObserverCallback,
  target: Element | null
) => {
  const { registerCleanup } = useMemoryLeakPrevention();
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (target) {
      observerRef.current = new ResizeObserver(callback);
      observerRef.current.observe(target);
      
      const cleanup = () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
      
      registerCleanup(cleanup);
      
      return cleanup;
    }
  }, [callback, target, registerCleanup]);

  return observerRef.current;
};

/**
 * Hook for managing IntersectionObserver with automatic cleanup
 */
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  target: Element | null,
  options?: IntersectionObserverInit
) => {
  const { registerCleanup } = useMemoryLeakPrevention();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (target) {
      observerRef.current = new IntersectionObserver(callback, options);
      observerRef.current.observe(target);
      
      const cleanup = () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
      
      registerCleanup(cleanup);
      
      return cleanup;
    }
  }, [callback, target, options, registerCleanup]);

  return observerRef.current;
};