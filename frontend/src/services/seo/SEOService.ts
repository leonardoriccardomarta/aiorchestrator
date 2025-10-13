import { analyticsService, AnalyticsEventType } from '../analytics/AnalyticsService';

// SEO Metrics Types
export enum SEOMetricType {
  PAGE_SPEED = 'page_speed',
  CORE_WEB_VITALS = 'core_web_vitals',
  MOBILE_USABILITY = 'mobile_usability',
  SEARCH_RANKINGS = 'search_rankings',
  ORGANIC_TRAFFIC = 'organic_traffic',
  CLICK_THROUGH_RATE = 'click_through_rate',
  BOUNCE_RATE = 'bounce_rate',
  TIME_ON_PAGE = 'time_on_page',
  SOCIAL_SHARES = 'social_shares',
  BACKLINKS = 'backlinks'
}

// Core Web Vitals
export interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

// SEO Page Data
export interface SEOPageData {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaMarkup?: string;
  h1?: string;
  h2?: string[];
  h3?: string[];
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  links: Array<{
    href: string;
    text: string;
    rel?: string;
  }>;
  metaTags: Record<string, string>;
}

// SEO Performance Metrics
export interface SEOPerformanceMetrics {
  url: string;
  timestamp: Date;
  pageSpeed: {
    desktop: number;
    mobile: number;
  };
  coreWebVitals: CoreWebVitals;
  mobileUsability: {
    score: number;
    issues: string[];
  };
  searchRankings: {
    keyword: string;
    position: number;
    volume: number;
  }[];
  organicTraffic: {
    sessions: number;
    pageviews: number;
    bounceRate: number;
    timeOnPage: number;
  };
  socialShares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    total: number;
  };
  backlinks: {
    total: number;
    dofollow: number;
    nofollow: number;
    domains: number;
  };
}

// SEO Service Class
export class SEOService {
  private seoData: Map<string, SEOPageData> = new Map();
  private performanceMetrics: SEOPerformanceMetrics[] = [];
  private keywords: Map<string, {
    keyword: string;
    volume: number;
    difficulty: number;
    currentRanking: number;
    targetRanking: number;
  }> = new Map();

  constructor() {
    this.initialize();
  }

  // Initialize SEO service
  private initialize(): void {
    this.setupDefaultSEOData();
    this.setupEventListeners();
    this.startPerformanceMonitoring();
  }

  // Setup default SEO data
  private setupDefaultSEOData(): void {
    const defaultPages = [
      {
        url: '/',
        title: 'AI Orchestrator - Intelligent Chatbot Platform',
        description: 'Create, train, and deploy intelligent chatbots with AI Orchestrator. The most advanced chatbot platform for businesses.',
        keywords: ['chatbot', 'AI', 'artificial intelligence', 'customer service', 'automation'],
        h1: 'AI Orchestrator',
        h2: ['Intelligent Chatbot Platform', 'Features', 'Pricing', 'Get Started'],
        h3: ['Easy Setup', 'Advanced AI', 'Multi-channel Support', 'Analytics Dashboard']
      },
      {
        url: '/features',
        title: 'AI Orchestrator Features - Advanced Chatbot Capabilities',
        description: 'Discover the powerful features of AI Orchestrator. Advanced AI, multi-channel support, analytics, and more.',
        keywords: ['chatbot features', 'AI capabilities', 'multi-channel', 'analytics'],
        h1: 'Features',
        h2: ['AI-Powered Chatbots', 'Multi-channel Support', 'Advanced Analytics', 'Easy Integration'],
        h3: ['Natural Language Processing', 'Machine Learning', 'Real-time Analytics', 'API Integration']
      },
      {
        url: '/pricing',
        title: 'AI Orchestrator Pricing - Choose Your Plan',
        description: 'Flexible pricing plans for AI Orchestrator. Start free or choose a plan that grows with your business.',
        keywords: ['pricing', 'plans', 'subscription', 'cost'],
        h1: 'Pricing',
        h2: ['Free Plan', 'Starter Plan', 'Professional Plan', 'Enterprise Plan'],
        h3: ['Basic Features', 'Advanced Features', 'Priority Support', 'Custom Solutions']
      },
      {
        url: '/blog',
        title: 'AI Orchestrator Blog - Chatbot Insights & Tips',
        description: 'Stay updated with the latest chatbot trends, AI insights, and tips from AI Orchestrator.',
        keywords: ['blog', 'chatbot tips', 'AI insights', 'tutorials'],
        h1: 'Blog',
        h2: ['Latest Posts', 'Categories', 'Popular Articles', 'Subscribe'],
        h3: ['AI Trends', 'Chatbot Tips', 'Case Studies', 'Tutorials']
      }
    ];

    defaultPages.forEach(page => {
      this.setSEOPageData(page.url, {
        url: page.url,
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        h1: page.h1,
        h2: page.h2,
        h3: page.h3,
        images: [],
        links: [],
        metaTags: {}
      });
    });
  }

  // Setup event listeners
  private setupEventListeners(): void {
    // Listen to page view events
    analyticsService.on('event', (event: any) => {
      if (event.type === AnalyticsEventType.PAGE_VIEWED) {
        this.trackSEOMetrics(event);
      }
    });
  }

  // Start performance monitoring
  private startPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.observeCoreWebVitals();
    }

    // Monitor page speed
    this.measurePageSpeed();
  }

  // Observe Core Web Vitals
  private observeCoreWebVitals(): void {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordCoreWebVital('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.recordCoreWebVital('FID', (entry as any).processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.recordCoreWebVital('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Record Core Web Vital
  private recordCoreWebVital(metric: string, value: number): void {
    const url = window.location.pathname;
    const metrics = this.getCurrentPerformanceMetrics(url);
    
    if (metrics) {
      switch (metric) {
        case 'LCP':
          metrics.coreWebVitals.LCP = value;
          break;
        case 'FID':
          metrics.coreWebVitals.FID = value;
          break;
        case 'CLS':
          metrics.coreWebVitals.CLS = value;
          break;
      }
    }

    // Track with analytics
    analyticsService.track('seo_metric', {
      metric,
      value,
      url,
      category: 'core_web_vitals'
    });
  }

  // Measure page speed
  private measurePageSpeed(): void {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          
          const url = window.location.pathname;
          const metrics = this.getCurrentPerformanceMetrics(url);
          
          if (metrics) {
            metrics.pageSpeed.desktop = loadTime;
            metrics.pageSpeed.mobile = loadTime * 1.5; // Estimate mobile speed
          }

          // Track with analytics
          analyticsService.track('seo_metric', {
            metric: 'page_speed',
            value: loadTime,
            url,
            category: 'performance'
          });
        }, 1000);
      });
    }
  }

  // Track SEO metrics
  private trackSEOMetrics(event: any): void {
    const url = event.properties?.url || window.location.pathname;
    
    // Track organic traffic
    analyticsService.track('seo_metric', {
      metric: 'organic_traffic',
      value: 1,
      url,
      category: 'traffic',
      source: event.properties?.referrer || 'direct'
    });

    // Track time on page (will be updated when user leaves)
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      analyticsService.track('seo_metric', {
        metric: 'time_on_page',
        value: timeOnPage,
        url,
        category: 'engagement'
      });
    });
  }

  // Set SEO page data
  public setSEOPageData(url: string, data: SEOPageData): void {
    this.seoData.set(url, data);
    this.updatePageMetaTags(data);
  }

  // Get SEO page data
  public getSEOPageData(url: string): SEOPageData | null {
    return this.seoData.get(url) || null;
  }

  // Update page meta tags
  private updatePageMetaTags(data: SEOPageData): void {
    // Update title
    if (data.title) {
      document.title = data.title;
    }

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', data.description);

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', data.keywords.join(', '));

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', data.canonicalUrl || window.location.href);

    // Update Open Graph tags
    if (data.ogTitle) {
      this.updateMetaTag('og:title', data.ogTitle);
    }
    if (data.ogDescription) {
      this.updateMetaTag('og:description', data.ogDescription);
    }
    if (data.ogImage) {
      this.updateMetaTag('og:image', data.ogImage);
    }

    // Update Twitter Card tags
    if (data.twitterCard) {
      this.updateMetaTag('twitter:card', data.twitterCard);
    }
    if (data.twitterTitle) {
      this.updateMetaTag('twitter:title', data.twitterTitle);
    }
    if (data.twitterDescription) {
      this.updateMetaTag('twitter:description', data.twitterDescription);
    }
    if (data.twitterImage) {
      this.updateMetaTag('twitter:image', data.twitterImage);
    }

    // Add schema markup
    if (data.schemaMarkup) {
      this.addSchemaMarkup(data.schemaMarkup);
    }
  }

  // Update meta tag
  private updateMetaTag(property: string, content: string): void {
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }

  // Add schema markup
  private addSchemaMarkup(schema: string): void {
    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = schema;
  }

  // Get current performance metrics
  private getCurrentPerformanceMetrics(url: string): SEOPerformanceMetrics | null {
    return this.performanceMetrics.find(metric => metric.url === url) || null;
  }

  // Track SEO metric
  public trackSEOMetric(
    metricType: SEOMetricType,
    value: number,
    url: string,
    additionalData: Record<string, any> = {}
  ): void {
    const metrics = this.getCurrentPerformanceMetrics(url);
    
    if (metrics) {
      switch (metricType) {
        case SEOMetricType.PAGE_SPEED:
          metrics.pageSpeed.desktop = value;
          break;
        case SEOMetricType.CORE_WEB_VITALS:
          // This would be updated by the observer
          break;
        case SEOMetricType.ORGANIC_TRAFFIC:
          metrics.organicTraffic.sessions += value;
          break;
        case SEOMetricType.BOUNCE_RATE:
          metrics.organicTraffic.bounceRate = value;
          break;
        case SEOMetricType.TIME_ON_PAGE:
          metrics.organicTraffic.timeOnPage = value;
          break;
        case SEOMetricType.SOCIAL_SHARES:
          metrics.socialShares.total += value;
          break;
      }
    }

    // Track with analytics
    analyticsService.track('seo_metric', {
      metric: metricType,
      value,
      url,
      ...additionalData
    });
  }

  // Generate sitemap
  public generateSitemap(): string {
    const baseUrl = window.location.origin;
    const pages = Array.from(this.seoData.keys());
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    pages.forEach(page => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
      sitemap += '    <lastmod>' + new Date().toISOString() + '</lastmod>\n';
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.8</priority>\n';
      sitemap += '  </url>\n';
    });
    
    sitemap += '</urlset>';
    return sitemap;
  }

  // Generate robots.txt
  public generateRobotsTxt(): string {
    const baseUrl = window.location.origin;
    
    let robotsTxt = 'User-agent: *\n';
    robotsTxt += 'Allow: /\n\n';
    robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
    robotsTxt += `Host: ${baseUrl}\n`;
    
    return robotsTxt;
  }

  // Add keyword tracking
  public addKeywordTracking(
    keyword: string,
    volume: number,
    difficulty: number,
    targetRanking: number
  ): void {
    this.keywords.set(keyword, {
      keyword,
      volume,
      difficulty,
      currentRanking: 0,
      targetRanking
    });
  }

  // Update keyword ranking
  public updateKeywordRanking(keyword: string, ranking: number): void {
    const keywordData = this.keywords.get(keyword);
    if (keywordData) {
      keywordData.currentRanking = ranking;
    }
  }

  // Get keyword performance
  public getKeywordPerformance(): Array<{
    keyword: string;
    volume: number;
    difficulty: number;
    currentRanking: number;
    targetRanking: number;
    performance: number;
  }> {
    return Array.from(this.keywords.values()).map(keyword => ({
      ...keyword,
      performance: keyword.currentRanking > 0 ? (1 / keyword.currentRanking) * keyword.volume : 0
    })).sort((a, b) => b.performance - a.performance);
  }

  // Get SEO performance metrics
  public getSEOPerformanceMetrics(url?: string): SEOPerformanceMetrics[] {
    if (url) {
      return this.performanceMetrics.filter(metric => metric.url === url);
    }
    return [...this.performanceMetrics];
  }

  // Get SEO recommendations
  public getSEORecommendations(url: string): Array<{
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }> {
    const recommendations = [];
    const pageData = this.getSEOPageData(url);
    const metrics = this.getCurrentPerformanceMetrics(url);

    if (pageData) {
      // Check title length
      if (pageData.title.length < 30) {
        recommendations.push({
          type: 'warning',
          title: 'Title Too Short',
          description: 'Title should be between 30-60 characters',
          priority: 'medium'
        });
      } else if (pageData.title.length > 60) {
        recommendations.push({
          type: 'warning',
          title: 'Title Too Long',
          description: 'Title should be between 30-60 characters',
          priority: 'medium'
        });
      }

      // Check description length
      if (pageData.description.length < 120) {
        recommendations.push({
          type: 'warning',
          title: 'Description Too Short',
          description: 'Description should be between 120-160 characters',
          priority: 'medium'
        });
      } else if (pageData.description.length > 160) {
        recommendations.push({
          type: 'warning',
          title: 'Description Too Long',
          description: 'Description should be between 120-160 characters',
          priority: 'medium'
        });
      }

      // Check for H1
      if (!pageData.h1) {
        recommendations.push({
          type: 'error',
          title: 'Missing H1 Tag',
          description: 'Each page should have exactly one H1 tag',
          priority: 'high'
        });
      }

      // Check for images without alt text
      const imagesWithoutAlt = pageData.images.filter(img => !img.alt);
      if (imagesWithoutAlt.length > 0) {
        recommendations.push({
          type: 'warning',
          title: 'Images Without Alt Text',
          description: `${imagesWithoutAlt.length} images are missing alt text`,
          priority: 'medium'
        });
      }
    }

    if (metrics) {
      // Check page speed
      if (metrics.pageSpeed.desktop > 3000) {
        recommendations.push({
          type: 'error',
          title: 'Slow Page Speed',
          description: 'Page load time is too slow. Optimize images and code.',
          priority: 'high'
        });
      }

      // Check Core Web Vitals
      if (metrics.coreWebVitals.LCP > 2500) {
        recommendations.push({
          type: 'error',
          title: 'Poor LCP Score',
          description: 'Largest Contentful Paint is too slow',
          priority: 'high'
        });
      }

      if (metrics.coreWebVitals.CLS > 0.1) {
        recommendations.push({
          type: 'warning',
          title: 'Layout Shift Issues',
          description: 'Cumulative Layout Shift needs improvement',
          priority: 'medium'
        });
      }
    }

    return recommendations as any;
  }

  // Get SEO score
  public getSEOScore(url: string): number {
    const recommendations = this.getSEORecommendations(url);
    let score = 100;

    recommendations.forEach(rec => {
      switch (rec.priority) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    return Math.max(0, score);
  }
}

// Create singleton instance
export const seoService = new SEOService();

// Export default instance
export default seoService; 