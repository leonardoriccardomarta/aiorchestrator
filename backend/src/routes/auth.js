"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var auth_1 = require("../middleware/auth");
var validation_1 = require("../middleware/validation");
var validation_2 = require("../middleware/validation");
var router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_1.authLimiter, (0, validation_1.validate)(validation_2.schemas.register), authController_1.register);
router.post('/login', auth_1.authLimiter, (0, validation_1.validate)(validation_2.schemas.login), authController_1.login);
router.post('/refresh-token', authController_1.refreshToken);
router.post('/reset-password', authController_1.resetPassword);
// Protected routes
router.get('/profile', auth_1.authenticateToken, authController_1.getProfile);
router.put('/profile', auth_1.authenticateToken, (0, validation_1.validate)(validation_2.schemas.updateProfile), authController_1.updateProfile);
router.post('/logout', auth_1.authenticateToken, authController_1.logout);
router.post('/change-password', auth_1.authenticateToken, (0, validation_1.validate)(validation_2.schemas.changePassword), authController_1.changePassword);
exports.default = router;
