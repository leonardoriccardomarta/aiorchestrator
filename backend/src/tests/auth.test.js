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
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = require("supertest");
var setup_1 = require("./setup");
describe('Authentication Tests', function () {
    var app;
    var prisma;
    var testUser;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createApp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setupTestDatabase)()];
                case 1:
                    prisma = _a.sent();
                    return [4 /*yield*/, (0, setup_1.createTestUser)(prisma)];
                case 2:
                    // Create test user
                    testUser = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../index'); })];
                case 3:
                    createApp = (_a.sent()).default;
                    app = createApp;
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.cleanupTestDatabase)(prisma)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('POST /api/auth/register', function () {
        it('should register a new user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {
                            email: 'newuser@example.com',
                            password: 'NewPassword123!',
                            firstName: 'New',
                            lastName: 'User',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/register')
                                .send(userData)
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.user.email).toBe(userData.email);
                        expect(response.body.data.token).toBeDefined();
                        expect(response.body.data.refreshToken).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid email', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {
                            email: 'invalid-email',
                            password: 'ValidPassword123!',
                            firstName: 'Test',
                            lastName: 'User',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/register')
                                .send(userData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Validation failed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with weak password', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {
                            email: 'test2@example.com',
                            password: 'weak',
                            firstName: 'Test',
                            lastName: 'User',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/register')
                                .send(userData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with duplicate email', function () { return __awaiter(void 0, void 0, void 0, function () {
            var userData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userData = {
                            email: testUser.email,
                            password: 'ValidPassword123!',
                            firstName: 'Test',
                            lastName: 'User',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/register')
                                .send(userData)
                                .expect(409)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('User with this email already exists');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('POST /api/auth/login', function () {
        it('should login with valid credentials', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginData = {
                            email: testUser.email,
                            password: 'TestPassword123!',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(loginData)
                                .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.user.email).toBe(testUser.email);
                        expect(response.body.data.token).toBeDefined();
                        expect(response.body.data.refreshToken).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid email', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginData = {
                            email: 'nonexistent@example.com',
                            password: 'TestPassword123!',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(loginData)
                                .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Invalid credentials');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid password', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginData = {
                            email: testUser.email,
                            password: 'WrongPassword123!',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(loginData)
                                .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Invalid credentials');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with inactive user', function () { return __awaiter(void 0, void 0, void 0, function () {
            var inactiveUser, loginData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestUser)(prisma, {
                            email: 'inactive@example.com',
                            isActive: false,
                        })];
                    case 1:
                        inactiveUser = _a.sent();
                        loginData = {
                            email: inactiveUser.email,
                            password: 'TestPassword123!',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(loginData)
                                .expect(401)];
                    case 2:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Account is inactive');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('POST /api/auth/refresh-token', function () {
        it('should refresh token successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginResponse, refreshToken, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/auth/login')
                            .send({
                            email: testUser.email,
                            password: 'TestPassword123!',
                        })];
                    case 1:
                        loginResponse = _a.sent();
                        refreshToken = loginResponse.body.data.refreshToken;
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/refresh-token')
                                .send({ refreshToken: refreshToken })
                                .expect(200)];
                    case 2:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.token).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid refresh token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/auth/refresh-token')
                            .send({ refreshToken: 'invalid-token' })
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Invalid refresh token');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('GET /api/auth/profile', function () {
        it('should get profile with valid token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = (0, setup_1.generateTestToken)(testUser.id, testUser.role);
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .get('/api/auth/profile')
                                .set('Authorization', "Bearer ".concat(token))
                                .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.email).toBe(testUser.email);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail without token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/auth/profile')
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Access token required');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/auth/profile')
                            .set('Authorization', 'Bearer invalid-token')
                            .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Invalid token');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('POST /api/auth/logout', function () {
        it('should logout successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = (0, setup_1.generateTestToken)(testUser.id, testUser.role);
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/logout')
                                .set('Authorization', "Bearer ".concat(token))
                                .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.message).toBe('Logout successful');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Security Tests', function () {
        it('should block SQL injection attempts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maliciousData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maliciousData = {
                            email: "admin'; DROP TABLE users; --",
                            password: 'TestPassword123!',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(maliciousData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should block XSS attempts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maliciousData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maliciousData = {
                            email: '<script>alert("xss")</script>@example.com',
                            password: 'TestPassword123!',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(maliciousData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should enforce rate limiting', function () { return __awaiter(void 0, void 0, void 0, function () {
            var loginData, i, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loginData = {
                            email: testUser.email,
                            password: 'WrongPassword123!',
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 6)) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/auth/login')
                                .send(loginData)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/auth/login')
                            .send(loginData)
                            .expect(429)];
                    case 5:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toContain('Too many');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
