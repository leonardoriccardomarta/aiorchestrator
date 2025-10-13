import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  logout, 
  changePassword, 
  resetPassword,
  getProfile,
  updateProfile
} from '../controllers/authController';
import { authenticateToken, authLimiter } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { schemas } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', 
  authLimiter,
  validate(schemas.register),
  register
);

router.post('/login', 
  authLimiter,
  validate(schemas.login),
  login
);

router.post('/refresh-token', refreshToken);

router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

router.put('/profile', 
  authenticateToken,
  validate(schemas.updateProfile),
  updateProfile
);

router.post('/logout', authenticateToken, logout);

router.post('/change-password', 
  authenticateToken,
  validate(schemas.changePassword),
  changePassword
);

export default router;
