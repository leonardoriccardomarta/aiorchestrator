import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, Edit, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RoleManagerProps {
  roles: Role[];
  permissions: Permission[];
  onCreateRole: (role: Omit<Role, 'id' | 'userCount' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRole: (id: string, updates: Partial<Role>) => void;
  onDeleteRole: (id: string) => void;
}

export const RoleManager: React.FC<RoleManagerProps> = ({
  roles,
  permissions,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });
  const { getAnimationVariant } = useAnimation();

  const selectedRole = selectedRoleId ? roles.find(r => r.id === selectedRoleId) : null;
  const permissionsByCategory = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleCreateRole = () => {
    if (newRole.name.trim()) {
      onCreateRole(newRole);
      setShowCreateModal(false);
      setNewRole({
        name: '',
        description: '',
        permissions: [],
      });
      setToastMessage('Role created successfully');
      setShowToast(true);
    }
  };

  const handleUpdateRole = () => {
    if (selectedRoleId) {
      onUpdateRole(selectedRoleId, newRole);
      setShowEditModal(false);
      setSelectedRoleId(null);
      setToastMessage('Role updated successfully');
      setShowToast(true);
    }
  };

  const handleDeleteRole = () => {
    if (selectedRoleId) {
      onDeleteRole(selectedRoleId);
      setShowDeleteModal(false);
      setSelectedRoleId(null);
      setToastMessage('Role deleted successfully');
      setShowToast(true);
    }
  };

  const handleEditRole = (role: Role) => {
    setSelectedRoleId(role.id);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowEditModal(true);
  };

  const renderPermissionSelector = (
    currentPermissions: string[],
    onChange: (permissions: string[]) => void
  ) => (
    <div className="space-y-6">
      {Object.entries(permissionsByCategory).map(([category, perms]) => (
        <div key={category}>
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            {category}
          </h4>
          <div className="space-y-2">
            {perms.map((permission) => (
              <label key={permission.id} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={currentPermissions.includes(permission.id)}
                  onChange={(e) => {
                    const newPermissions = e.target.checked
                      ? [...currentPermissions, permission.id]
                      : currentPermissions.filter((p) => p !== permission.id);
                    onChange(newPermissions);
                  }}
                  className="mt-1 rounded border-gray-300 dark:border-gray-700"
                />
                <div>
                  <div className="font-medium">{permission.name}</div>
                  <div className="text-sm text-gray-500">{permission.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Roles</CardTitle>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {roles.map((role) => (
                <motion.div
                  key={role.id}
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
                        <Shield className="h-5 w-5 text-primary-500" />
                        <h3 className="font-medium">{role.name}</h3>
                        {role.isSystem && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                            System
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {role.userCount} users
                      </div>
                      {!role.isSystem && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedRoleId(role.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permId) => {
                        const permission = permissions.find(p => p.id === permId);
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

                  <div className="mt-4 text-xs text-gray-500">
                    Last updated: {role.updatedAt}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {roles.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No roles created yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Role"
        description="Create a new user role with specific permissions."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="roleName" className="block text-sm font-medium mb-1">
              Role Name
            </label>
            <input
              id="roleName"
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              placeholder="e.g., Content Editor"
            />
          </div>

          <div>
            <label htmlFor="roleDescription" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="roleDescription"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              rows={3}
              placeholder="Describe the role's responsibilities..."
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            {renderPermissionSelector(newRole.permissions, (permissions) =>
              setNewRole({ ...newRole, permissions })
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} disabled={!newRole.name.trim()}>
              Create Role
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Role"
        description="Modify role permissions and details."
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editRoleName" className="block text-sm font-medium mb-1">
              Role Name
            </label>
            <input
              id="editRoleName"
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="editRoleDescription" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="editRoleDescription"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Permissions</h4>
            {renderPermissionSelector(newRole.permissions, (permissions) =>
              setNewRole({ ...newRole, permissions })
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={!newRole.name.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${selectedRole?.name}"? This action cannot be undone.`}
      >
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteRole}>
            Delete
          </Button>
        </div>
      </Modal>

      {showToast && (
        <Toast
          id="role-toast"
          title="Success"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}; 