import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Spinner, colors, spacing } from '../../design-system/DesignSystem';

// Lazy Loading Image Component
interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ImageContainer = styled.div<{ width?: number | string; height?: number | string }>`
  position: relative;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || 'auto')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || 'auto')};
  overflow: hidden;
  background: ${colors.secondary[100]};
  border-radius: 8px;
`;

const StyledImage = styled.img<{ loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ loaded }) => (loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.secondary[100]};
  color: ${colors.secondary[400]};
  font-size: 1.5rem;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = '🖼️',
  width,
  height,
  className,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '50px',
      threshold: 0.1,
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <ImageContainer
      ref={containerRef}
      width={width}
      height={height}
      className={className}
    >
      {!isLoaded && !hasError && (
        <LoadingSpinner>
          <Spinner size="sm" />
        </LoadingSpinner>
      )}
      
      {hasError && (
        <Placeholder>
          {placeholder}
        </Placeholder>
      )}
      
      {isInView && !hasError && (
        <StyledImage
          ref={imageRef}
          src={src}
          alt={alt}
          loaded={isLoaded}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </ImageContainer>
  );
};

// Lazy Loading Component Wrapper
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

const LazyWrapper = styled.div`
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <Spinner size="md" />,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <LazyWrapper ref={containerRef}>
      {isVisible ? children : fallback}
    </LazyWrapper>
  );
};

// Virtual Scrolling Component
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

const VirtualContainer = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  overflow-y: auto;
  position: relative;
`;

const VirtualContent = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  position: relative;
`;

const VirtualItem = styled.div<{ top: number; height: number }>`
  position: absolute;
  top: ${({ top }) => top}px;
  left: 0;
  right: 0;
  height: ${({ height }) => height}px;
`;

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <VirtualContainer
      ref={containerRef}
      height={containerHeight}
      onScroll={handleScroll}
    >
      <VirtualContent height={totalHeight}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <VirtualItem
              key={actualIndex}
              top={actualIndex * itemHeight}
              height={itemHeight}
            >
              {renderItem(item, actualIndex)}
            </VirtualItem>
          );
        })}
      </VirtualContent>
    </VirtualContainer>
  );
}

// Debounced Input Component
interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

const DebouncedInputField = styled.input`
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  border: 2px solid ${colors.secondary[300]};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }
`;

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  placeholder,
  delay = 300,
  className,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <DebouncedInputField
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

// Memoized Component Wrapper
interface MemoizedComponentProps {
  children: React.ReactNode;
  dependencies: any[];
}

export const MemoizedComponent: React.FC<MemoizedComponentProps> = React.memo(
  ({ children }) => <>{children}</>,
  (prevProps, nextProps) => {
    // Custom comparison logic can be added here
    return JSON.stringify(prevProps.dependencies) === JSON.stringify(nextProps.dependencies);
  }
);

// Performance Monitor Component
interface PerformanceMonitorProps {
  children: React.ReactNode;
  name: string;
  onRender?: (duration: number) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  name,
  onRender,
}) => {
  const startTime = useRef<number>(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    console.log(`[Performance] ${name} rendered in ${duration.toFixed(2)}ms`);
    onRender?.(duration);
  });

  return <>{children}</>;
};

// Bundle Size Optimizer Hook
export const useBundleOptimizer = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate dynamic import
    const loadComponent = async () => {
      try {
        // This would be a dynamic import in a real scenario
        // const Component = await import('./HeavyComponent');
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load component:', error);
      }
    };

    loadComponent();
  }, []);

  return { isLoaded };
};

// Image Preloader Hook
export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImage = (url: string) => {
      if (loadedImages.has(url) || loadingImages.has(url)) return;

      setLoadingImages(prev => new Set(prev).add(url));

      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(url));
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      };
      img.onerror = () => {
        setLoadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(url);
          return newSet;
        });
      };
      img.src = url;
    };

    imageUrls.forEach(preloadImage);
  }, [imageUrls, loadedImages, loadingImages]);

  return {
    loadedImages: Array.from(loadedImages),
    loadingImages: Array.from(loadingImages),
    isImageLoaded: (url: string) => loadedImages.has(url),
    isImageLoading: (url: string) => loadingImages.has(url),
  };
};

// Cache Manager Hook
export const useCacheManager = function<T>(maxSize: number = 100) {
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const get = useCallback((key: string): T | null => {
    const item = cache.current.get(key);
    if (!item) return null;

    // Check if item is expired (24 hours)
    const isExpired = Date.now() - item.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      cache.current.delete(key);
      return null;
    }

    return item.data;
  }, []);

  const set = useCallback((key: string, data: T) => {
    // Remove oldest items if cache is full
    if (cache.current.size >= maxSize) {
      const oldestKey = cache.current.keys().next().value;
      if (oldestKey) {
        cache.current.delete(oldestKey);
      }
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now(),
    });
  }, [maxSize]);

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const remove = useCallback((key: string) => {
    cache.current.delete(key);
  }, []);

  return { get, set, clear, remove, size: cache.current.size };
}; 