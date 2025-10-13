// Agent Service - Live Agent Handoff System
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AgentService {
  // ================================================
  // AGENT MANAGEMENT
  // ================================================

  /**
   * Create or update agent profile
   * MULTI-TENANT: Each merchant can create agents for their own team
   */
  async createAgent(userId, data) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // MULTI-TENANT: Agent belongs to the user's tenant
      const agent = await prisma.agent.upsert({
        where: { userId },
        update: {
          displayName: data.displayName || `${user.firstName} ${user.lastName}`,
          status: data.status || 'offline',
          maxConcurrent: data.maxConcurrent || 3,
          skills: data.skills ? JSON.stringify(data.skills) : null
        },
        create: {
          userId,
          tenantId: user.tenantId, // MULTI-TENANT: Belongs to merchant's tenant
          displayName: data.displayName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          status: data.status || 'offline',
          maxConcurrent: data.maxConcurrent || 3,
          skills: data.skills ? JSON.stringify(data.skills) : null
        }
      });

      return agent;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  /**
   * Update agent status (online, offline, busy, away)
   */
  async updateAgentStatus(agentId, status) {
    try {
      const agent = await prisma.agent.update({
        where: { id: agentId },
        data: { status, updatedAt: new Date() }
      });

      return agent;
    } catch (error) {
      console.error('Error updating agent status:', error);
      throw error;
    }
  }

  /**
   * Get available agents for a specific tenant (merchant)
   * MULTI-TENANT: Only returns agents from the same tenant
   */
  async getAvailableAgents(tenantId) {
    try {
      const agents = await prisma.agent.findMany({
        where: {
          tenantId, // MULTI-TENANT: Only this merchant's agents
          status: { in: ['online', 'away'] }
        },
        include: {
          conversations: {
            where: {
              status: { in: ['assigned', 'active'] }
            }
          }
        }
      });

      // Filter agents who haven't reached max concurrent chats
      const availableAgents = agents.filter(agent => {
        return agent.conversations.length < agent.maxConcurrent;
      });

      return availableAgents;
    } catch (error) {
      console.error('Error getting available agents:', error);
      throw error;
    }
  }

  /**
   * Get agent stats
   */
  async getAgentStats(agentId) {
    try {
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
        include: {
          conversations: {
            where: {
              status: { in: ['assigned', 'active'] }
            }
          }
        }
      });

      if (!agent) {
        throw new Error('Agent not found');
      }

      const totalResolved = await prisma.conversation.count({
        where: {
          agentId,
          status: 'resolved'
        }
      });

      const avgRating = await prisma.conversation.aggregate({
        where: {
          agentId,
          rating: { not: null }
        },
        _avg: {
          rating: true
        }
      });

      return {
        agent,
        activeChats: agent.conversations.length,
        totalResolved,
        avgRating: avgRating._avg.rating || 5.0
      };
    } catch (error) {
      console.error('Error getting agent stats:', error);
      throw error;
    }
  }

  // ================================================
  // CONVERSATION MANAGEMENT
  // ================================================

  /**
   * Create new conversation
   */
  async createConversation(data) {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          chatbotId: data.chatbotId,
          visitorId: data.visitorId || `visitor_${Date.now()}`,
          visitorName: data.visitorName,
          visitorEmail: data.visitorEmail,
          status: 'bot', // Starts with bot
          priority: data.priority || 'normal',
          metadata: data.metadata ? JSON.stringify(data.metadata) : null
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Add message to conversation
   */
  async addMessage(conversationId, data) {
    try {
      const message = await prisma.conversationMessage.create({
        data: {
          conversationId,
          sender: data.sender, // 'bot', 'visitor', 'agent'
          senderName: data.senderName,
          message: data.message,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          isInternal: data.isInternal || false
        }
      });

      // Update conversation timestamp
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });

      return message;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId) {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          },
          agent: true,
          chatbot: true
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  // ================================================
  // HANDOFF MANAGEMENT
  // ================================================

  /**
   * Request handoff from bot to agent
   * MULTI-TENANT: Assigns only to agents from the same tenant
   */
  async requestHandoff(conversationId, reason, priority = 'normal') {
    try {
      // Get conversation with chatbot to determine tenant
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          chatbot: {
            include: {
              user: true
            }
          }
        }
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      if (conversation.status !== 'bot') {
        throw new Error('Conversation already transferred');
      }

      // MULTI-TENANT: Get available agents from the same tenant
      const tenantId = conversation.chatbot.user.tenantId;
      const availableAgents = await this.getAvailableAgents(tenantId);

      if (availableAgents.length === 0) {
        // No agents available - update status to waiting
        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            status: 'waiting',
            priority,
            updatedAt: new Date()
          }
        });

        // Add system message
        await this.addMessage(conversationId, {
          sender: 'bot',
          senderName: 'System',
          message: 'All agents are currently busy. You will be connected to the next available agent.',
          isInternal: false
        });

        return {
          success: true,
          status: 'waiting',
          message: 'Added to queue'
        };
      }

      // Assign to best agent (lowest current load)
      const bestAgent = availableAgents.sort((a, b) => {
        return a.conversations.length - b.conversations.length;
      })[0];

      // Create transfer record
      const transfer = await prisma.conversationTransfer.create({
        data: {
          conversationId,
          fromType: 'bot',
          toAgentId: bestAgent.id,
          reason,
          status: 'pending'
        }
      });

      // Update conversation
      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'assigned',
          agentId: bestAgent.id,
          assignedAt: new Date(),
          priority,
          updatedAt: new Date()
        }
      });

      // Add system message
      await this.addMessage(conversationId, {
        sender: 'bot',
        senderName: 'System',
        message: `Connecting you to ${bestAgent.displayName}...`,
        isInternal: false
      });

      return {
        success: true,
        status: 'assigned',
        agent: bestAgent,
        transfer
      };
    } catch (error) {
      console.error('Error requesting handoff:', error);
      throw error;
    }
  }

  /**
   * Agent accepts conversation
   */
  async acceptConversation(conversationId, agentId) {
    try {
      // Find pending transfer
      const transfer = await prisma.conversationTransfer.findFirst({
        where: {
          conversationId,
          toAgentId: agentId,
          status: 'pending'
        }
      });

      if (transfer) {
        // Accept transfer
        await prisma.conversationTransfer.update({
          where: { id: transfer.id },
          data: {
            status: 'accepted',
            acceptedAt: new Date()
          }
        });
      }

      // Update conversation status
      const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'active',
          agentId,
          assignedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Get agent info
      const agent = await prisma.agent.findUnique({
        where: { id: agentId }
      });

      // Add system message
      await this.addMessage(conversationId, {
        sender: 'agent',
        senderName: agent.displayName,
        message: `Hi! I'm ${agent.displayName}. How can I help you today?`,
        isInternal: false
      });

      return conversation;
    } catch (error) {
      console.error('Error accepting conversation:', error);
      throw error;
    }
  }

  /**
   * Resolve conversation
   */
  async resolveConversation(conversationId, rating = null) {
    try {
      const conversation = await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'resolved',
          closedAt: new Date(),
          rating,
          updatedAt: new Date()
        }
      });

      // Update agent stats
      if (conversation.agentId) {
        await prisma.agent.update({
          where: { id: conversation.agentId },
          data: {
            totalChats: { increment: 1 }
          }
        });
      }

      return conversation;
    } catch (error) {
      console.error('Error resolving conversation:', error);
      throw error;
    }
  }

  /**
   * Get waiting conversations (queue)
   */
  async getWaitingConversations() {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          status: 'waiting'
        },
        orderBy: [
          { priority: 'desc' },
          { startedAt: 'asc' }
        ],
        include: {
          chatbot: true
        }
      });

      return conversations;
    } catch (error) {
      console.error('Error getting waiting conversations:', error);
      throw error;
    }
  }

  /**
   * Get agent's active conversations
   */
  async getAgentConversations(agentId, status = null) {
    try {
      const where = { agentId };
      
      if (status) {
        where.status = status;
      } else {
        where.status = { in: ['assigned', 'active'] };
      }

      const conversations = await prisma.conversation.findMany({
        where,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1 // Last message
          },
          chatbot: true
        },
        orderBy: { updatedAt: 'desc' }
      });

      return conversations;
    } catch (error) {
      console.error('Error getting agent conversations:', error);
      throw error;
    }
  }
}

module.exports = new AgentService();

