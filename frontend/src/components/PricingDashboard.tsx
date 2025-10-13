import React, { useEffect, useState } from 'react';
import { Card, Title, AreaChart, BarChart, DonutChart } from '@tremor/react';
import { ServiceRegistry } from '../services/ServiceRegistry.ts';
import { PricingOptimizationService } from '../services/PricingOptimizationService.ts';

interface PriceHistory {
  price: number;
  timestamp: number;
}

interface OptimizationFactor {
  name: string;
  impact: number;
  explanation: string;
}

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

export const PricingDashboard: React.FC = () => {
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [currentOptimization, setCurrentOptimization] = useState<{
    suggestedPrice: number;
    confidence: number;
    factors: OptimizationFactor[];
  } | null>(null);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const pricingService = ServiceRegistry.getInstance()
        .getService<PricingOptimizationService>('pricing');

      // Load price history
      const history = pricingService.getPriceHistory('default-product');
      setPriceHistory(history);

      // Load pricing rules
      const currentRules = pricingService.getPricingRules();
      setRules(currentRules);

      // Get current optimization
      const result = await pricingService.optimizePrice(100);
      setCurrentOptimization(result);

      setLoading(false);
    };

    loadData();
  }, []);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading pricing data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Title>Pricing Optimization Dashboard</Title>

      {/* Current Optimization */}
      {currentOptimization && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <Title>Suggested Price</Title>
            <div className="mt-4 text-3xl font-bold text-blue-600">
              {formatPrice(currentOptimization.suggestedPrice)}
            </div>
          </Card>

          <Card>
            <Title>Confidence Score</Title>
            <DonutChart
              data={[{ name: 'Confidence', value: currentOptimization.confidence * 100 }]}
              category="value"
              index="name"
              valueFormatter={(value: number) => `${value.toFixed(1)}%`}
              colors={['green']}
            />
          </Card>

          <Card>
            <Title>Impact Factors</Title>
            <BarChart
              data={currentOptimization.factors}
              index="name"
              categories={['impact']}
              colors={['blue']}
              valueFormatter={(value: number) => `${value.toFixed(1)}%`}
              yAxisWidth={48}
            />
          </Card>
        </div>
      )}

      {/* Price History */}
      <Card>
        <Title>Price History</Title>
        <AreaChart
          data={priceHistory.map(h => ({
            date: formatDate(h.timestamp),
            price: h.price,
          }))}
          index="date"
          categories={['price']}
          colors={['blue']}
          valueFormatter={formatPrice}
          yAxisWidth={60}
        />
      </Card>

      {/* Pricing Rules */}
      <Card>
        <Title>Active Pricing Rules</Title>
        <div className="mt-4 space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 bg-gray-50 rounded-lg"
            >
              <div className="font-medium">{rule.name}</div>
              <div className="text-sm text-gray-500">
                Priority: {rule.priority}
              </div>
              <div className="mt-2 text-sm">
                <div>
                  <span className="font-medium">Condition:</span> {rule.condition}
                </div>
                <div>
                  <span className="font-medium">Adjustment:</span>{' '}
                  {rule.adjustment.type === 'percentage'
                    ? `${rule.adjustment.value}%`
                    : formatPrice(rule.adjustment.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimization Factors */}
      {currentOptimization && (
        <Card>
          <Title>Optimization Analysis</Title>
          <div className="mt-4 space-y-4">
            {currentOptimization.factors.map((factor, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="font-medium">{factor.name}</div>
                <div className="text-sm text-blue-600">
                  Impact: {factor.impact.toFixed(1)}%
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {factor.explanation}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}; 