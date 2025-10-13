import { Router } from 'express';
import { 
  createChatbot,
  getChatbots,
  getChatbot,
  updateChatbot,
  deleteChatbot,
  getChatbotStats,
  sendMessage
} from '../controllers/chatbotController';
import { authenticateToken } from '../middleware/auth';
import { validate, validateQuery } from '../middleware/validation';
import { schemas } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Chatbot CRUD operations
router.post('/', 
  validate(schemas.createChatbot),
  createChatbot
);

router.get('/', 
  validateQuery(schemas.pagination),
  getChatbots
);

router.get('/stats', getChatbotStats);

router.get('/:id', getChatbot);

router.put('/:id', 
  validate(schemas.updateChatbot),
  updateChatbot
);

router.delete('/:id', deleteChatbot);

// Chatbot messaging
router.post('/:id/message', 
  validate(schemas.createChatbot),
  sendMessage
);

export default router;
