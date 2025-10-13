import { createHash } from 'crypto';

// Asset optimization configuration
const ASSET_OPTIMIZATION_CONFIG = {
  // Image optimization settings
  images: {
    formats: ['webp', 'avif', 'jpeg', 'png'] as const,
    quality: {
      webp: 80,
      avif: 75,
      jpeg: 85,
      png: 90
    },
    sizes: {
      thumbnail: 150,
      small: 300,
      medium: 600,
      large: 1200,
      xlarge: 1920
    },
    lazyLoading: true,
    preloadCritical: true
  },
  
  // Font optimization settings
  fonts: {
    formats: ['woff2', 'woff'] as const,
    preload: true,
    display: 'swap' as const,
    fallback: true
  },
  
  // Video optimization settings
  videos: {
    formats: ['mp4', 'webm'] as const,
    quality: 'medium' as const,
    lazyLoading: true
  }
};

// Image optimization utilities
export class ImageOptimizer {
  /**
   * Generate responsive image URLs
   */
  static generateResponsiveUrls(
    originalUrl: string,
    sizes: number[] = [300, 600, 900, 1200]
  ): string[] {
    return sizes.map(size => `${originalUrl}?w=${size}&q=85&fmt=webp`);
  }

  /**
   * Generate srcset for responsive images
   */
  static generateSrcSet(
    originalUrl: string,
    sizes: { width: number; descriptor: string }[] = [
      { width: 300, descriptor: '300w' },
      { width: 600, descriptor: '600w' },
      { width: 900, descriptor: '900w' },
      { width: 1200, descriptor: '1200w' }
    ]
  ): string {
    return sizes
      .map(({ width, descriptor }) => `${originalUrl}?w=${width}&q=85&fmt=webp ${descriptor}`)
      .join(', ');
  }

  /**
   * Generate picture element with multiple formats
   */
  static generatePictureElement(
    originalUrl: string,
    alt: string,
    sizes: string = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  ): string {
    const webpUrl = `${originalUrl}?fmt=webp&q=85`;
    const avifUrl = `${originalUrl}?fmt=avif&q=75`;
    const fallbackUrl = `${originalUrl}?q=85`;

    return `
      <picture>
        <source srcset="${avifUrl}" type="image/avif">
        <source srcset="${webpUrl}" type="image/webp">
        <img src="${fallbackUrl}" alt="${alt}" loading="lazy" sizes="${sizes}">
      </picture>
    `;
  }

  /**
   * Check if image should be lazy loaded
   */
  static shouldLazyLoad(element: HTMLImageElement): boolean {
    if (!ASSET_OPTIMIZATION_CONFIG.images.lazyLoading) return false;
    
    // Don't lazy load images above the fold
    const rect = element.getBoundingClientRect();
    return rect.top > window.innerHeight;
  }

  /**
   * Preload critical images
   */
  static preloadCriticalImages(urls: string[]): void {
    if (!ASSET_OPTIMIZATION_CONFIG.images.preloadCritical) return;

    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Optimize image loading with intersection observer
   */
  static setupLazyLoading(): void {
    if (!ASSET_OPTIMIZATION_CONFIG.images.lazyLoading) return;

    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Font optimization utilities
export class FontOptimizer {
  /**
   * Generate font preload links
   */
  static generateFontPreloads(fonts: Array<{
    family: string;
    weight: number;
    style: string;
    url: string;
  }>): string {
    return fonts
      .map(font => {
        const format = font.url.includes('.woff2') ? 'woff2' : 'woff';
        return `<link rel="preload" href="${font.url}" as="font" type="font/${format}" crossorigin>`;
      })
      .join('\n');
  }

  /**
   * Generate font-face declarations
   */
  static generateFontFace(font: {
    family: string;
    weight: number;
    style: string;
    url: string;
    display?: string;
  }): string {
    const format = font.url.includes('.woff2') ? 'woff2' : 'woff';
    const display = font.display || ASSET_OPTIMIZATION_CONFIG.fonts.display;
    
    return `
      @font-face {
        font-family: '${font.family}';
        font-weight: ${font.weight};
        font-style: ${font.style};
        font-display: ${display};
        src: url('${font.url}') format('${format}');
      }
    `;
  }

  /**
   * Load fonts with fallback
   */
  static loadFonts(fonts: Array<{
    family: string;
    weight: number;
    style: string;
    url: string;
  }>): Promise<void[]> {
    return Promise.all(
      fonts.map(font => {
        return new Promise<void>((resolve, reject) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = font.url;
          link.onload = () => resolve();
          link.onerror = () => reject(new Error(`Failed to load font: ${font.family}`));
          document.head.appendChild(link);
        });
      })
    );
  }
}

// Video optimization utilities
export class VideoOptimizer {
  /**
   * Generate video sources with multiple formats
   */
  static generateVideoSources(
    originalUrl: string,
    formats: Array<'mp4' | 'webm'> = ['webm', 'mp4']
  ): string {
    return formats
      .map(format => {
        const url = `${originalUrl}?fmt=${format}&q=${ASSET_OPTIMIZATION_CONFIG.videos.quality}`;
        return `<source src="${url}" type="video/${format}">`;
      })
      .join('\n');
  }

  /**
   * Setup lazy loading for videos
   */
  static setupVideoLazyLoading(): void {
    if (!ASSET_OPTIMIZATION_CONFIG.videos.lazyLoading) return;

    const videos = document.querySelectorAll('video[data-src]');
    
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          video.src = video.dataset.src || '';
          video.classList.remove('lazy');
          videoObserver.unobserve(video);
        }
      });
    });

    videos.forEach(video => videoObserver.observe(video));
  }
}

// Asset caching utilities
export class AssetCache {
  private static cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  /**
   * Cache asset data
   */
  static set(key: string, data: unknown, ttl: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get cached asset data
   */
  static get(key: string): unknown | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * Clear expired cache entries
   */
  static cleanup(): void {
    const now = Date.now();
    
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): {
    size: number;
    totalSize: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      totalSize: Array.from(this.cache.values()).reduce((sum, cached) => 
        sum + JSON.stringify(cached.data).length, 0
      ),
      hitRate: 0 // Would need to track hits/misses
    };
  }
}

// Asset compression utilities
export class AssetCompressor {
  /**
   * Compress image data URL
   */
  static async compressImage(
    dataUrl: string,
    quality: number = 0.8,
    maxWidth: number = 1920
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate new dimensions
        const ratio = Math.min(1, maxWidth / img.width);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = dataUrl;
    });
  }

  /**
   * Generate asset hash for cache busting
   */
  static generateHash(content: string): string {
    return createHash('md5').update(content).digest('hex').substring(0, 8);
  }

  /**
   * Optimize asset URL with hash
   */
  static optimizeUrl(url: string, content?: string): string {
    if (content) {
      const hash = this.generateHash(content);
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${hash}`;
    }
    return url;
  }
}

// Performance monitoring for assets
export class AssetPerformanceMonitor {
  private static metrics = {
    loadTimes: new Map<string, number>(),
    errors: new Map<string, number>(),
    cacheHits: 0,
    cacheMisses: 0
  };

  /**
   * Track asset load time
   */
  static trackLoadTime(url: string, loadTime: number): void {
    this.metrics.loadTimes.set(url, loadTime);
  }

  /**
   * Track asset load error
   */
  static trackError(url: string): void {
    const currentErrors = this.metrics.errors.get(url) || 0;
    this.metrics.errors.set(url, currentErrors + 1);
  }

  /**
   * Track cache hit/miss
   */
  static trackCacheHit(hit: boolean): void {
    if (hit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }

  /**
   * Get performance metrics
   */
  static getMetrics(): {
    averageLoadTime: number;
    errorRate: number;
    cacheHitRate: number;
    totalAssets: number;
  } {
    const loadTimes = Array.from(this.metrics.loadTimes.values());
    const errors = Array.from(this.metrics.errors.values());
    
    return {
      averageLoadTime: loadTimes.length > 0 
        ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length 
        : 0,
      errorRate: errors.length > 0 
        ? errors.reduce((a, b) => a + b, 0) / this.metrics.loadTimes.size 
        : 0,
      cacheHitRate: this.metrics.cacheHits + this.metrics.cacheMisses > 0
        ? this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)
        : 0,
      totalAssets: this.metrics.loadTimes.size
    };
  }

  /**
   * Reset metrics
   */
  static resetMetrics(): void {
    this.metrics.loadTimes.clear();
    this.metrics.errors.clear();
    this.metrics.cacheHits = 0;
    this.metrics.cacheMisses = 0;
  }
}

// Export configuration
export { ASSET_OPTIMIZATION_CONFIG };