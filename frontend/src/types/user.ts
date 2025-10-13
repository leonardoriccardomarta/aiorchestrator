export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  isActive: boolean;
  isVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}