"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var faqController_1 = require("../controllers/faqController");
var auth_1 = require("../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// FAQ routes
router.get('/', faqController_1.getFAQs);
router.post('/', faqController_1.createFAQ);
router.put('/:id', faqController_1.updateFAQ);
router.delete('/:id', faqController_1.deleteFAQ);
router.get('/category/:category', faqController_1.getFAQsByCategory);
exports.default = router;
