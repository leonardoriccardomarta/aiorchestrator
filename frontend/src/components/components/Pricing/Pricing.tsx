import React, { useState } from "react";
import PricingColumn from "./PricingColumn";
import { tiers, trialConfig } from "../../../data/pricing";

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Choose Your AI Success Plan
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Flexible pricing that grows with your business
        </p>
        
        {/* Trial Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-semibold text-indigo-600">Free Trial Available</span>
          </div>
          <p className="text-sm text-slate-600">
            {trialConfig.duration} days of complete Pro access • No commitment • Cancel anytime
          </p>
        </div>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-medium ${!isYearly ? 'text-indigo-600' : 'text-slate-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isYearly ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
            aria-label="Toggle between monthly and yearly billing"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-indigo-600' : 'text-slate-500'}`}>
            Yearly
          </span>
          {/* Savings badge */}
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            Save 20%
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier) => (
          <PricingColumn
            key={tier.name}
            tier={tier}
            highlight={tier.popular}
            isYearly={isYearly}
          />
        ))}
      </div>
      
      {/* Bottom CTA */}
      <div className="text-center mt-12 p-8 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Need a custom solution?</h3>
        <p className="text-slate-600 mb-4">
          Enterprise customers with 500k+ messages/month get custom pricing
        </p>
        <button 
          onClick={() => window.open('https://calendly.com/your-calendar', '_blank')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
        >
          Schedule a Call
        </button>
      </div>
      
      {/* Trust Signals */}
      <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>99.9% Uptime</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Setup in 24 hours</span>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
