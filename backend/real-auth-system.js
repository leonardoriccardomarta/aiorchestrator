// Minimal Auth Service Stub
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

class AuthService {
  constructor() {
    console.log('🔐 Auth Service initialized');
  }

  async validateCredentials(email, password) {
    return { valid: true };
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
  }

  async register(email, password, name) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Split name
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Create default tenant for user
      const tenant = await prisma.tenant.create({
        data: {
          name: `${name}'s Organization`,
          isActive: true
        }
      });

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          tenantId: tenant.id,
          role: 'USER',
          isActive: true,
          isVerified: false,
          planId: 'starter',
          isTrialActive: true,
          trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          planId: user.planId,
          isTrialActive: user.isTrialActive,
          trialEndDate: user.trialEndDate,
          isPaid: user.isPaid || false,
          hasCompletedOnboarding: false,
          isNewUser: true
        },
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    }
  }

  async login(email, password) {
    try {
      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Verify password
      const isValid = await this.verifyPassword(password, user.password);
      if (!isValid) {
        return { success: false, message: 'Invalid credentials' };
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Generate token
      const token = this.generateToken(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          planId: user.planId,
          isTrialActive: user.isTrialActive,
          trialEndDate: user.trialEndDate,
          isPaid: user.isPaid || false,
          hasCompletedOnboarding: user.hasCompletedOnboarding || false,
          isNewUser: false
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  }

  async verifyAccess(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await prisma.user.findUnique({ 
        where: { id: decoded.id },
        include: { tenant: true }
      });
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async verifyAccount(token) {
    try {
      // Mock verification for now
      return {
        success: true,
        message: 'Account verified successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Verification failed'
      };
    }
  }

  updateUserTrial(userId, isTrialActive, trialEndDate) {
    // Mock implementation
    console.log(`Updated trial for user ${userId}: ${isTrialActive}, end date: ${trialEndDate}`);
    return true;
  }
}

module.exports = AuthService;

