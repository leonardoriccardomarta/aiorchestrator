import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plug, Plus, Settings, Link2, Trash2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface Integration {
  id: string;
  name: string;
  provider: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  lastSync?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  lastDelivery?: {
    status: 'success' | 'failed';
    timestamp: string;
    statusCode?: number;
  };
}

interface IntegrationManagerProps {
  integrations: Integration[];
  webhooks: Webhook[];
  availableEvents: string[];
  onDisconnectIntegration: (id: string) => void;
  onCreateWebhook: (webhook: Omit<Webhook, 'id'>) => void;
  onUpdateWebhook: (id: string, updates: Partial<Webhook>) => void;
  onDeleteWebhook: (id: string) => void;
  onTestWebhook: (id: string) => void;
}

export const IntegrationManager: React.FC<IntegrationManagerProps> = ({
  integrations,
  webhooks,
  availableEvents,
  onDisconnectIntegration,
  onCreateWebhook,
  onUpdateWebhook,
  onDeleteWebhook,
  onTestWebhook,
}) => {
  const [_showConnectModal, setShowConnectModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [_selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    active: true,
  });
  const { getAnimationVariant } = useAnimation();

  const handleCreateWebhook = () => {
    if (newWebhook.name.trim() && newWebhook.url.trim()) {
      onCreateWebhook(newWebhook);
      setShowWebhookModal(false);
      setNewWebhook({
        name: '',
        url: '',
        events: [],
        active: true,
      });
      setToastMessage('Webhook created successfully');
      setShowToast(true);
    }
  };

  const handleDeleteWebhook = () => {
    if (selectedWebhookId) {
      onDeleteWebhook(selectedWebhookId);
      setShowDeleteModal(false);
      setSelectedWebhookId(null);
      setToastMessage('Webhook deleted successfully');
      setShowToast(true);
    }
  };

  const handleTestWebhook = (id: string) => {
    onTestWebhook(id);
    setToastMessage('Webhook test triggered');
    setShowToast(true);
  };

  const getStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-gray-400';
      case 'error':
        return 'text-red-500';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Integrations</CardTitle>
              <Button onClick={() => setShowConnectModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Integration
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {integrations.map((integration) => (
                  <motion.div
                    key={integration.id}
                    variants={getAnimationVariant('listItem')}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Plug className={`h-5 w-5 ${getStatusColor(integration.status)}`} />
                          <h3 className="font-medium">{integration.name}</h3>
                          <span className="text-sm text-gray-500">{integration.provider}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {integration.status === 'connected' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDisconnectIntegration(integration.id)}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedIntegrationId(integration.id)}
                          >
                            Connect
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedIntegrationId(integration.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {integration.lastSync && (
                      <div className="text-sm text-gray-500">
                        Last synced: {integration.lastSync}
                      </div>
                    )}

                    {integration.error && (
                      <div className="mt-2 text-sm text-red-500">
                        Error: {integration.error}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {integrations.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No integrations configured
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Webhooks</CardTitle>
              <Button onClick={() => setShowWebhookModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {webhooks.map((webhook) => (
                  <motion.div
                    key={webhook.id}
                    variants={getAnimationVariant('listItem')}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    layout
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Link2 className="h-5 w-5 text-gray-500" />
                          <h3 className="font-medium">{webhook.name}</h3>
                          {webhook.active ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{webhook.url}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onUpdateWebhook(webhook.id, { active: !webhook.active });
                          }}
                        >
                          {webhook.active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedWebhookId(webhook.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Events</h4>
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    {webhook.lastDelivery && (
                      <div className="mt-4 text-sm">
                        <span className="text-gray-500">Last delivery: </span>
                        <span
                          className={
                            webhook.lastDelivery.status === 'success'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {webhook.lastDelivery.status}
                          {webhook.lastDelivery.statusCode &&
                            ` (${webhook.lastDelivery.statusCode})`}
                        </span>
                        <span className="text-gray-500 ml-2">
                          at {webhook.lastDelivery.timestamp}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {webhooks.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No webhooks configured
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showWebhookModal}
        onClose={() => setShowWebhookModal(false)}
        title="Add Webhook"
        description="Configure a new webhook endpoint to receive event notifications."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="webhookName" className="block text-sm font-medium mb-1">
              Webhook Name
            </label>
            <input
              id="webhookName"
              type="text"
              value={newWebhook.name}
              onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              placeholder="e.g., Order Notifications"
            />
          </div>

          <div>
            <label htmlFor="webhookUrl" className="block text-sm font-medium mb-1">
              Endpoint URL
            </label>
            <input
              id="webhookUrl"
              type="url"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              placeholder="https://api.example.com/webhooks"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Events</h4>
            <div className="space-y-2">
              {availableEvents.map((event) => (
                <label key={event} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes(event)}
                    onChange={(e) => {
                      const newEvents = e.target.checked
                        ? [...newWebhook.events, event]
                        : newWebhook.events.filter((e) => e !== event);
                      setNewWebhook({ ...newWebhook, events: newEvents });
                    }}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                  <span>{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="ghost" onClick={() => setShowWebhookModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWebhook}
              disabled={!newWebhook.name.trim() || !newWebhook.url.trim()}
            >
              Create Webhook
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Webhook"
        description="Are you sure you want to delete this webhook? This action cannot be undone."
      >
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteWebhook}>
            Delete
          </Button>
        </div>
      </Modal>

      {showToast && (
        <Toast
          id="integration-toast"
          title="Success"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}; 