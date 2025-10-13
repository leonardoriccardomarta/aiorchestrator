import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import { useResponsive } from '../hooks/useResponsive';
import { useAdaptiveLoading, useLazyLoading } from '../hooks/usePerformance';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  quality?: number;
  placeholder?: string;
  lazy?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  sizes = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
  },
  quality = 80,
  placeholder,
  lazy = true,
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { shouldReduceImages } = useAdaptiveLoading();
  const { ref, hasIntersected } = useLazyLoading();

  // Generate responsive image URL
  useEffect(() => {
    if (!src) return;

    let finalSrc = src;

    // Add quality parameter if it's a supported image service
    if (src.includes('cloudinary.com') || src.includes('imgix.net')) {
      const separator = src.includes('?') ? '&' : '?';
      finalSrc = `${src}${separator}q=${quality}`;
      
      // Add responsive parameters
      if (isMobile) {
        finalSrc += '&w=400';
      } else if (isTablet) {
        finalSrc += '&w=800';
      } else {
        finalSrc += '&w=1200';
      }
    }

    // Use placeholder for low-end devices or slow connections
    if (shouldReduceImages && placeholder) {
      finalSrc = placeholder;
    }

    setImageSrc(finalSrc);
  }, [src, quality, isMobile, isTablet, isDesktop, shouldReduceImages, placeholder]);

  // Load image when visible (if lazy loading)
  useEffect(() => {
    if (!lazy || priority || hasIntersected) {
      setIsLoaded(true);
    }
  }, [lazy, priority, hasIntersected]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(placeholder || '/placeholder-image.png');
    onError?.();
  };

  const getSize = () => {
    if (isMobile) return sizes.mobile;
    if (isTablet) return sizes.tablet;
    return sizes.desktop;
  };

  return (
    <div
      ref={lazy ? ref : undefined}
      className={cn('relative overflow-hidden', className)}
    >
      {imageSrc && (isLoaded || priority) ? (
        <img
          src={imageSrc}
          alt={alt}
          sizes={getSize()}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Optimized image gallery component
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4;
  };
  gap?: 'sm' | 'md' | 'lg';
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getColumns = () => {
    if (isMobile) return columns.mobile || 1;
    if (isTablet) return columns.tablet || 2;
    return columns.desktop || 3;
  };

  const getGap = () => {
    switch (gap) {
      case 'sm': return 'gap-2';
      case 'md': return 'gap-4';
      case 'lg': return 'gap-6';
      default: return 'gap-4';
    }
  };

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${getColumns()}`,
        getGap(),
        className
      )}
    >
      {images.map((image, index) => (
        <ResponsiveImage
          key={index}
          src={image.src}
          alt={image.alt}
          className="aspect-square rounded-lg"
          sizes={{
            mobile: '100vw',
            tablet: '50vw',
            desktop: '33vw',
          }}
        />
      ))}
    </div>
  );
};
