import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { prisma } from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password, firstName, lastName } = req.body;

    try {
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
      const result = await authService.login({ email, password });

      res.json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { refreshToken } = req.body;

    try {
      const result = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;

    try {
      if (userId) {
        await authService.logout(userId);
      }

      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    try {
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      await authService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;

    try {
      await authService.resetPassword(email);

      res.json({
        success: true,
        message: 'Password reset instructions sent to your email',
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Remove sensitive data
      const { password, ...userProfile } = user;

      res.json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    const { firstName, lastName, email } = req.body;

    try {
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      // Check if email is already taken by another user
      if (email && email !== req.user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          res.status(409).json({
            success: false,
            error: 'Email already in use',
          });
          return;
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          email,
          updatedAt: new Date(),
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              domain: true,
            },
          },
        },
      });

      // Remove sensitive data
      const { password, ...userProfile } = updatedUser;

      res.json({
        success: true,
        data: userProfile,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

// Async handler wrappers
export const register = asyncHandler(authController.register.bind(authController));
export const login = asyncHandler(authController.login.bind(authController));
export const refreshToken = asyncHandler(authController.refreshToken.bind(authController));
export const logout = asyncHandler(authController.logout.bind(authController));
export const changePassword = asyncHandler(authController.changePassword.bind(authController));
export const resetPassword = asyncHandler(authController.resetPassword.bind(authController));
export const getProfile = asyncHandler(authController.getProfile.bind(authController));
export const updateProfile = asyncHandler(authController.updateProfile.bind(authController));
