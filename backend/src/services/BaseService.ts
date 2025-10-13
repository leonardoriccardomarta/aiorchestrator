import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export abstract class BaseService {
  protected prisma: PrismaClient;
  protected serviceName: string;

  constructor(serviceName: string) {
    this.prisma = prisma;
    this.serviceName = serviceName;
  }

  protected async executeWithLogging<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: any
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      logger.info(`${this.serviceName}: Starting ${operationName}`, {
        service: this.serviceName,
        operation: operationName,
        context,
      });

      const result = await operation();
      
      const duration = Date.now() - startTime;
      logger.info(`${this.serviceName}: Completed ${operationName}`, {
        service: this.serviceName,
        operation: operationName,
        duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`${this.serviceName}: Failed ${operationName}`, {
        service: this.serviceName,
        operation: operationName,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        context,
      });
      
      throw error;
    }
  }

  protected async auditLog(
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details?: any
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          resourceId,
          details,
        },
      });
    } catch (error) {
      logger.error('Failed to create audit log', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
        action,
        resource,
        resourceId,
      });
    }
  }

  protected async trackAnalytics(
    type: string,
    entityId: string,
    entityType: string,
    userId: string,
    tenantId: string,
    data?: any
  ): Promise<void> {
    try {
      await this.prisma.analytics.create({
        data: {
          type: type as any,
          entityId,
          entityType,
          userId,
          tenantId,
          data,
        },
      });
    } catch (error) {
      logger.error('Failed to track analytics', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type,
        entityId,
        entityType,
        userId,
        tenantId,
      });
    }
  }

  protected validateTenantAccess(userId: string, tenantId: string): Promise<boolean> {
    return this.executeWithLogging(
      async () => {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { tenantId: true, isActive: true },
        });

        if (!user || !user.isActive) {
          return false;
        }

        return user.tenantId === tenantId;
      },
      'validateTenantAccess',
      { userId, tenantId }
    );
  }

  protected async checkResourceOwnership(
    resourceId: string,
    userId: string,
    resourceType: string
  ): Promise<boolean> {
    return this.executeWithLogging(
      async () => {
        const resource = await (this.prisma as any)[resourceType].findFirst({
          where: {
            id: resourceId,
            ownerId: userId,
          },
        });

        return !!resource;
      },
      'checkResourceOwnership',
      { resourceId, userId, resourceType }
    );
  }

  protected async checkSubscriptionLimits(
    userId: string,
    tenantId: string,
    resourceType: string
  ): Promise<{ canCreate: boolean; limit?: number; current?: number }> {
    return this.executeWithLogging(
      async () => {
        const subscription = await this.prisma.subscription.findFirst({
          where: {
            userId,
            tenantId,
            status: 'ACTIVE',
          }
        });

        if (!subscription) {
          return { canCreate: false };
        }

        // Mock plan limits since we don't have plan relation
        const planLimits = {
          chatbots: 5,
          storage: 10,
          users: 10
        };
        let limit: number | undefined;
        let current: number = 0;

        switch (resourceType) {
          case 'chatbot':
            limit = planLimits.chatbots;
            current = await this.prisma.chatbot.count({
              where: {
                ownerId: userId,
                tenantId,
              },
            });
            break;
          case 'user':
            limit = planLimits.users;
            current = await this.prisma.user.count({
              where: {
                tenantId,
                isActive: true,
              },
            });
            break;
          default:
            return { canCreate: true };
        }

        return {
          canCreate: !limit || current < limit,
          limit,
          current,
        };
      },
      'checkSubscriptionLimits',
      { userId, tenantId, resourceType }
    );
  }

  protected async handleDatabaseError(error: any, operation: string): Promise<never> {
    logger.error(`${this.serviceName}: Database error in ${operation}`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      operation,
      service: this.serviceName,
    });

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A record with this information already exists');
    } else if (error.code === 'P2025') {
      throw new Error('Record not found');
    } else if (error.code === 'P2003') {
      throw new Error('Invalid reference to related record');
    }

    throw error;
  }
}