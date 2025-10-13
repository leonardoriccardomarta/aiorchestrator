import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const MarketingDashboard: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [marketingData, setMarketingData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMarketingData();
  }, []);

  const loadMarketingData = async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      setMarketingData({
        analytics: { totalRevenue: 50000 },
        seo: { score: 85 },
        socialProof: { totalReviews: 150 },
        conversion: { conversionRate: 2.5 }
      });
    } catch (error) {
      console.error('Error loading marketing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderOverviewTab = () => (
    <div>
      <h2>Marketing Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <div className="metric-value">
            {formatCurrency(marketingData.analytics?.totalRevenue || 0)}
          </div>
        </div>
        <div className="metric-card">
          <h3>Conversion Rate</h3>
          <div className="metric-value">
            {formatPercentage(marketingData.conversion?.conversionRate || 0)}
          </div>
        </div>
        <div className="metric-card">
          <h3>SEO Score</h3>
          <div className="metric-value">
            {marketingData.seo?.score || 0}/100
          </div>
        </div>
        <div className="metric-card">
          <h3>Social Proof</h3>
          <div className="metric-value">
            {formatNumber(marketingData.socialProof?.totalReviews || 0)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div>
      <h2>Analytics</h2>
      <div className="analytics-content">
        <p>Analytics data will be displayed here</p>
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div>
      <h2>SEO Performance</h2>
      <div className="seo-content">
        <p>SEO metrics will be displayed here</p>
      </div>
    </div>
  );

  const renderSocialProofTab = () => (
    <div>
      <h2>Social Proof</h2>
      <div className="social-proof-content">
        <p>Social proof data will be displayed here</p>
      </div>
    </div>
  );

  const renderGrowthTab = () => (
    <div>
      <h2>Growth Metrics</h2>
      <div className="growth-content">
        <p>Growth analytics will be displayed here</p>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading marketing data...</div>;
  }

  return (
    <div className="marketing-dashboard">
      <div className="dashboard-header">
        <h1>Marketing Dashboard</h1>
        <p>Comprehensive view of all marketing metrics and performance</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`tab-button ${activeTab === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </button>
        <button
          className={`tab-button ${activeTab === 'social-proof' ? 'active' : ''}`}
          onClick={() => setActiveTab('social-proof')}
        >
          Social Proof
        </button>
        <button
          className={`tab-button ${activeTab === 'growth' ? 'active' : ''}`}
          onClick={() => setActiveTab('growth')}
        >
          Growth
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'seo' && renderSEOTab()}
        {activeTab === 'social-proof' && renderSocialProofTab()}
        {activeTab === 'growth' && renderGrowthTab()}
      </div>
    </div>
  );
};

export default MarketingDashboard; 