import { analyticsService } from './AnalyticsService';

// User Behavior Types
export enum BehaviorType {
  CLICK = 'click',
  SCROLL = 'scroll',
  HOVER = 'hover',
  FORM_INTERACTION = 'form_interaction',
  NAVIGATION = 'navigation',
  SEARCH = 'search',
  DOWNLOAD = 'download',
  SHARE = 'share',
  BOOKMARK = 'bookmark',
  PRINT = 'print'
}

// User Journey Step
export interface JourneyStep {
  id: string;
  type: BehaviorType;
  timestamp: Date;
  element?: string;
  properties: Record<string, any>;
  duration?: number;
}

// User Journey
export interface UserJourney {
  id: string;
  userId?: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  steps: JourneyStep[];
  goal?: string;
  completed: boolean;
  properties: Record<string, any>;
}

// Funnel Step
export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
  dropoffRate: number;
  averageTime: number;
}

// User Behavior Service
export class UserBehaviorService {
  private currentJourney: UserJourney | null = null;
  private journeySteps: JourneyStep[] = [];
  private isTracking = false;
  private trackingConfig = {
    trackClicks: true,
    trackScrolls: true,
    trackHovers: true,
    trackFormInteractions: true,
    trackNavigation: true,
    trackSearches: true,
    trackDownloads: true,
    trackShares: true,
    trackBookmarks: true,
    trackPrints: true,
    scrollThreshold: 25, // Track scroll every 25%
    hoverThreshold: 1000, // Track hover after 1 second
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  };

  constructor() {
    this.initialize();
  }

  // Initialize behavior tracking
  private initialize(): void {
    this.startTracking();
    this.setupEventListeners();
    this.setupSessionTimeout();
  }

  // Start behavior tracking
  public startTracking(): void {
    if (this.isTracking) return;

    this.isTracking = true;
    this.createNewJourney();
    
    console.log('User behavior tracking started');
  }

  // Stop behavior tracking
  public stopTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;
    this.completeCurrentJourney();
    
    console.log('User behavior tracking stopped');
  }

  // Create new user journey
  private createNewJourney(): void {
    const session = analyticsService.getSession();
    
    this.currentJourney = {
      id: this.generateId(),
      userId: session?.userId,
      sessionId: session?.id || '',
      startTime: new Date(),
      steps: [],
      completed: false,
      properties: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    };

    this.journeySteps = [];
  }

  // Complete current journey
  private completeCurrentJourney(): void {
    if (!this.currentJourney) return;

    this.currentJourney.endTime = new Date();
    this.currentJourney.completed = true;
    this.currentJourney.steps = [...this.journeySteps];

    // Send journey data to analytics
    analyticsService.track('user_journey_completed', {
      journeyId: this.currentJourney.id,
      duration: this.currentJourney.endTime.getTime() - this.currentJourney.startTime.getTime(),
      stepsCount: this.currentJourney.steps.length,
      goal: this.currentJourney.goal,
      completed: this.currentJourney.completed
    });

    console.log('User journey completed:', this.currentJourney);
  }

  // Setup event listeners
  private setupEventListeners(): void {
    if (this.trackingConfig.trackClicks) {
      this.setupClickTracking();
    }

    if (this.trackingConfig.trackScrolls) {
      this.setupScrollTracking();
    }

    if (this.trackingConfig.trackHovers) {
      this.setupHoverTracking();
    }

    if (this.trackingConfig.trackFormInteractions) {
      this.setupFormTracking();
    }

    if (this.trackingConfig.trackNavigation) {
      this.setupNavigationTracking();
    }

    if (this.trackingConfig.trackSearches) {
      this.setupSearchTracking();
    }

    if (this.trackingConfig.trackDownloads) {
      this.setupDownloadTracking();
    }

    if (this.trackingConfig.trackShares) {
      this.setupShareTracking();
    }

    if (this.trackingConfig.trackBookmarks) {
      this.setupBookmarkTracking();
    }

    if (this.trackingConfig.trackPrints) {
      this.setupPrintTracking();
    }
  }

  // Setup click tracking
  private setupClickTracking(): void {
    document.addEventListener('click', (event) => {
      if (!this.isTracking) return;

      const target = event.target as HTMLElement;
      const element = this.getElementInfo(target);

      this.trackBehavior(BehaviorType.CLICK, {
        element: element.selector,
        text: element.text,
        tag: element.tag,
        classes: element.classes,
        id: element.id,
        href: element.href,
        buttonType: element.buttonType,
        position: {
          x: event.clientX,
          y: event.clientY
        }
      });
    }, { passive: true });
  }

  // Setup scroll tracking
  private setupScrollTracking(): void {
    let lastScrollPercentage = 0;

    document.addEventListener('scroll', () => {
      if (!this.isTracking) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      // Track scroll every threshold percentage
      if (scrollPercentage >= lastScrollPercentage + this.trackingConfig.scrollThreshold) {
        lastScrollPercentage = scrollPercentage;
        
        this.trackBehavior(BehaviorType.SCROLL, {
          percentage: scrollPercentage,
          scrollTop,
          scrollHeight,
          viewportHeight: window.innerHeight
        });
      }
    }, { passive: true });
  }

  // Setup hover tracking
  private setupHoverTracking(): void {
    let hoverTimers: Map<HTMLElement, number> = new Map();

    document.addEventListener('mouseenter', (event) => {
      if (!this.isTracking) return;

      const target = event.target as HTMLElement;
      
      const timer = setTimeout(() => {
        const element = this.getElementInfo(target);
        
        this.trackBehavior(BehaviorType.HOVER, {
          element: element.selector,
          text: element.text,
          tag: element.tag,
          classes: element.classes,
          id: element.id,
          duration: this.trackingConfig.hoverThreshold
        });
      }, this.trackingConfig.hoverThreshold);

      hoverTimers.set(target, timer as any);
    }, { passive: true });

    document.addEventListener('mouseleave', (event) => {
      const target = event.target as HTMLElement;
      const timer = hoverTimers.get(target);
      
      if (timer) {
        clearTimeout(timer);
        hoverTimers.delete(target);
      }
    }, { passive: true });
  }

  // Setup form tracking
  private setupFormTracking(): void {
         document.addEventListener('focus', (event) => {
       if (!this.isTracking) return;

       const target = event.target as Element;
       if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
         const element = this.getElementInfo(target as HTMLElement);
        
        this.trackBehavior(BehaviorType.FORM_INTERACTION, {
          action: 'focus',
          element: element.selector,
          type: (target as HTMLInputElement).type,
          name: (target as HTMLInputElement).name,
          placeholder: (target as HTMLInputElement).placeholder
        });
      }
    }, { passive: true });

         document.addEventListener('blur', (event) => {
       if (!this.isTracking) return;

       const target = event.target as Element;
       if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
         const element = this.getElementInfo(target as HTMLElement);
        
        this.trackBehavior(BehaviorType.FORM_INTERACTION, {
          action: 'blur',
          element: element.selector,
          type: (target as HTMLInputElement).type,
          name: (target as HTMLInputElement).name,
          value: (target as HTMLInputElement).value?.length || 0
        });
      }
    }, { passive: true });

    document.addEventListener('submit', (event) => {
      if (!this.isTracking) return;

      const target = event.target as HTMLFormElement;
      const element = this.getElementInfo(target);
      
             this.trackBehavior(BehaviorType.FORM_INTERACTION, {
         action: 'submit',
         element: element.selector,
         method: target.method,
         formAction: target.action,
         fieldsCount: target.elements.length
       });
    }, { passive: true });
  }

  // Setup navigation tracking
  private setupNavigationTracking(): void {
    let currentUrl = window.location.href;

    const trackNavigation = () => {
      const newUrl = window.location.href;
      if (newUrl !== currentUrl) {
        this.trackBehavior(BehaviorType.NAVIGATION, {
          from: currentUrl,
          to: newUrl,
          method: 'navigation'
        });
        currentUrl = newUrl;
      }
    };

    // Track popstate (back/forward navigation)
    window.addEventListener('popstate', trackNavigation);

    // Track pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackNavigation, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(trackNavigation, 0);
    };
  }

  // Setup search tracking
  private setupSearchTracking(): void {
    document.addEventListener('input', (event) => {
      if (!this.isTracking) return;

      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'search') {
        const element = this.getElementInfo(target);
        
        this.trackBehavior(BehaviorType.SEARCH, {
          element: element.selector,
          query: (target as HTMLInputElement).value,
          queryLength: (target as HTMLInputElement).value.length
        });
      }
    }, { passive: true });
  }

  // Setup download tracking
  private setupDownloadTracking(): void {
    document.addEventListener('click', (event) => {
      if (!this.isTracking) return;

      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && this.isDownloadLink(link.href)) {
        const element = this.getElementInfo(link);
        
        this.trackBehavior(BehaviorType.DOWNLOAD, {
          element: element.selector,
          url: link.href,
          filename: this.getFilenameFromUrl(link.href),
          fileType: this.getFileTypeFromUrl(link.href)
        });
      }
    }, { passive: true });
  }

  // Setup share tracking
  private setupShareTracking(): void {
    document.addEventListener('click', (event) => {
      if (!this.isTracking) return;

      const target = event.target as HTMLElement;
      const shareButton = target.closest('[data-share], .share-button, .social-share');
      
      if (shareButton) {
        const element = this.getElementInfo(shareButton as HTMLElement);
        
        this.trackBehavior(BehaviorType.SHARE, {
          element: element.selector,
          platform: shareButton.getAttribute('data-platform') || 'unknown',
          url: window.location.href,
          title: document.title
        });
      }
    }, { passive: true });
  }

  // Setup bookmark tracking
  private setupBookmarkTracking(): void {
    window.addEventListener('beforeunload', () => {
      if (!this.isTracking) return;

      this.trackBehavior(BehaviorType.BOOKMARK, {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Setup print tracking
  private setupPrintTracking(): void {
    window.addEventListener('beforeprint', () => {
      if (!this.isTracking) return;

      this.trackBehavior(BehaviorType.PRINT, {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Setup session timeout
  private setupSessionTimeout(): void {
    setInterval(() => {
      if (this.currentJourney) {
        const now = new Date();
        const timeSinceLastActivity = now.getTime() - this.currentJourney.startTime.getTime();
        
        if (timeSinceLastActivity > this.trackingConfig.sessionTimeout) {
          this.completeCurrentJourney();
          this.createNewJourney();
        }
      }
    }, 60000); // Check every minute
  }

  // Track behavior
  private trackBehavior(type: BehaviorType, properties: Record<string, any>): void {
    if (!this.isTracking || !this.currentJourney) return;

    const step: JourneyStep = {
      id: this.generateId(),
      type,
      timestamp: new Date(),
      properties,
      duration: this.journeySteps.length > 0 
        ? new Date().getTime() - this.journeySteps[this.journeySteps.length - 1].timestamp.getTime()
        : 0
    };

    this.journeySteps.push(step);

    // Track with analytics service
    analyticsService.track('user_behavior', {
      behaviorType: type,
      ...properties,
      journeyId: this.currentJourney.id,
      stepNumber: this.journeySteps.length
    });

    console.log('Behavior tracked:', step);
  }

  // Get element information
  private getElementInfo(element: HTMLElement): {
    selector: string;
    text: string;
    tag: string;
    classes: string[];
    id: string;
    href?: string;
    buttonType?: string;
  } {
    const tag = element.tagName.toLowerCase();
    const id = element.id || '';
    const classes = Array.from(element.classList);
    const text = element.textContent?.trim() || '';
    
    let selector = tag;
    if (id) selector += `#${id}`;
    if (classes.length > 0) selector += `.${classes.join('.')}`;

    let href: string | undefined;
    let buttonType: string | undefined;

    if (tag === 'a') {
      href = (element as HTMLAnchorElement).href;
    } else if (tag === 'button') {
      buttonType = (element as HTMLButtonElement).type;
    }

    return {
      selector,
      text,
      tag,
      classes,
      id,
      href,
      buttonType
    };
  }

  // Check if link is a download
  private isDownloadLink(url: string): boolean {
    const downloadExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.mp3', '.mp4', '.jpg', '.png'];
    return downloadExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  // Get filename from URL
  private getFilenameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || '';
    } catch {
      return '';
    }
  }

  // Get file type from URL
  private getFileTypeFromUrl(url: string): string {
    const filename = this.getFilenameFromUrl(url);
    const extension = filename.split('.').pop() || '';
    return extension.toLowerCase();
  }

  // Set journey goal
  public setJourneyGoal(goal: string): void {
    if (this.currentJourney) {
      this.currentJourney.goal = goal;
    }
  }

  // Add custom behavior
  public trackCustomBehavior(type: string, properties: Record<string, any> = {}): void {
    this.trackBehavior(type as BehaviorType, properties);
  }

  // Get current journey
  public getCurrentJourney(): UserJourney | null {
    return this.currentJourney;
  }

  // Get journey steps
  public getJourneySteps(): JourneyStep[] {
    return [...this.journeySteps];
  }

  // Update tracking configuration
  public updateConfig(config: Partial<typeof this.trackingConfig>): void {
    this.trackingConfig = { ...this.trackingConfig, ...config };
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const userBehaviorService = new UserBehaviorService();

// Export default instance
export default userBehaviorService; 