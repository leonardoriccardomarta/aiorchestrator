"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var chatbotController_1 = require("../controllers/chatbotController");
var auth_1 = require("../middleware/auth");
var validation_1 = require("../middleware/validation");
var validation_2 = require("../middleware/validation");
var router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Chatbot CRUD operations
router.post('/', (0, validation_1.validate)(validation_2.schemas.createChatbot), chatbotController_1.createChatbot);
router.get('/', (0, validation_1.validateQuery)(validation_2.schemas.pagination), chatbotController_1.getChatbots);
router.get('/stats', chatbotController_1.getChatbotStats);
router.get('/:id', chatbotController_1.getChatbot);
router.put('/:id', (0, validation_1.validate)(validation_2.schemas.updateChatbot), chatbotController_1.updateChatbot);
router.delete('/:id', chatbotController_1.deleteChatbot);
// Chatbot messaging
router.post('/:id/message', (0, validation_1.validate)(validation_2.schemas.createChatbot), chatbotController_1.sendMessage);
exports.default = router;
