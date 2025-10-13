import React, { useState } from 'react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: number;
  lastUsed: number | null;
}

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  createdAt: number;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'webhooks' | 'notifications'>('general');
  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_prod_123456789',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      lastUsed: Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_dev_987654321',
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      lastUsed: null,
    },
  ]);

  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      url: 'https://example.com/webhook',
      events: ['chatbot.message', 'workflow.completed'],
      status: 'active',
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
  ]);

  const [notifications, setNotifications] = useState({
    email: true,
    desktop: true,
    slack: false,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'api', label: 'API Keys', icon: 'vpn_key' },
    { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  ] as const;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="material-icons mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Organization Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="AI Orchestrator Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>UTC</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">API Keys</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <span className="material-icons mr-2">add</span>
                  Create API Key
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{apiKey.name}</h4>
                      <button className="text-red-600 hover:text-red-700">
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {apiKey.key}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(apiKey.key)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <span className="material-icons">content_copy</span>
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(apiKey.createdAt).toLocaleDateString()}
                      {apiKey.lastUsed && (
                        <> · Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Webhooks</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <span className="material-icons mr-2">add</span>
                  Add Webhook
                </button>
              </div>

              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{webhook.url}</h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            webhook.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {webhook.status}
                        </span>
                      </div>
                      <button className="text-red-600 hover:text-red-700">
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(webhook.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-medium mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          email: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Desktop Notifications</p>
                    <p className="text-sm text-gray-500">
                      Show notifications on your desktop
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.desktop}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          desktop: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Slack Notifications</p>
                    <p className="text-sm text-gray-500">
                      Send notifications to Slack
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.slack}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          slack: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 