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
exports.getFAQsByCategory = exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.getFAQs = void 0;
var database_1 = require("../config/database");
var logger_1 = require("../config/logger");
var getFAQs = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, faqs, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, database_1.prisma.fAQ.findMany({
                        where: {
                            ownerId: userId
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    })];
            case 1:
                faqs = _b.sent();
                res.json(faqs);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                logger_1.logger.error('Get FAQs error:', error_1);
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFAQs = getFAQs;
var createFAQ = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, question, answer, category, tags, faq, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return [2 /*return*/];
                }
                _a = req.body, question = _a.question, answer = _a.answer, category = _a.category, tags = _a.tags;
                if (!question || !answer) {
                    res.status(400).json({ error: 'Question and answer are required' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, database_1.prisma.fAQ.create({
                        data: {
                            question: question,
                            answer: answer,
                            category: category || 'General',
                            tags: tags || '',
                            ownerId: userId,
                            tenantId: 'default-tenant'
                        }
                    })];
            case 1:
                faq = _c.sent();
                res.status(201).json(faq);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                logger_1.logger.error('Create FAQ error:', error_2);
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createFAQ = createFAQ;
var updateFAQ = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, _a, question, answer, category, tags, isActive, faq, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return [2 /*return*/];
                }
                id = req.params.id;
                if (!id) {
                    res.status(400).json({ error: 'FAQ ID is required' });
                    return [2 /*return*/];
                }
                _a = req.body, question = _a.question, answer = _a.answer, category = _a.category, tags = _a.tags, isActive = _a.isActive;
                return [4 /*yield*/, database_1.prisma.fAQ.update({
                        where: {
                            id: id
                        },
                        data: {
                            question: question,
                            answer: answer,
                            category: category,
                            tags: tags,
                            isActive: isActive
                        }
                    })];
            case 1:
                faq = _c.sent();
                res.json(faq);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                logger_1.logger.error('Update FAQ error:', error_3);
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateFAQ = updateFAQ;
var deleteFAQ = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return [2 /*return*/];
                }
                id = req.params.id;
                if (!id) {
                    res.status(400).json({ error: 'FAQ ID is required' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, database_1.prisma.fAQ.delete({
                        where: {
                            id: id
                        }
                    })];
            case 1:
                _b.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                logger_1.logger.error('Delete FAQ error:', error_4);
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteFAQ = deleteFAQ;
var getFAQsByCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, category, faqs, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return [2 /*return*/];
                }
                category = req.params.category;
                if (!category) {
                    res.status(400).json({ error: 'Category is required' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, database_1.prisma.fAQ.findMany({
                        where: {
                            ownerId: userId,
                            category: category
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    })];
            case 1:
                faqs = _b.sent();
                res.json(faqs);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _b.sent();
                logger_1.logger.error('Get FAQs by category error:', error_5);
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getFAQsByCategory = getFAQsByCategory;
