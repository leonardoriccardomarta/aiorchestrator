import request from 'supertest';
import { Express } from 'express';
import { setupTestDatabase, cleanupTestDatabase, createTestUser, createTestChatbot, generateTestToken } from './setup';
import { PrismaClient } from '@prisma/client';

describe('Chatbot Tests', () => {
  let app: Express;
  let prisma: PrismaClient;
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    prisma = await setupTestDatabase();
    
    // Create test user and login
    testUser = await createTestUser(prisma);
    authToken = generateTestToken(testUser.id, testUser.role);
    
    const { default: createApp } = await import('../index');
    app = createApp;
  });

  afterAll(async () => {
    await cleanupTestDatabase(prisma);
  });

  describe('POST /api/chatbots', () => {
    it('should create a chatbot successfully', async () => {
      const chatbotData = {
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

      const response = await request(app)
        .post('/api/chatbots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(chatbotData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(chatbotData.name);
      expect(response.body.data.ownerId).toBe(testUser.id);
      expect(response.body.data.tenantId).toBe(testUser.tenantId);
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        name: '', // Empty name
        description: 'A chatbot with invalid name',
      };

      const response = await request(app)
        .post('/api/chatbots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should fail without authentication', async () => {
      const chatbotData = {
        name: 'Unauthorized Bot',
        description: 'This should fail',
      };

      const response = await request(app)
        .post('/api/chatbots')
        .send(chatbotData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Access token required');
    });

    it('should sanitize malicious input', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>Malicious Bot',
        description: 'A chatbot with malicious content',
      };

      const response = await request(app)
        .post('/api/chatbots')
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).not.toContain('<script>');
    });
  });

  describe('GET /api/chatbots', () => {
    let testChatbot: any;

    beforeEach(async () => {
      testChatbot = await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
      });
    });

    it('should get user chatbots', async () => {
      const response = await request(app)
        .get('/api/chatbots')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/chatbots?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('should not return other users chatbots', async () => {
      // Create another user's chatbot
      const otherUser = await createTestUser(prisma, {
        email: 'other@example.com',
        tenantId: 'other-tenant',
      });

      await createTestChatbot(prisma, {
        ownerId: otherUser.id,
        tenantId: otherUser.tenantId,
        name: 'Other User Bot',
      });

      const response = await request(app)
        .get('/api/chatbots')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const botNames = response.body.data.map((bot: any) => bot.name);
      expect(botNames).not.toContain('Other User Bot');
    });
  });

  describe('GET /api/chatbots/:id', () => {
    let testChatbot: any;

    beforeEach(async () => {
      testChatbot = await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
      });
    });

    it('should get specific chatbot', async () => {
      const response = await request(app)
        .get(`/api/chatbots/${testChatbot.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testChatbot.id);
      expect(response.body.data.name).toBe(testChatbot.name);
    });

    it('should fail with non-existent chatbot', async () => {
      const response = await request(app)
        .get('/api/chatbots/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Chatbot not found');
    });

    it('should fail accessing other user chatbot', async () => {
      const otherUser = await createTestUser(prisma, {
        email: 'other@example.com',
      });

      const otherChatbot = await createTestChatbot(prisma, {
        ownerId: otherUser.id,
        tenantId: otherUser.tenantId,
      });

      const response = await request(app)
        .get(`/api/chatbots/${otherChatbot.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/chatbots/:id', () => {
    let testChatbot: any;

    beforeEach(async () => {
      testChatbot = await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
      });
    });

    it('should update chatbot successfully', async () => {
      const updateData = {
        name: 'Updated Bot Name',
        description: 'Updated description',
        temperature: 0.9,
      };

      const response = await request(app)
        .put(`/api/chatbots/${testChatbot.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.temperature).toBe(updateData.temperature);
    });

    it('should fail with invalid update data', async () => {
      const invalidData = {
        temperature: 5.0, // Invalid temperature (should be 0-2)
      };

      const response = await request(app)
        .put(`/api/chatbots/${testChatbot.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail updating non-existent chatbot', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/chatbots/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/chatbots/:id', () => {
    let testChatbot: any;

    beforeEach(async () => {
      testChatbot = await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
      });
    });

    it('should delete chatbot successfully', async () => {
      const response = await request(app)
        .delete(`/api/chatbots/${testChatbot.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Chatbot deleted successfully');

      // Verify chatbot is deleted
      const getResponse = await request(app)
        .get(`/api/chatbots/${testChatbot.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);
    });

    it('should fail deleting non-existent chatbot', async () => {
      const response = await request(app)
        .delete('/api/chatbots/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/chatbots/stats', () => {
    beforeEach(async () => {
      // Create multiple chatbots for stats
      await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
        name: 'Bot 1',
        totalMessages: 100,
        avgResponseTime: 1.5,
        satisfactionScore: 4.5,
      });

      await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
        name: 'Bot 2',
        totalMessages: 200,
        avgResponseTime: 2.0,
        satisfactionScore: 4.8,
        isActive: false,
      });
    });

    it('should get chatbot statistics', async () => {
      const response = await request(app)
        .get('/api/chatbots/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalChatbots).toBe(2);
      expect(response.body.data.activeChatbots).toBe(1);
      expect(response.body.data.totalMessages).toBe(300);
      expect(response.body.data.avgResponseTime).toBeCloseTo(1.75);
      expect(response.body.data.avgSatisfactionScore).toBeCloseTo(4.65);
    });
  });

  describe('POST /api/chatbots/:id/message', () => {
    let testChatbot: any;

    beforeEach(async () => {
      testChatbot = await createTestChatbot(prisma, {
        ownerId: testUser.id,
        tenantId: testUser.tenantId,
      });
    });

    it('should send message to chatbot', async () => {
      const messageData = {
        message: 'Hello, how can you help me?',
        sessionId: 'test-session-123',
      };

      const response = await request(app)
        .post(`/api/chatbots/${testChatbot.id}/message`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(messageData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBeDefined();
      expect(response.body.data.sessionId).toBe(messageData.sessionId);
    });

    it('should fail with empty message', async () => {
      const messageData = {
        message: '',
        sessionId: 'test-session-123',
      };

      const response = await request(app)
        .post(`/api/chatbots/${testChatbot.id}/message`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(messageData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
