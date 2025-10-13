import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import growthMarketingService from '../../services/growth/GrowthMarketingService';

const EmailMarketingManager: React.FC = () => {
  const { t: _t } = useTranslation();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    templateId: '',
    segmentId: '',
    scheduledDate: new Date(),
    type: 'newsletter'
  });

  useEffect(() => {
    loadEmailMarketingData();
  }, []);

  const loadEmailMarketingData = async () => {
    setIsLoading(true);
    try {
      const campaigns = growthMarketingService.getEmailCampaigns();
      const subscribers = growthMarketingService.getSubscribers();
      setCampaigns(campaigns || []);
      setSubscribers(subscribers || []);
      setTemplates([]); // Mock data for now
    } catch (error) {
      console.error('Error loading email marketing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) return;

    const campaign = growthMarketingService.createEmailCampaign({
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      template: newCampaign.templateId,
      type: newCampaign.type as any,
      status: 'draft',
      targetAudience: { segments: ['all'], filters: {}, estimatedRecipients: 0 },
      settings: {
        fromName: 'AI Orchestrator Team',
        fromEmail: 'noreply@aiorchestrator.com',
        trackOpens: true,
        trackClicks: true,
        enableUnsubscribe: true
      }
    });

    setCampaigns([...campaigns, campaign]);
    setShowCreateForm(false);
    setNewCampaign({
      name: '',
      subject: '',
      content: '',
      templateId: '',
      segmentId: '',
      scheduledDate: new Date(),
      type: 'newsletter'
    });
  };

  const handleSendCampaign = (campaignId: string) => {
    growthMarketingService.sendEmailCampaign(campaignId);
    loadEmailMarketingData();
  };

  const handleAddSubscriber = (email: string, firstName?: string, lastName?: string) => {
    growthMarketingService.addEmailSubscriber({
      email,
      firstName: firstName || '',
      lastName: lastName || '',
      segments: ['general'],
      tags: ['new_subscriber'],
      metadata: {}
    });
    loadEmailMarketingData();
  };

  const renderCampaignsTab = () => (
    <div>
      <div className="campaigns-header">
        <h2>Email Campaigns</h2>
        <button onClick={() => setShowCreateForm(true)}>Create Campaign</button>
      </div>

      {showCreateForm && (
        <div className="create-campaign-form">
          <h3>Create New Campaign</h3>
          <input
            type="text"
            placeholder="Campaign Name"
            value={newCampaign.name}
            onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subject Line"
            value={newCampaign.subject}
            onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
          />
          <textarea
            placeholder="Email Content"
            value={newCampaign.content}
            onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
          />
          <select
            value={newCampaign.type}
            onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
          >
            <option value="newsletter">Newsletter</option>
            <option value="promotional">Promotional</option>
            <option value="transactional">Transactional</option>
          </select>
          <div className="form-actions">
            <button onClick={handleCreateCampaign}>Create Campaign</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="campaigns-list">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            <h3>{campaign.name}</h3>
            <p><strong>Subject:</strong> {campaign.subject}</p>
            <p><strong>Type:</strong> {campaign.type}</p>
            <p><strong>Status:</strong> {campaign.status}</p>
            <p><strong>Recipients:</strong> {campaign.recipientCount}</p>
            <p><strong>Open Rate:</strong> {campaign.openRate}%</p>
            <p><strong>Click Rate:</strong> {campaign.clickRate}%</p>
            <div className="campaign-actions">
              {campaign.status === 'draft' && (
                <button onClick={() => handleSendCampaign(campaign.id)}>
                  Send Campaign
                </button>
              )}
              <button>View Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubscribersTab = () => (
    <div>
      <h2>Email Subscribers</h2>
      <div className="subscribers-stats">
        <div className="stat-card">
          <h3>Total Subscribers</h3>
          <div className="stat-value">{subscribers.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Subscribers</h3>
          <div className="stat-value">
            {subscribers.filter(s => s.status === 'active').length}
          </div>
        </div>
        <div className="stat-card">
          <h3>Unsubscribed</h3>
          <div className="stat-value">
            {subscribers.filter(s => s.status === 'unsubscribed').length}
          </div>
        </div>
      </div>

      <div className="add-subscriber-form">
        <h3>Add New Subscriber</h3>
        <input
          type="email"
          placeholder="Email Address"
          id="new-subscriber-email"
        />
        <input
          type="text"
          placeholder="First Name (optional)"
          id="new-subscriber-firstname"
        />
        <input
          type="text"
          placeholder="Last Name (optional)"
          id="new-subscriber-lastname"
        />
        <button onClick={() => {
          const email = (document.getElementById('new-subscriber-email') as HTMLInputElement).value;
          const firstName = (document.getElementById('new-subscriber-firstname') as HTMLInputElement).value;
          const lastName = (document.getElementById('new-subscriber-lastname') as HTMLInputElement).value;
          if (email) {
            handleAddSubscriber(email, firstName, lastName);
            (document.getElementById('new-subscriber-email') as HTMLInputElement).value = '';
            (document.getElementById('new-subscriber-firstname') as HTMLInputElement).value = '';
            (document.getElementById('new-subscriber-lastname') as HTMLInputElement).value = '';
          }
        }}>
          Add Subscriber
        </button>
      </div>

      <div className="subscribers-list">
        {subscribers.map(subscriber => (
          <div key={subscriber.id} className="subscriber-card">
            <h4>{subscriber.email}</h4>
            <p><strong>Name:</strong> {subscriber.firstName} {subscriber.lastName}</p>
            <p><strong>Status:</strong> {subscriber.status}</p>
            <p><strong>Segments:</strong> {subscriber.segments.join(', ')}</p>
            <p><strong>Tags:</strong> {subscriber.tags.join(', ')}</p>
            <p><strong>Subscribed:</strong> {new Date(subscriber.subscribedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div>
      <h2>Email Templates</h2>
      <div className="templates-list">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <h3>{template.name}</h3>
            <p><strong>Type:</strong> {template.type}</p>
            <p><strong>Subject:</strong> {template.subject}</p>
            <div className="template-preview">
              <h4>Preview:</h4>
              <div dangerouslySetInnerHTML={{ __html: template.content }} />
            </div>
            <div className="template-actions">
              <button>Edit Template</button>
              <button>Duplicate</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div>
      <h2>Email Analytics</h2>
      <div className="analytics-overview">
        <div className="metric-card">
          <h3>Total Sent</h3>
          <div className="metric-value">
            {campaigns.reduce((sum, c) => sum + (c.recipientCount || 0), 0)}
          </div>
        </div>
        <div className="metric-card">
          <h3>Average Open Rate</h3>
          <div className="metric-value">
            {campaigns.length > 0
              ? (campaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.length).toFixed(1)
              : '0'}%
          </div>
        </div>
        <div className="metric-card">
          <h3>Average Click Rate</h3>
          <div className="metric-value">
            {campaigns.length > 0
              ? (campaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / campaigns.length).toFixed(1)
              : '0'}%
          </div>
        </div>
        <div className="metric-card">
          <h3>Unsubscribe Rate</h3>
          <div className="metric-value">
            {campaigns.length > 0
              ? (campaigns.reduce((sum, c) => sum + (c.unsubscribeRate || 0), 0) / campaigns.length).toFixed(1)
              : '0'}%
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading email marketing data...</div>;
  }

  return (
    <div className="email-marketing-manager">
      <div className="manager-header">
        <h1>Email Marketing Manager</h1>
        <p>Create and manage email campaigns, subscribers, and templates</p>
      </div>

      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
        <button
          className={`tab-button ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          Subscribers
        </button>
        <button
          className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="manager-content">
        {activeTab === 'campaigns' && renderCampaignsTab()}
        {activeTab === 'subscribers' && renderSubscribersTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default EmailMarketingManager; 