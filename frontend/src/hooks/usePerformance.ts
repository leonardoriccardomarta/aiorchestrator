import { useState, useEffect, useCallback } from 'react';

export interface PerformanceMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  isSlowConnection: boolean;
  isLowMemory: boolean;
  isLowEndDevice: boolean;
}

export const usePerformance = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => {
    // Initial state
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    return {
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      memory: null,
      isSlowConnection: false,
      isLowMemory: false,
      isLowEndDevice: false,
    };
  });

  useEffect(() => {
    const updateMetrics = () => {
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      // Memory info (if available)
      let memory = null;
      if (nav.memory) {
        memory = {
          usedJSHeapSize: nav.memory.usedJSHeapSize,
          totalJSHeapSize: nav.memory.totalJSHeapSize,
          jsHeapSizeLimit: nav.memory.jsHeapSizeLimit,
        };
      }

      // Performance indicators
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.downlink < 1 ||
        connection.rtt > 500
      );

      const isLowMemory = memory && (
        memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8 ||
        memory.totalJSHeapSize > memory.jsHeapSizeLimit * 0.9
      );

      const isLowEndDevice = (
        navigator.hardwareConcurrency <= 2 ||
        (memory && memory.jsHeapSizeLimit < 1073741824) || // < 1GB
        isSlowConnection
      );

      setMetrics({
        connectionType: connection?.type || 'unknown',
        effectiveType: connection?.effectiveType || 'unknown',
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
        saveData: connection?.saveData || false,
        memory,
        isSlowConnection: !!isSlowConnection,
        isLowMemory: !!isLowMemory,
        isLowEndDevice: !!isLowEndDevice,
      });
    };

    updateMetrics();

    // Listen for connection changes
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateMetrics);
    }

    // Periodic memory check
    const memoryInterval = setInterval(updateMetrics, 5000);

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateMetrics);
      }
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
};

// Hook for adaptive loading based on performance
export const useAdaptiveLoading = () => {
  const performance = usePerformance();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const [shouldReduceImages, setShouldReduceImages] = useState(false);
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Adaptive settings based on performance
    setShouldReduceImages(performance.saveData || performance.isSlowConnection);
    setShouldReduceAnimations(
      performance.isLowEndDevice || 
      performance.isLowMemory || 
      shouldReduceMotion
    );

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [performance, shouldReduceMotion]);

  return {
    shouldReduceMotion,
    shouldReduceImages,
    shouldReduceAnimations,
    isLowEndDevice: performance.isLowEndDevice,
    isSlowConnection: performance.isSlowConnection,
    saveData: performance.saveData,
  };
};

// Hook for lazy loading with performance awareness
export const useLazyLoading = (threshold: number = 0.1) => {
  const { isLowEndDevice, isSlowConnection } = useAdaptiveLoading();
  
  // Adjust threshold based on device performance
  const adjustedThreshold = isLowEndDevice || isSlowConnection ? 0.5 : threshold;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      {
        threshold: adjustedThreshold,
        rootMargin: isLowEndDevice ? '50px' : '100px',
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [adjustedThreshold, isLowEndDevice]);

  return {
    ref,
    isIntersecting,
    hasIntersected,
  };
};

// Hook for debounced operations based on performance
export const usePerformanceDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const { isLowEndDevice } = useAdaptiveLoading();
  
  // Increase debounce delay for low-end devices
  const adjustedDelay = isLowEndDevice ? delay * 2 : delay;

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => {
        callback(...args);
      }, adjustedDelay);

      return () => clearTimeout(timeoutId);
    }) as T,
    [callback, adjustedDelay]
  );

  return debouncedCallback;
};
