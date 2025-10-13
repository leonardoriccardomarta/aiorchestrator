import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { growthMarketingService } from '../../services/growth/GrowthMarketingService';

const ReferralProgramManager: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [referralPrograms, setReferralPrograms] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    referrerReward: {
      type: 'percentage' as const,
      value: 10,
      currency: 'USD'
    },
    refereeReward: {
      type: 'credits' as const,
      value: 50,
      currency: 'USD'
    },
    requirements: {
      minimumPurchase: 0,
      validDays: 30,
      maxReferrals: 10
    }
  });

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    setIsLoading(true);
    try {
      const programs = growthMarketingService.getReferralPrograms();
      const allReferrals = growthMarketingService.getReferrals();
      const growthAnalytics = growthMarketingService.getGrowthAnalytics();

      setReferralPrograms(programs);
      setReferrals(allReferrals);
      setAnalytics(growthAnalytics.referralMetrics);
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProgram = () => {
    if (!newProgram.name || !newProgram.description) return;

    const program = growthMarketingService.createReferralProgram({
      name: newProgram.name,
      description: newProgram.description,
      isActive: true,
      rewards: {
        referrer: newProgram.referrerReward,
        referee: newProgram.refereeReward
      },
      conditions: {
        minimumPurchase: newProgram.requirements.minimumPurchase,
        expirationDays: newProgram.requirements.validDays
      },
      tracking: {
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referralLink: `https://aiorchestrator.com/ref/${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        trackingPixel: `https://aiorchestrator.com/track/referral`
      }
    });

    setReferralPrograms([...referralPrograms, program]);
    setShowCreateForm(false);
    setNewProgram({
      name: '',
      description: '',
      referrerReward: {
        type: 'percentage' as const,
        value: 10,
        currency: 'USD'
      },
      refereeReward: {
        type: 'credits' as const,
        value: 50,
        currency: 'USD'
      },
      requirements: {
        minimumPurchase: 0,
        validDays: 30,
        maxReferrals: 10
      }
    });
  };

  const handleActivateProgram = (programId: string) => {
    // Mock activation - in real implementation this would call a service method
    console.log('Activating program:', programId);
    loadReferralData();
  };

  const handleDeactivateProgram = (programId: string) => {
    // Mock deactivation - in real implementation this would call a service method
    console.log('Deactivating program:', programId);
    loadReferralData();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const renderOverviewTab = () => (
    <div>
      <h2>Referral Program Overview</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Active Programs</h3>
          <div className="metric-value">
            {referralPrograms.filter(program => program.status === 'active').length}
          </div>
        </div>
        <div className="metric-card">
          <h3>Total Referrals</h3>
          <div className="metric-value">{formatNumber(analytics.totalReferrals || 0)}</div>
        </div>
        <div className="metric-card">
          <h3>Conversion Rate</h3>
          <div className="metric-value">{formatPercentage(analytics.conversionRate || 0)}</div>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <div className="metric-value">{formatCurrency(analytics.totalRevenue || 0, 'USD')}</div>
        </div>
      </div>
    </div>
  );

  const renderProgramsTab = () => (
    <div>
      <div className="programs-header">
        <h2>Referral Programs</h2>
        <button onClick={() => setShowCreateForm(true)}>Create Program</button>
      </div>

      {showCreateForm && (
        <div className="create-program-form">
          <h3>Create New Referral Program</h3>
          <input
            type="text"
            placeholder="Program Name"
            value={newProgram.name}
            onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newProgram.description}
            onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
          />
          <div className="rewards-section">
            <h4>Referrer Reward</h4>
            <select
              value={newProgram.referrerReward.type}
              onChange={(e) => setNewProgram({
                ...newProgram,
                referrerReward: { ...newProgram.referrerReward, type: e.target.value as any }
              })}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="credits">Credits</option>
            </select>
            <input
              type="number"
              placeholder="Value"
              value={newProgram.referrerReward.value}
              onChange={(e) => setNewProgram({
                ...newProgram,
                referrerReward: { ...newProgram.referrerReward, value: parseFloat(e.target.value) }
              })}
            />
          </div>
          <div className="rewards-section">
            <h4>Referee Reward</h4>
            <select
              value={newProgram.refereeReward.type}
              onChange={(e) => setNewProgram({
                ...newProgram,
                refereeReward: { ...newProgram.refereeReward, type: e.target.value as any }
              })}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="credits">Credits</option>
            </select>
            <input
              type="number"
              placeholder="Value"
              value={newProgram.refereeReward.value}
              onChange={(e) => setNewProgram({
                ...newProgram,
                refereeReward: { ...newProgram.refereeReward, value: parseFloat(e.target.value) }
              })}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleCreateProgram}>Create Program</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="programs-list">
        {referralPrograms.map(program => (
          <div key={program.id} className="program-card">
            <h3>{program.name}</h3>
            <p>{program.description}</p>
            <div className="program-stats">
              <div className="stat">
                <span>Referrer Reward:</span>
                <span>
                  {program.rewards?.referrer?.type === 'percentage' && `${program.rewards.referrer.value}%`}
                  {program.rewards?.referrer?.type === 'fixed' && formatCurrency(program.rewards.referrer.value, program.rewards.referrer.currency || 'USD')}
                  {program.rewards?.referrer?.type === 'credits' && `${program.rewards.referrer.value} credits`}
                </span>
              </div>
              <div className="stat">
                <span>Referee Reward:</span>
                <span>
                  {program.rewards?.referee?.type === 'percentage' && `${program.rewards.referee.value}%`}
                  {program.rewards?.referee?.type === 'fixed' && formatCurrency(program.rewards.referee.value, program.rewards.referee.currency || 'USD')}
                  {program.rewards?.referee?.type === 'credits' && `${program.rewards.referee.value} credits`}
                </span>
              </div>
              <div className="stat">
                <span>Status:</span>
                <span className={`status ${program.status}`}>{program.status}</span>
              </div>
            </div>
            <div className="program-actions">
              {program.status === 'inactive' && (
                <button onClick={() => handleActivateProgram(program.id)}>
                  Activate Program
                </button>
              )}
              {program.status === 'active' && (
                <button onClick={() => handleDeactivateProgram(program.id)}>
                  Deactivate Program
                </button>
              )}
              <button>View Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReferralsTab = () => (
    <div>
      <h2>Referral History</h2>
      <div className="referrals-list">
        {referrals.map(referral => (
          <div key={referral.id} className="referral-card">
            <div className="referral-info">
              <h4>Referral #{referral.id}</h4>
              <p><strong>Referrer:</strong> {referral.referrer?.email}</p>
              <p><strong>Referee:</strong> {referral.referee?.email}</p>
              <p><strong>Status:</strong> <span className={`status ${referral.status}`}>{referral.status}</span></p>
              <p><strong>Created:</strong> {new Date(referral.createdAt).toLocaleDateString()}</p>
              {referral.completedAt && (
                <p><strong>Completed:</strong> {new Date(referral.completedAt).toLocaleDateString()}</p>
              )}
            </div>
            <div className="referral-rewards">
              <div className="reward">
                <span>Referrer Reward:</span>
                <span>
                  {referral.referrerReward?.type === 'percentage' && `${referral.referrerReward.value}%`}
                  {referral.referrerReward?.type === 'fixed' && formatCurrency(referral.referrerReward.value, referral.referrerReward.currency)}
                  {referral.referrerReward?.type === 'credits' && `${referral.referrerReward.value} credits`}
                </span>
              </div>
              <div className="reward">
                <span>Referee Reward:</span>
                <span>
                  {referral.refereeReward?.type === 'percentage' && `${referral.refereeReward.value}%`}
                  {referral.refereeReward?.type === 'fixed' && formatCurrency(referral.refereeReward.value, referral.refereeReward.currency)}
                  {referral.refereeReward?.type === 'credits' && `${referral.refereeReward.value} credits`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading referral data...</div>;
  }

  return (
    <div className="referral-program-manager">
      <div className="manager-header">
        <h1>Referral Program Manager</h1>
        <p>Create and manage referral programs to drive growth</p>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          Programs
        </button>
        <button
          className={`tab-button ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
        >
          Referrals
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'programs' && renderProgramsTab()}
        {activeTab === 'referrals' && renderReferralsTab()}
      </div>
    </div>
  );
};

export default ReferralProgramManager; 