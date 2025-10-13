import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPPORT = 'support',
  ENTERPRISE = 'enterprise'
}

export interface Permission {
  action: string;
  resource: string;
}

export class SecurityService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly encoding = 'hex';
  private readonly roles: Map<UserRole, Permission[]>;
  private readonly auditLog: Array<{
    timestamp: number;
    action: string;
    userId: string;
    resource: string;
    success: boolean;
  }>;

  constructor() {
    this.roles = new Map();
    this.auditLog = [];
    this.initializeRoles();
  }

  private initializeRoles(): void {
    this.roles.set(UserRole.USER, [
      { action: 'read', resource: 'messages' },
      { action: 'write', resource: 'messages' },
    ]);

    this.roles.set(UserRole.ADMIN, [
      { action: 'read', resource: '*' },
      { action: 'write', resource: '*' },
      { action: 'delete', resource: '*' },
    ]);

    this.roles.set(UserRole.SUPPORT, [
      { action: 'read', resource: 'messages' },
      { action: 'read', resource: 'users' },
      { action: 'write', resource: 'messages' },
    ]);

    this.roles.set(UserRole.ENTERPRISE, [
      { action: 'read', resource: 'messages' },
      { action: 'write', resource: 'messages' },
      { action: 'read', resource: 'analytics' },
      { action: 'export', resource: 'data' },
    ]);
  }

  async encryptMessage(message: string, key: string): Promise<{
    encryptedData: string;
    iv: string;
    authTag: string;
  }> {
    const iv = randomBytes(16);
    const salt = randomBytes(64);
    const derivedKey = createHash('sha256').update(key + salt.toString('hex')).digest();

    const cipher = createCipheriv(this.algorithm, derivedKey, iv);
    let encryptedData = cipher.update(message, 'utf8', this.encoding);
    encryptedData += cipher.final(this.encoding);

    return {
      encryptedData,
      iv: iv.toString(this.encoding),
      authTag: cipher.getAuthTag().toString(this.encoding),
    };
  }

  async decryptMessage(
    encryptedData: string,
    key: string,
    iv: string,
    authTag: string
  ): Promise<string> {
    const salt = randomBytes(64);
    const derivedKey = createHash('sha256').update(key + salt.toString('hex')).digest();

    const decipher = createDecipheriv(
      this.algorithm,
      derivedKey,
      Buffer.from(iv, this.encoding)
    );
    
    decipher.setAuthTag(Buffer.from(authTag, this.encoding));
    
    let decryptedData = decipher.update(encryptedData, this.encoding, 'utf8');
    decryptedData += decipher.final('utf8');
    
    return decryptedData;
  }

  hasPermission(userRole: UserRole, action: string, resource: string): boolean {
    const permissions = this.roles.get(userRole);
    if (!permissions) return false;

    return permissions.some(
      (permission) =>
        (permission.action === action || permission.action === '*') &&
        (permission.resource === resource || permission.resource === '*')
    );
  }

  logAudit(userId: string, action: string, resource: string, success: boolean): void {
    const auditEntry = {
      timestamp: Date.now(),
      userId,
      action,
      resource,
      success,
    };

    this.auditLog.push(auditEntry);
    
    // In a real implementation, you would persist this to a database
    console.log('Audit Log Entry:', auditEntry);
  }

  getAuditLog(
    filters: {
      userId?: string;
      action?: string;
      resource?: string;
      startDate?: number;
      endDate?: number;
    } = {}
  ): Array<{
    timestamp: number;
    userId: string;
    action: string;
    resource: string;
    success: boolean;
  }> {
    return this.auditLog.filter((entry) => {
      if (filters.userId && entry.userId !== filters.userId) return false;
      if (filters.action && entry.action !== filters.action) return false;
      if (filters.resource && entry.resource !== filters.resource) return false;
      if (filters.startDate && entry.timestamp < filters.startDate) return false;
      if (filters.endDate && entry.timestamp > filters.endDate) return false;
      return true;
    });
  }

  addCustomRole(role: string, permissions: Permission[]): void {
    this.roles.set(role as UserRole, permissions);
  }

  getRolePermissions(role: UserRole): Permission[] {
    return this.roles.get(role) || [];
  }
} 