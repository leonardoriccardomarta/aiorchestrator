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
describe('Chatbot Tests', function () {
    var app;
    var prisma;
    var testUser;
    var authToken;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createApp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, setup_1.setupTestDatabase)()];
                case 1:
                    prisma = _a.sent();
                    return [4 /*yield*/, (0, setup_1.createTestUser)(prisma)];
                case 2:
                    // Create test user and login
                    testUser = _a.sent();
                    authToken = (0, setup_1.generateTestToken)(testUser.id, testUser.role);
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
    describe('POST /api/chatbots', function () {
        it('should create a chatbot successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var chatbotData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatbotData = {
                            name: 'Test Customer Support Bot',
                            description: 'A helpful customer support chatbot',
                            model: 'gpt-3.5-turbo',
                            personality: 'helpful',
                            responseStyle: 'professional',
                            temperature: 0.7,
                            maxTokens: 1000,
                            whatsappEnabled: true,
                            messengerEnabled: false,
                            telegramEnabled: false,
                            shopifyEnabled: true,
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/chatbots')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(chatbotData)
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.name).toBe(chatbotData.name);
                        expect(response.body.data.ownerId).toBe(testUser.id);
                        expect(response.body.data.tenantId).toBe(testUser.tenantId);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            name: '', // Empty name
                            description: 'A chatbot with invalid name',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/chatbots')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(invalidData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Validation failed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail without authentication', function () { return __awaiter(void 0, void 0, void 0, function () {
            var chatbotData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chatbotData = {
                            name: 'Unauthorized Bot',
                            description: 'This should fail',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/chatbots')
                                .send(chatbotData)
                                .expect(401)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Access token required');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sanitize malicious input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var maliciousData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maliciousData = {
                            name: '<script>alert("xss")</script>Malicious Bot',
                            description: 'A chatbot with malicious content',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post('/api/chatbots')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(maliciousData)
                                .expect(201)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.name).not.toContain('<script>');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('GET /api/chatbots', function () {
        var testChatbot;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                            ownerId: testUser.id,
                            tenantId: testUser.tenantId,
                        })];
                    case 1:
                        testChatbot = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get user chatbots', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/chatbots')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data).toBeInstanceOf(Array);
                        expect(response.body.data.length).toBeGreaterThan(0);
                        expect(response.body.pagination).toBeDefined();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should support pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/chatbots?page=1&limit=5')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.pagination.page).toBe(1);
                        expect(response.body.pagination.limit).toBe(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not return other users chatbots', function () { return __awaiter(void 0, void 0, void 0, function () {
            var otherUser, response, botNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestUser)(prisma, {
                            email: 'other@example.com',
                            tenantId: 'other-tenant',
                        })];
                    case 1:
                        otherUser = _a.sent();
                        return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                                ownerId: otherUser.id,
                                tenantId: otherUser.tenantId,
                                name: 'Other User Bot',
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .get('/api/chatbots')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(200)];
                    case 3:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        botNames = response.body.data.map(function (bot) { return bot.name; });
                        expect(botNames).not.toContain('Other User Bot');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('GET /api/chatbots/:id', function () {
        var testChatbot;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                            ownerId: testUser.id,
                            tenantId: testUser.tenantId,
                        })];
                    case 1:
                        testChatbot = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get specific chatbot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/chatbots/".concat(testChatbot.id))
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.id).toBe(testChatbot.id);
                        expect(response.body.data.name).toBe(testChatbot.name);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with non-existent chatbot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/chatbots/non-existent-id')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(404)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        expect(response.body.error).toBe('Chatbot not found');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail accessing other user chatbot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var otherUser, otherChatbot, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestUser)(prisma, {
                            email: 'other@example.com',
                        })];
                    case 1:
                        otherUser = _a.sent();
                        return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                                ownerId: otherUser.id,
                                tenantId: otherUser.tenantId,
                            })];
                    case 2:
                        otherChatbot = _a.sent();
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .get("/api/chatbots/".concat(otherChatbot.id))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(404)];
                    case 3:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('PUT /api/chatbots/:id', function () {
        var testChatbot;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                            ownerId: testUser.id,
                            tenantId: testUser.tenantId,
                        })];
                    case 1:
                        testChatbot = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update chatbot successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            name: 'Updated Bot Name',
                            description: 'Updated description',
                            temperature: 0.9,
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .put("/api/chatbots/".concat(testChatbot.id))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(updateData)
                                .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.name).toBe(updateData.name);
                        expect(response.body.data.description).toBe(updateData.description);
                        expect(response.body.data.temperature).toBe(updateData.temperature);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with invalid update data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            temperature: 5.0, // Invalid temperature (should be 0-2)
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .put("/api/chatbots/".concat(testChatbot.id))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(invalidData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail updating non-existent chatbot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updateData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = {
                            name: 'Updated Name',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .put('/api/chatbots/non-existent-id')
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(updateData)
                                .expect(404)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('DELETE /api/chatbots/:id', function () {
        var testChatbot;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                            ownerId: testUser.id,
                            tenantId: testUser.tenantId,
                        })];
                    case 1:
                        testChatbot = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should delete chatbot successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, getResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .delete("/api/chatbots/".concat(testChatbot.id))
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.message).toBe('Chatbot deleted successfully');
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .get("/api/chatbots/".concat(testChatbot.id))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .expect(404)];
                    case 2:
                        getResponse = _a.sent();
                        expect(getResponse.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail deleting non-existent chatbot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .delete('/api/chatbots/non-existent-id')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(404)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('GET /api/chatbots/stats', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Create multiple chatbots for stats
                    return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                            ownerId: testUser.id,
                            tenantId: testUser.tenantId,
                            name: 'Bot 1',
                            totalMessages: 100,
                            avgResponseTime: 1.5,
                            satisfactionScore: 4.5,
                        })];
                    case 1:
                        // Create multiple chatbots for stats
                        _a.sent();
                        return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                                ownerId: testUser.id,
                                tenantId: testUser.tenantId,
                                name: 'Bot 2',
                                totalMessages: 200,
                                avgResponseTime: 2.0,
                                satisfactionScore: 4.8,
                                isActive: false,
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should get chatbot statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/chatbots/stats')
                            .set('Authorization', "Bearer ".concat(authToken))
                            .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.totalChatbots).toBe(2);
                        expect(response.body.data.activeChatbots).toBe(1);
                        expect(response.body.data.totalMessages).toBe(300);
                        expect(response.body.data.avgResponseTime).toBeCloseTo(1.75);
                        expect(response.body.data.avgSatisfactionScore).toBeCloseTo(4.65);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('POST /api/chatbots/:id/message', function () {
        var testChatbot;
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, setup_1.createTestChatbot)(prisma, {
                            ownerId: testUser.id,
                            tenantId: testUser.tenantId,
                        })];
                    case 1:
                        testChatbot = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should send message to chatbot', function () { return __awaiter(void 0, void 0, void 0, function () {
            var messageData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messageData = {
                            message: 'Hello, how can you help me?',
                            sessionId: 'test-session-123',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post("/api/chatbots/".concat(testChatbot.id, "/message"))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(messageData)
                                .expect(200)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(true);
                        expect(response.body.data.message).toBeDefined();
                        expect(response.body.data.sessionId).toBe(messageData.sessionId);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail with empty message', function () { return __awaiter(void 0, void 0, void 0, function () {
            var messageData, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        messageData = {
                            message: '',
                            sessionId: 'test-session-123',
                        };
                        return [4 /*yield*/, (0, supertest_1.default)(app)
                                .post("/api/chatbots/".concat(testChatbot.id, "/message"))
                                .set('Authorization', "Bearer ".concat(authToken))
                                .send(messageData)
                                .expect(400)];
                    case 1:
                        response = _a.sent();
                        expect(response.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
