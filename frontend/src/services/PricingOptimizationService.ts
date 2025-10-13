import { ServiceRegistry } from './ServiceRegistry.ts';
import { AIService } from './AIService.ts';
import { AnalyticsService } from './AnalyticsService.ts';
import { SecurityService, UserRole } from './SecurityService.ts';

interface PricingRule {
  id: string;
  name: string;
  condition: string;
  adjustment: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  priority: number;
}

interface CompetitorPrice {
  competitor: string;
  productId: string;
  price: number;
  timestamp: number;
}

interface MarketData {
  demand: number;
  seasonality: number;
  competitorPrices: CompetitorPrice[];
  userSegment: string;
  region: string;
}

interface OptimizationResult {
  suggestedPrice: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
    explanation: string;
  }[];
}

export class PricingOptimizationService {
  private registry: ServiceRegistry;
  private pricingRules: PricingRule[] = [];
  private priceHistory: Map<string, { price: number; timestamp: number }[]> = new Map();
  // Remove unused marketData
  // private marketData: Map<string, MarketData> = new Map();

  constructor() {
    this.registry = ServiceRegistry.getInstance();
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    this.pricingRules = [
      {
        id: 'seasonal-adjustment',
        name: 'Seasonal Pricing',
        condition: 'data.seasonality > 0.7',
        adjustment: { type: 'percentage', value: 15 },
        priority: 1,
      },
      {
        id: 'competitive-match',
        name: 'Competitive Matching',
        condition: 'data.competitorPrices.length > 0',
        adjustment: { type: 'percentage', value: -5 },
        priority: 2,
      },
      {
        id: 'demand-based',
        name: 'Demand-Based Pricing',
        condition: 'data.demand > 0.8',
        adjustment: { type: 'percentage', value: 10 },
        priority: 3,
      },
    ];
  }

  async optimizePrice(basePrice: number): Promise<OptimizationResult> {
    const analyticsService = this.registry.getService<AnalyticsService>('analytics');
    const securityService = this.registry.getService<SecurityService>('security');

    // Check permissions
    if (!securityService.hasPermission(UserRole.ADMIN, 'write', 'pricing')) {
      throw new Error('Permission denied for price optimization');
    }

    // Get market data
    const marketData = await this.getMarketData();
    
    // Get AI insights
    await this.getAIInsights(basePrice, marketData);

    // Track optimization event
    analyticsService.trackEvent('price_optimization_started', {
      basePrice,
      marketData,
    });

    // Calculate optimal price
    const result = await this.calculateOptimalPrice(basePrice, marketData);

    // Store price history
    this.updatePriceHistory();

    // Track result
    analyticsService.trackEvent('price_optimization_completed', {
      originalPrice: basePrice,
      optimizedPrice: result.suggestedPrice,
      confidence: result.confidence,
    });

    return result;
  }

  private async getMarketData(): Promise<MarketData> {
    // In a real implementation, this would fetch real-time market data
    // from various sources (APIs, databases, etc.)
    return {
      demand: Math.random(),
      seasonality: Math.random(),
      competitorPrices: [],
      userSegment: 'enterprise',
      region: 'global',
    };
  }

  private async getAIInsights(
    basePrice: number,
    marketData: MarketData
  ): Promise<void> {
    const aiService = this.registry.getService<AIService>('ai');
    
    const prompt = `Analyze the following market data and suggest optimal pricing:
      Base Price: ${basePrice}
      Market Data: ${JSON.stringify(marketData, null, 2)}
    `;

    aiService.generateSuggestions(prompt);
  }

  private async calculateOptimalPrice(
    basePrice: number,
    marketData: MarketData
  ): Promise<OptimizationResult> {
    let adjustedPrice = basePrice;
    const factors: OptimizationResult['factors'] = [];

    // Apply pricing rules
    for (const rule of this.pricingRules) {
      try {
        if (this.evaluateCondition(rule.condition, { data: marketData })) {
          const adjustment = rule.adjustment.type === 'percentage'
            ? basePrice * (rule.adjustment.value / 100)
            : rule.adjustment.value;

          adjustedPrice += adjustment;
          factors.push({
            name: rule.name,
            impact: (adjustment / basePrice) * 100,
            explanation: `Applied ${rule.name} rule with ${rule.adjustment.type} adjustment`,
          });
        }
      } catch (error) {
        console.error(`Error applying pricing rule ${rule.name}:`, error);
      }
    }

    // Calculate confidence based on available data quality
    const confidence = this.calculateConfidence(marketData, factors);

    return {
      suggestedPrice: Math.max(0, adjustedPrice), // Ensure price is not negative
      confidence,
      factors,
    };
  }

  private evaluateCondition(condition: string, context: Record<string, unknown>): boolean {
    try {
      return new Function('data', `return ${condition}`)(context.data);
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private calculateConfidence(
    marketData: MarketData,
    factors: OptimizationResult['factors']
  ): number {
    // Calculate confidence based on:
    // 1. Amount and quality of market data
    // 2. Number of factors considered
    // 3. Consistency of different signals
    const dataQuality = this.calculateDataQuality(marketData);
    const factorConsistency = this.calculateFactorConsistency(factors);
    
    return (dataQuality + factorConsistency) / 2;
  }

  private calculateDataQuality(marketData: MarketData): number {
    let quality = 0;
    
    // Check competitor data
    if (marketData.competitorPrices.length > 0) quality += 0.3;
    
    // Check demand data
    if (marketData.demand >= 0) quality += 0.3;
    
    // Check seasonality data
    if (marketData.seasonality >= 0) quality += 0.2;
    
    // Check segment and region data
    if (marketData.userSegment && marketData.region) quality += 0.2;
    
    return quality;
  }

  private calculateFactorConsistency(factors: OptimizationResult['factors']): number {
    if (factors.length === 0) return 0;

    // Calculate the standard deviation of factor impacts
    const impacts = factors.map(f => f.impact);
    const mean = impacts.reduce((a, b) => a + b, 0) / impacts.length;
    const variance = impacts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / impacts.length;
    const stdDev = Math.sqrt(variance);

    // Higher consistency = lower standard deviation
    // Convert to a 0-1 scale where 0 = high deviation, 1 = low deviation
    return Math.max(0, 1 - (stdDev / 50)); // 50 is an arbitrary scaling factor
  }

  private updatePriceHistory(): void {
    // This method needs to be updated to accept a productId
    // For now, it will throw an error as productId is removed.
    // This is a placeholder for future implementation.
    console.error("productId is no longer available in optimizePrice. Price history update skipped.");
  }

  addPricingRule(rule: PricingRule): void {
    this.pricingRules.push(rule);
    // Sort rules by priority
    this.pricingRules.sort((a, b) => a.priority - b.priority);
  }

  getPricingRules(): PricingRule[] {
    return [...this.pricingRules];
  }

  getPriceHistory(productId: string): { price: number; timestamp: number }[] {
    return this.priceHistory.get(productId) || [];
  }
} 