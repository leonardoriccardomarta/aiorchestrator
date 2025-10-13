import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Eye, EyeOff, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
  expiresAt?: string;
}

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  availablePermissions: Permission[];
  onCreateKey: (name: string, permissions: string[]) => void;
  onDeleteKey: (id: string) => void;
  onRegenerateKey: (id: string) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  apiKeys,
  availablePermissions,
  onCreateKey,
  onDeleteKey,
  onRegenerateKey,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const { getAnimationVariant } = useAnimation();

  const handleCreateKey = () => {
    if (newKeyName.trim()) {
      onCreateKey(newKeyName, Array.from(selectedPermissions));
      setShowCreateModal(false);
      setNewKeyName('');
      setSelectedPermissions(new Set());
      setToastMessage('API key created successfully');
      setShowToast(true);
    }
  };

  const handleDeleteKey = () => {
    if (selectedKeyId) {
      onDeleteKey(selectedKeyId);
      setShowDeleteModal(false);
      setSelectedKeyId(null);
      setToastMessage('API key deleted successfully');
      setShowToast(true);
    }
  };

  const handleRegenerateKey = (id: string) => {
    onRegenerateKey(id);
    setToastMessage('API key regenerated successfully');
    setShowToast(true);
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (visibleKeys.has(id)) {
      newVisibleKeys.delete(id);
    } else {
      newVisibleKeys.add(id);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage('API key copied to clipboard');
      setShowToast(true);
    } catch (err) {
      setToastMessage('Failed to copy API key');
      setShowToast(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>API Keys</CardTitle>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {apiKeys.map((apiKey) => (
                <motion.div
                  key={apiKey.id}
                  variants={getAnimationVariant('listItem')}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{apiKey.name}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {apiKey.createdAt}
                        {apiKey.lastUsed && ` • Last used: ${apiKey.lastUsed}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerateKey(apiKey.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedKeyId(apiKey.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 font-mono text-sm mb-4">
                    {visibleKeys.has(apiKey.id) ? (
                      apiKey.key
                    ) : (
                      '*'.repeat(apiKey.key.length)
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {apiKey.permissions.map((permId) => {
                        const permission = availablePermissions.find(p => p.id === permId);
                        return permission ? (
                          <span
                            key={permId}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                          >
                            {permission.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {apiKeys.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No API keys created yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create API Key"
        description="Create a new API key with specific permissions."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="keyName" className="block text-sm font-medium mb-1">
              Key Name
            </label>
            <input
              id="keyName"
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              placeholder="e.g., Production API Key"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.has(permission.id)}
                    onChange={(e) => {
                      const newPermissions = new Set(selectedPermissions);
                      if (e.target.checked) {
                        newPermissions.add(permission.id);
                      } else {
                        newPermissions.delete(permission.id);
                      }
                      setSelectedPermissions(newPermissions);
                    }}
                    className="rounded border-gray-300 dark:border-gray-700"
                  />
                  <div>
                    <div className="font-medium">{permission.name}</div>
                    <div className="text-sm text-gray-500">{permission.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey} disabled={!newKeyName.trim()}>
              Create Key
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete API Key"
        description="Are you sure you want to delete this API key? This action cannot be undone."
      >
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteKey}>
            Delete
          </Button>
        </div>
      </Modal>

      {showToast && (
        <Toast
          id="api-key-toast"
          title="Success"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}; 