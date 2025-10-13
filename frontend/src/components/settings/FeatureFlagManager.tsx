import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleLeft, Settings, Users, Zap, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  targeting: {
    environments: string[];
    roles: string[];
    percentage: number;
  };
  createdAt: string;
  lastUpdated: string;
}

interface Environment {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
}

interface FeatureFlagManagerProps {
  flags: FeatureFlag[];
  environments: Environment[];
  roles: Role[];
  onCreateFlag: (flag: Omit<FeatureFlag, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  onUpdateFlag: (id: string, updates: Partial<FeatureFlag>) => void;
  onDeleteFlag: (id: string) => void;
}

export const FeatureFlagManager: React.FC<FeatureFlagManagerProps> = ({
  flags,
  environments,
  roles,
  onCreateFlag,
  onUpdateFlag,
  onDeleteFlag,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newFlag, setNewFlag] = useState({
    name: '',
    description: '',
    enabled: false,
    targeting: {
      environments: [],
      roles: [],
      percentage: 0,
    },
  });
  const { getAnimationVariant } = useAnimation();

  const handleCreateFlag = () => {
    if (newFlag.name.trim()) {
      onCreateFlag(newFlag);
      setShowCreateModal(false);
      setNewFlag({
        name: '',
        description: '',
        enabled: false,
        targeting: {
          environments: [],
          roles: [],
          percentage: 0,
        },
      });
      setToastMessage('Feature flag created successfully');
      setShowToast(true);
    }
  };

  const handleToggleFlag = (flag: FeatureFlag) => {
    onUpdateFlag(flag.id, { enabled: !flag.enabled });
    setToastMessage(`Feature flag ${flag.enabled ? 'disabled' : 'enabled'}`);
    setShowToast(true);
  };

  const handleDeleteFlag = () => {
    if (selectedFlagId) {
      onDeleteFlag(selectedFlagId);
      setShowDeleteModal(false);
      setSelectedFlagId(null);
      setToastMessage('Feature flag deleted successfully');
      setShowToast(true);
    }
  };

  const handleUpdateTargeting = (
    flag: FeatureFlag,
    type: 'environments' | 'roles',
    value: string,
    checked: boolean
  ) => {
    const newTargeting = { ...flag.targeting };
    if (checked) {
      newTargeting[type] = [...newTargeting[type], value];
    } else {
      newTargeting[type] = newTargeting[type].filter((item) => item !== value);
    }
    onUpdateFlag(flag.id, { targeting: newTargeting });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Feature Flags</CardTitle>
            <Button onClick={() => setShowCreateModal(true)}>
              <Zap className="h-4 w-4 mr-2" />
              Create Flag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {flags.map((flag) => (
                <motion.div
                  key={flag.id}
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
                        <ToggleLeft className={`h-5 w-5 ${flag.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                        <h3 className="font-medium">{flag.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{flag.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={flag.enabled ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleToggleFlag(flag)}
                      >
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedFlagId(flag.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium">Environments</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {environments.map((env) => (
                          <label
                            key={env.id}
                            className="inline-flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={flag.targeting.environments.includes(env.id)}
                              onChange={(e) =>
                                handleUpdateTargeting(flag, 'environments', env.id, e.target.checked)
                              }
                              className="rounded border-gray-300 dark:border-gray-700"
                            />
                            <span>{env.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium">Roles</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {roles.map((role) => (
                          <label
                            key={role.id}
                            className="inline-flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={flag.targeting.roles.includes(role.id)}
                              onChange={(e) =>
                                handleUpdateTargeting(flag, 'roles', role.id, e.target.checked)
                              }
                              className="rounded border-gray-300 dark:border-gray-700"
                            />
                            <span>{role.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <h4 className="text-sm font-medium">Rollout Percentage</h4>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={flag.targeting.percentage}
                        onChange={(e) =>
                          onUpdateFlag(flag.id, {
                            targeting: { ...flag.targeting, percentage: parseInt(e.target.value, 10) },
                          })
                        }
                        className="w-full"
                      />
                      <div className="text-sm text-gray-500 mt-1">
                        {flag.targeting.percentage}% of users
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">
                    Last updated: {flag.lastUpdated}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {flags.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No feature flags created yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Feature Flag"
        description="Create a new feature flag with targeting rules."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="flagName" className="block text-sm font-medium mb-1">
              Flag Name
            </label>
            <input
              id="flagName"
              type="text"
              value={newFlag.name}
              onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              placeholder="e.g., enable_new_dashboard"
            />
          </div>

          <div>
            <label htmlFor="flagDescription" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="flagDescription"
              value={newFlag.description}
              onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              rows={3}
              placeholder="Describe what this feature flag controls..."
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Initial State</h4>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newFlag.enabled}
                onChange={(e) => setNewFlag({ ...newFlag, enabled: e.target.checked })}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span>Enable flag</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFlag} disabled={!newFlag.name.trim()}>
              Create Flag
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Feature Flag"
        description="Are you sure you want to delete this feature flag? This action cannot be undone."
      >
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteFlag}>
            Delete
          </Button>
        </div>
      </Modal>

      {showToast && (
        <Toast
          id="feature-flag-toast"
          title="Success"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}; 