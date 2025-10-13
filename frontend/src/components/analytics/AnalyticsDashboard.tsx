import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import conversionAnalyticsService from '../../services/analytics/ConversionAnalyticsService';

const AnalyticsDashboard: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Load analytics data from services
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      conversionAnalyticsService.getConversionMetrics(startDate, endDate);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div>
      <h2>Analytics Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>User Behavior</h3>
          <p>User behavior analytics data will be displayed here</p>
        </div>
        <div className="metric-card">
          <h3>Conversion Analytics</h3>
          <p>Conversion analytics data will be displayed here</p>
        </div>
      </div>
    </div>
  );

  const renderUserBehaviorTab = () => (
    <div>
      <h2>User Behavior Analytics</h2>
      <p>Detailed user behavior analytics will be displayed here</p>
    </div>
  );

  const renderConversionTab = () => (
    <div>
      <h2>Conversion Analytics</h2>
      <p>Detailed conversion analytics will be displayed here</p>
    </div>
  );

  if (isLoading) {
    return <div>Loading analytics data...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive analytics and insights</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'user-behavior' ? 'active' : ''}`}
          onClick={() => setActiveTab('user-behavior')}
        >
          User Behavior
        </button>
        <button 
          className={`tab-button ${activeTab === 'conversion' ? 'active' : ''}`}
          onClick={() => setActiveTab('conversion')}
        >
          Conversion
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'user-behavior' && renderUserBehaviorTab()}
        {activeTab === 'conversion' && renderConversionTab()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 