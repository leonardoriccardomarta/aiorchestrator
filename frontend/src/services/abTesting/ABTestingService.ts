import { apiService } from '../api';

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  isActive: boolean;
}

export interface ABTestVariant {
  id: string;
  name: string;
  config: Record<string, any>;
  trafficPercentage: number;
}

class ABTestingService {
  private static instance: ABTestingService;
  private activeTests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();

  private constructor() {
    this.loadActiveTests();
  }

  public static getInstance(): ABTestingService {
    if (!ABTestingService.instance) {
      ABTestingService.instance = new ABTestingService();
    }
    return ABTestingService.instance;
  }

  private async loadActiveTests(): Promise<void> {
    try {
      // Mock AB tests data for demo
      const tests = [
        { 
          id: 'test1', 
          isActive: true, 
          name: 'Button Color Test',
          variants: [
            { 
              id: 'variant1', 
              name: 'Red Button', 
              config: { color: 'red' },
              trafficPercentage: 50 
            },
            { 
              id: 'variant2', 
              name: 'Blue Button', 
              config: { color: 'blue' },
              trafficPercentage: 50 
            }
          ]
        },
        { 
          id: 'test2', 
          isActive: false, 
          name: 'Layout Test',
          variants: [
            { 
              id: 'variant1', 
              name: 'Sidebar Layout', 
              config: { layout: 'sidebar' },
              trafficPercentage: 50 
            },
            { 
              id: 'variant2', 
              name: 'Top Layout', 
              config: { layout: 'top' },
              trafficPercentage: 50 
            }
          ]
        }
      ];
      this.activeTests.clear();
      tests.forEach(test => {
        if (test.isActive) {
          this.activeTests.set(test.id, test);
        }
      });
    } catch (error) {
      console.error('Failed to load A/B tests:', error);
    }
  }

  public async assignVariant(testId: string, userId?: string): Promise<string | null> {
    const test = this.activeTests.get(testId);
    if (!test || !test.isActive) return null;

    if (userId) {
      const userAssignment = this.userAssignments.get(userId)?.get(testId);
      if (userAssignment) return userAssignment;
    }

    const variant = this.selectVariant(test);
    if (!variant) return null;

    if (userId) {
      if (!this.userAssignments.has(userId)) {
        this.userAssignments.set(userId, new Map());
      }
      this.userAssignments.get(userId)!.set(testId, variant.id);
    }

    return variant.id;
  }

  private selectVariant(test: ABTest): ABTestVariant | null {
    const random = Math.random() * 100;
    let cumulativePercentage = 0;

    for (const variant of test.variants) {
      cumulativePercentage += variant.trafficPercentage;
      if (random <= cumulativePercentage) return variant;
    }

    return test.variants[0] || null;
  }

  public async getVariantConfig(testId: string, userId?: string): Promise<Record<string, any> | null> {
    const variantId = await this.assignVariant(testId, userId);
    if (!variantId) return null;

    const test = this.activeTests.get(testId);
    const variant = test?.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  public async trackEvent(testId: string, event: string, value?: number): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      const variantId = await this.assignVariant(testId, userId);
      
      if (variantId) {
        // Mock API call for demo
        console.log('AB Test Event:', { testId, variantId, event, value });
      }
    } catch (error) {
      console.error('Failed to track A/B test event:', error);
    }
  }

  private getCurrentUserId(): string | undefined {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}

export default ABTestingService.getInstance(); 