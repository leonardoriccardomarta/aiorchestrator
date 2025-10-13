import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { growthMarketingService } from '../../services/growth/GrowthMarketingService';

const ABTestingManager: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [abTests, setAbTests] = useState<any[]>([]);

  useEffect(() => {
    loadABTestData();
  }, []);

  const loadABTestData = async () => {
    setIsLoading(true);
    try {
      const tests = growthMarketingService.getABTests();
      setAbTests(tests);
    } catch (error) {
      console.error('Error loading AB test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = (testId: string) => {
    growthMarketingService.startABTest(testId);
    loadABTestData();
  };

  const handleStopTest = (testId: string) => {
    growthMarketingService.stopABTest(testId);
    loadABTestData();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const renderOverviewTab = () => (
    <div>
      <h2>AB Testing Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Active Tests</h3>
          <div className="metric-value">
            {abTests.filter(test => test.status === 'running').length}
          </div>
        </div>
        <div className="metric-card">
          <h3>Completed Tests</h3>
          <div className="metric-value">
            {abTests.filter(test => test.status === 'completed').length}
          </div>
        </div>
        <div className="metric-card">
          <h3>Total Tests</h3>
          <div className="metric-value">{abTests.length}</div>
        </div>
      </div>
    </div>
  );

  const renderTestsTab = () => (
    <div>
      <h2>AB Tests</h2>
      <div className="tests-list">
        {abTests.map(test => (
          <div key={test.id} className="test-card">
            <h3>{test.name}</h3>
            <p>{test.description}</p>
            <div className="test-status">
              Status: {test.status}
            </div>
            <div className="test-actions">
              {test.status === 'draft' && (
                <button onClick={() => handleStartTest(test.id)}>
                  Start Test
                </button>
              )}
              {test.status === 'running' && (
                <button onClick={() => handleStopTest(test.id)}>
                  Stop Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResultsTab = () => (
    <div>
      <h2>Test Results</h2>
      <div className="results-list">
        {abTests.filter(test => test.status === 'completed' || test.status === 'winner_declared').map(test => (
          <div key={test.id} className="result-card">
            <h3>{test.name}</h3>
            <div className="variants-results">
              {test.results?.variantResults?.map((result: any) => {
                const variant = test.variants.find((v: any) => v.id === result.variantId);
                return (
                  <div key={result.variantId} className={`variant-result ${result.isWinner ? 'winner' : ''}`}>
                    <h4>{variant?.name}</h4>
                    <p>Participants: {formatNumber(result.participants)}</p>
                    <p>Conversion Rate: {formatPercentage(result.conversionRate)}</p>
                    <p>Confidence: {formatPercentage(result.confidence)}</p>
                  </div>
                );
              })}
            </div>
            {test.status === 'winner_declared' && test.results?.winner && (
              <div className="winner-announcement">
                <span className="winner-badge">🏆 Winner: {test.variants.find((v: any) => v.id === test.results.winner)?.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading AB test data...</div>;
  }

  return (
    <div className="ab-testing-manager">
      <div className="manager-header">
        <h1>AB Testing Manager</h1>
        <p>Create and manage A/B tests to optimize your campaigns</p>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          Tests
        </button>
        <button
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'tests' && renderTestsTab()}
        {activeTab === 'results' && renderResultsTab()}
      </div>
    </div>
  );
};

export default ABTestingManager; 