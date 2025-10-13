"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.verifyRefreshToken = exports.generateTokens = exports.optionalAuth = exports.requireSuperAdmin = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var express_rate_limit_1 = require("express-rate-limit");
var config_1 = require("../config");
var database_1 = require("../config/database");
var logger_1 = require("../config/logger");
var authenticateToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authHeader = req.headers.authorization;
                token = authHeader && authHeader.split(' ')[1];
                if (!token) {
                    res.status(401).json({
                        success: false,
                        error: 'Access token required'
                    });
                    return [2 /*return*/];
                }
                decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
                return [4 /*yield*/, database_1.prisma.user.findUnique({
                        where: { id: decoded.userId },
                        include: {
                            tenant: {
                                select: {
                                    id: true,
                                    name: true,
                                    domain: true,
                                    isActive: true,
                                },
                            },
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!user || !user.isActive || !user.tenant.isActive) {
                    res.status(401).json({
                        success: false,
                        error: 'User not found or inactive'
                    });
                    return [2 /*return*/];
                }
                // Add user and tenant info to request
                req.user = user;
                req.tenantId = user.tenantId;
                next();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                logger_1.logger.error('Authentication error:', error_1);
                if (error_1 instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid token'
                    });
                }
                else if (error_1 instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    res.status(401).json({
                        success: false,
                        error: 'Token expired'
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        error: 'Authentication failed'
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.authenticateToken = authenticateToken;
var requireRole = function (roles) {
    return function (req, res, next) {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions'
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['ADMIN', 'SUPER_ADMIN']);
exports.requireSuperAdmin = (0, exports.requireRole)(['SUPER_ADMIN']);
var optionalAuth = function (req, _res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                authHeader = req.headers.authorization;
                token = authHeader && authHeader.split(' ')[1];
                if (!token) return [3 /*break*/, 2];
                decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
                return [4 /*yield*/, database_1.prisma.user.findUnique({
                        where: { id: decoded.userId },
                        include: {
                            tenant: {
                                select: {
                                    id: true,
                                    name: true,
                                    domain: true,
                                    isActive: true,
                                },
                            },
                        },
                    })];
            case 1:
                user = _a.sent();
                if (user && user.isActive && user.tenant.isActive) {
                    req.user = user;
                    req.tenantId = user.tenantId;
                }
                _a.label = 2;
            case 2:
                next();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                // Optional auth - continue even if token is invalid
                next();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.optionalAuth = optionalAuth;
var generateTokens = function (payload) {
    var jwtSecret = config_1.config.JWT_SECRET || 'fallback-secret';
    var refreshSecret = config_1.config.JWT_REFRESH_SECRET || 'fallback-refresh';
    var accessToken = jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: '15m',
    });
    var refreshToken = jsonwebtoken_1.default.sign({ userId: payload.userId }, refreshSecret, {
        expiresIn: '7d',
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
};
exports.generateTokens = generateTokens;
var verifyRefreshToken = function (token) {
    return jsonwebtoken_1.default.verify(token, config_1.config.JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
// Rate limiter for auth endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
