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
exports.createInvoice = exports.getInvoices = exports.updatePaymentStatus = exports.createPayment = exports.getPayments = void 0;
var database_1 = require("../config/database");
var logger_1 = require("../config/logger");
var getPayments = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, payments, error_1;
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
                return [4 /*yield*/, database_1.prisma.payment.findMany({
                        where: {
                            userId: userId
                        },
                        include: {
                            subscription: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    })];
            case 1:
                payments = _b.sent();
                res.json(payments);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                logger_1.logger.error('Get payments error:', error_1);
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPayments = getPayments;
var createPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, currency, method, description, subscriptionId, payment, error_2;
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
                _a = req.body, amount = _a.amount, currency = _a.currency, method = _a.method, description = _a.description, subscriptionId = _a.subscriptionId;
                if (!amount || !method) {
                    res.status(400).json({ error: 'Amount and method are required' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, database_1.prisma.payment.create({
                        data: {
                            amount: Math.round(amount * 100), // Convert to cents
                            currency: currency || 'usd',
                            method: method,
                            description: description,
                            userId: userId,
                            tenantId: 'default-tenant',
                            subscriptionId: subscriptionId
                        }
                    })];
            case 1:
                payment = _c.sent();
                res.status(201).json(payment);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                logger_1.logger.error('Create payment error:', error_2);
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPayment = createPayment;
var updatePaymentStatus = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, id, status_1, payment, error_3;
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
                    res.status(400).json({ error: 'Payment ID is required' });
                    return [2 /*return*/];
                }
                status_1 = req.body.status;
                return [4 /*yield*/, database_1.prisma.payment.update({
                        where: {
                            id: id
                        },
                        data: {
                            status: status_1
                        }
                    })];
            case 1:
                payment = _b.sent();
                res.json(payment);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                logger_1.logger.error('Update payment status error:', error_3);
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentStatus = updatePaymentStatus;
var getInvoices = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, invoices, error_4;
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
                return [4 /*yield*/, database_1.prisma.invoice.findMany({
                        where: {
                            userId: userId
                        },
                        include: {
                            payment: true,
                            subscription: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        }
                    })];
            case 1:
                invoices = _b.sent();
                res.json(invoices);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                logger_1.logger.error('Get invoices error:', error_4);
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getInvoices = getInvoices;
var createInvoice = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, amount, currency, dueDate, subscriptionId, invoiceNumber, invoice, error_5;
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
                _a = req.body, amount = _a.amount, currency = _a.currency, dueDate = _a.dueDate, subscriptionId = _a.subscriptionId;
                if (!amount) {
                    res.status(400).json({ error: 'Amount is required' });
                    return [2 /*return*/];
                }
                invoiceNumber = "INV-".concat(Date.now());
                return [4 /*yield*/, database_1.prisma.invoice.create({
                        data: {
                            number: invoiceNumber,
                            amount: Math.round(amount * 100), // Convert to cents
                            currency: currency || 'usd',
                            dueDate: dueDate ? new Date(dueDate) : null,
                            userId: userId,
                            tenantId: 'default-tenant',
                            subscriptionId: subscriptionId
                        }
                    })];
            case 1:
                invoice = _c.sent();
                res.status(201).json(invoice);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _c.sent();
                logger_1.logger.error('Create invoice error:', error_5);
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createInvoice = createInvoice;
