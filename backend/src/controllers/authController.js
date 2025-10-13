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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.resetPassword = exports.changePassword = exports.logout = exports.refreshToken = exports.login = exports.register = exports.authController = exports.AuthController = void 0;
var authService_1 = require("../services/authService");
var database_1 = require("../config/database");
var errorHandler_1 = require("../middleware/errorHandler");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, firstName, lastName, result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, authService_1.authService.register({
                                email: email,
                                password: password,
                                firstName: firstName,
                                lastName: lastName,
                            })];
                    case 2:
                        result = _b.sent();
                        res.status(201).json({
                            success: true,
                            data: result,
                            message: 'User registered successfully',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        next(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, authService_1.authService.login({ email: email, password: password })];
                    case 2:
                        result = _b.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Login successful',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        next(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.refreshToken = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refreshToken = req.body.refreshToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, authService_1.authService.refreshToken(refreshToken)];
                    case 2:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: result,
                            message: 'Token refreshed successfully',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        next(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.logout = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, authService_1.authService.logout(userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        res.json({
                            success: true,
                            message: 'Logout successful',
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_4 = _b.sent();
                        next(error_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.changePassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, currentPassword, newPassword, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        if (!userId) {
                            res.status(401).json({
                                success: false,
                                error: 'Authentication required',
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, authService_1.authService.changePassword(userId, currentPassword, newPassword)];
                    case 2:
                        _c.sent();
                        res.json({
                            success: true,
                            message: 'Password changed successfully',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _c.sent();
                        next(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.resetPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var email, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = req.body.email;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, authService_1.authService.resetPassword(email)];
                    case 2:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Password reset instructions sent to your email',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        next(error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.getProfile = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, password, userProfile;
            return __generator(this, function (_a) {
                try {
                    user = req.user;
                    if (!user) {
                        res.status(401).json({
                            success: false,
                            error: 'Authentication required',
                        });
                        return [2 /*return*/];
                    }
                    password = user.password, userProfile = __rest(user, ["password"]);
                    res.json({
                        success: true,
                        data: userProfile,
                    });
                }
                catch (error) {
                    next(error);
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.updateProfile = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, firstName, lastName, email, existingUser, updatedUser, password, userProfile, error_7;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                        _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        if (!userId) {
                            res.status(401).json({
                                success: false,
                                error: 'Authentication required',
                            });
                            return [2 /*return*/];
                        }
                        if (!(email && email !== ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email))) return [3 /*break*/, 3];
                        return [4 /*yield*/, database_1.prisma.user.findUnique({
                                where: { email: email },
                            })];
                    case 2:
                        existingUser = _d.sent();
                        if (existingUser) {
                            res.status(409).json({
                                success: false,
                                error: 'Email already in use',
                            });
                            return [2 /*return*/];
                        }
                        _d.label = 3;
                    case 3: return [4 /*yield*/, database_1.prisma.user.update({
                            where: { id: userId },
                            data: {
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
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
                        })];
                    case 4:
                        updatedUser = _d.sent();
                        password = updatedUser.password, userProfile = __rest(updatedUser, ["password"]);
                        res.json({
                            success: true,
                            data: userProfile,
                            message: 'Profile updated successfully',
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_7 = _d.sent();
                        next(error_7);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
exports.authController = new AuthController();
// Async handler wrappers
exports.register = (0, errorHandler_1.asyncHandler)(exports.authController.register.bind(exports.authController));
exports.login = (0, errorHandler_1.asyncHandler)(exports.authController.login.bind(exports.authController));
exports.refreshToken = (0, errorHandler_1.asyncHandler)(exports.authController.refreshToken.bind(exports.authController));
exports.logout = (0, errorHandler_1.asyncHandler)(exports.authController.logout.bind(exports.authController));
exports.changePassword = (0, errorHandler_1.asyncHandler)(exports.authController.changePassword.bind(exports.authController));
exports.resetPassword = (0, errorHandler_1.asyncHandler)(exports.authController.resetPassword.bind(exports.authController));
exports.getProfile = (0, errorHandler_1.asyncHandler)(exports.authController.getProfile.bind(exports.authController));
exports.updateProfile = (0, errorHandler_1.asyncHandler)(exports.authController.updateProfile.bind(exports.authController));
