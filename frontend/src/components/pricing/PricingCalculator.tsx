import React, { useState, useEffect } from 'react';
import { tiers } from '../../data/pricing';

interface CalculatorState {
  messages: number;
  chatbots: number;
  teamMembers: number;
  channels: number;
  billingCycle: 'monthly' | 'yearly';
}

const PricingCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    messages: 5000,
    chatbots: 3,
    teamMembers: 3,
    channels: 1,
    billingCycle: 'monthly'
  });

  const [recommendedPlan, setRecommendedPlan] = useState<string>('');

  useEffect(() => {
    // Find the recommended plan based on usage
    const plan = tiers.find(tier => 
      state.messages <= tier.limits.messages &&
      state.chatbots <= tier.limits.chatbots &&
      state.teamMembers <= tier.limits.teamMembers &&
      state.channels <= tier.limits.channels
    );

    setRecommendedPlan(plan?.name.toLowerCase() || 'enterprise');
  }, [state]);

  const calculateCost = (plan: typeof tiers[0]) => {
    let basePrice = state.billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
    let totalCost = basePrice;
    let overages: string[] = [];

    // Calculate message overage
    if (state.messages > plan.limits.messages) {
      const overage = state.messages - plan.limits.messages;
      const overageCost = overage * 0.003; // $0.003 per message
      totalCost += overageCost;
      overages.push(`+${overage.toLocaleString()} messages: $${overageCost.toFixed(2)}`);
    }

    // Calculate team member overage
    if (state.teamMembers > plan.limits.teamMembers) {
      const overage = state.teamMembers - plan.limits.teamMembers;
      const overageCost = overage * 39; // $39 per user/month
      totalCost += overageCost;
      overages.push(`+${overage} team members: $${overageCost}`);
    }

    // Calculate channel overage
    if (state.channels > plan.limits.channels) {
      const overage = state.channels - plan.limits.channels;
      const overageCost = overage * 49; // $49 per channel
      totalCost += overageCost;
      overages.push(`+${overage} channels: $${overageCost}`);
    }

    return { totalCost, overages };
  };

  const updateState = (field: keyof CalculatorState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pricing Calculator</h2>
        <p className="text-slate-600">Calculate your monthly cost based on your usage</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Inputs */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Usage</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Messages per month
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={state.messages}
                onChange={(e) => updateState('messages', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-24 text-right font-medium">
                {state.messages.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of chatbots
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="100"
                value={state.chatbots}
                onChange={(e) => updateState('chatbots', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 text-right font-medium">
                {state.chatbots}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Team members
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="50"
                value={state.teamMembers}
                onChange={(e) => updateState('teamMembers', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 text-right font-medium">
                {state.teamMembers}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Integration channels
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="10"
                value={state.channels}
                onChange={(e) => updateState('channels', parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 text-right font-medium">
                {state.channels}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Billing cycle
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => updateState('billingCycle', 'monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => updateState('billingCycle', 'yearly')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  state.billingCycle === 'yearly'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Yearly (20% off)
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Recommended Plan</h3>
          
          {tiers.map((tier) => {
            const { totalCost, overages } = calculateCost(tier);
            const isRecommended = tier.name.toLowerCase() === recommendedPlan;
            
            return (
              <div
                key={tier.name}
                className={`border-2 rounded-lg p-6 transition-all ${
                  isRecommended
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{tier.name}</h4>
                    {isRecommended && (
                      <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      ${totalCost.toFixed(0)}
                    </div>
                    <div className="text-sm text-slate-600">
                      per {state.billingCycle === 'yearly' ? 'year' : 'month'}
                    </div>
                  </div>
                </div>

                {overages.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm font-medium text-yellow-800 mb-1">Overage charges:</div>
                    {overages.map((overage, index) => (
                      <div key={index} className="text-xs text-yellow-700">{overage}</div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {tier.features.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                    isRecommended
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isRecommended ? 'Start Free Trial' : 'Choose Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings Note */}
      {state.billingCycle === 'yearly' && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              Save 20% with yearly billing - that's ${(tiers.find(t => t.name.toLowerCase() === recommendedPlan)?.price || 0) * 12 * 0.2} per year!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;

