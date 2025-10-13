// Agent Routes - Live Agent Handoff API
const express = require('express');
const router = express.Router();
const agentService = require('../services/agentService');
const orderTrackingService = require('../services/orderTrackingService');
const jwt = require('jsonwebtoken');

// Auth middleware (inline)
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ================================================
// AGENT MANAGEMENT
// ================================================

/**
 * @route   POST /api/agents/profile
 * @desc    Create or update agent profile
 * @access  Private
 */
router.post('/profile', authenticate, async (req, res) => {
  try {
    const agent = await agentService.createAgent(req.user.id, req.body);
    res.json({ success: true, agent });
  } catch (error) {
    console.error('Error creating agent profile:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/agents/status
 * @desc    Update agent status
 * @access  Private
 */
router.put('/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body; // online, offline, busy, away
    
    // Get agent by userId
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    const updated = await agentService.updateAgentStatus(agent.id, status);
    res.json({ success: true, agent: updated });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/agents/stats
 * @desc    Get agent statistics
 * @access  Private
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    const stats = await agentService.getAgentStats(agent.id);
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting agent stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ================================================
// CONVERSATION MANAGEMENT
// ================================================

/**
 * @route   POST /api/agents/conversations
 * @desc    Create new conversation
 * @access  Public
 */
router.post('/conversations', async (req, res) => {
  try {
    const conversation = await agentService.createConversation(req.body);
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/agents/conversations/:id
 * @desc    Get conversation history
 * @access  Public
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await agentService.getConversationHistory(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/agents/conversations/:id/messages
 * @desc    Add message to conversation
 * @access  Public
 */
router.post('/conversations/:id/messages', async (req, res) => {
  try {
    const message = await agentService.addMessage(req.params.id, req.body);
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/agents/conversations
 * @desc    Get agent's conversations
 * @access  Private
 */
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    const conversations = await agentService.getAgentConversations(agent.id, req.query.status);
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// ================================================
// HANDOFF MANAGEMENT
// ================================================

/**
 * @route   POST /api/agents/handoff/request
 * @desc    Request handoff from bot to agent
 * @access  Public
 */
router.post('/handoff/request', async (req, res) => {
  try {
    const { conversationId, reason, priority } = req.body;
    const result = await agentService.requestHandoff(conversationId, reason, priority);
    res.json(result);
  } catch (error) {
    console.error('Error requesting handoff:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/agents/handoff/accept
 * @desc    Agent accepts conversation
 * @access  Private
 */
router.post('/handoff/accept', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.body;
    
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const agent = await prisma.agent.findUnique({
      where: { userId: req.user.id }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent profile not found' });
    }

    const conversation = await agentService.acceptConversation(conversationId, agent.id);
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Error accepting conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/agents/handoff/resolve
 * @desc    Resolve conversation
 * @access  Private
 */
router.post('/handoff/resolve', authenticate, async (req, res) => {
  try {
    const { conversationId, rating } = req.body;
    const conversation = await agentService.resolveConversation(conversationId, rating);
    res.json({ success: true, conversation });
  } catch (error) {
    console.error('Error resolving conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/agents/queue
 * @desc    Get waiting conversations (queue)
 * @access  Private
 */
router.get('/queue', authenticate, async (req, res) => {
  try {
    const conversations = await agentService.getWaitingConversations();
    res.json({ success: true, conversations });
  } catch (error) {
    console.error('Error getting queue:', error);
    res.status(500).json({ error: error.message });
  }
});

// ================================================
// ORDER TRACKING
// ================================================

/**
 * @route   GET /api/agents/orders/track/:orderNumber
 * @desc    Track order by number
 * @access  Public
 */
router.get('/orders/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { tenantId, customerEmail } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' });
    }

    const order = await orderTrackingService.trackOrder(tenantId, orderNumber, customerEmail);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/agents/orders/customer/:email
 * @desc    Get customer orders
 * @access  Public
 */
router.get('/orders/customer/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({ error: 'tenantId required' });
    }

    const orders = await orderTrackingService.getCustomerOrders(tenantId, email);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error getting customer orders:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

