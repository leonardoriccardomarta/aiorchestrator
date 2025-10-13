# AI Orchestrator API Documentation

## Overview

The AI Orchestrator API is a comprehensive backend service for managing AI chatbots, user authentication, subscriptions, and analytics. Built with Node.js, Express, TypeScript, and PostgreSQL.

## Base URL

```
Development: http://localhost:4000/api
Production: https://api.ai-orchestrator.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Types

- **Access Token**: Short-lived (7 days), used for API requests
- **Refresh Token**: Long-lived (30 days), used to obtain new access tokens

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **File Upload**: 50 uploads per hour per user

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Optional additional details
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `413` - Payload Too Large
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "tenant": {
        "id": "tenant-uuid",
        "name": "Default Tenant",
        "domain": "default"
      }
    },
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "User registered successfully"
}
```

### POST /auth/login

Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "tenant": {
        "id": "tenant-uuid",
        "name": "Default Tenant",
        "domain": "default"
      }
    },
    "token": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  },
  "message": "Login successful"
}
```

### POST /auth/refresh-token

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-access-token"
  },
  "message": "Token refreshed successfully"
}
```

### GET /auth/profile

Get current user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "tenant": {
      "id": "tenant-uuid",
      "name": "Default Tenant",
      "domain": "default"
    }
  }
}
```

### PUT /auth/profile

Update user profile.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@example.com"
}
```

### POST /auth/logout

Logout user (invalidates token).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Chatbot Endpoints

### GET /chatbots

Get user's chatbots with pagination.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `sortBy` (string): Field to sort by
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "chatbot-uuid",
      "name": "Customer Support Bot",
      "description": "Handles customer inquiries",
      "isActive": true,
      "model": "gpt-3.5-turbo",
      "personality": "helpful",
      "responseStyle": "professional",
      "temperature": 0.7,
      "maxTokens": 1000,
      "integrations": {
        "whatsappEnabled": true,
        "messengerEnabled": false,
        "telegramEnabled": false,
        "shopifyEnabled": true
      },
      "metrics": {
        "totalMessages": 1247,
        "avgResponseTime": 1.2,
        "satisfactionScore": 4.8
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST /chatbots

Create a new chatbot.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries 24/7",
  "model": "gpt-3.5-turbo",
  "personality": "helpful",
  "responseStyle": "professional",
  "temperature": 0.7,
  "maxTokens": 1000,
  "whatsappEnabled": true,
  "messengerEnabled": false,
  "telegramEnabled": false,
  "shopifyEnabled": true,
  "webhookUrl": "https://example.com/webhook"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chatbot-uuid",
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries 24/7",
    "isActive": true,
    "model": "gpt-3.5-turbo",
    "personality": "helpful",
    "responseStyle": "professional",
    "temperature": 0.7,
    "maxTokens": 1000,
    "integrations": {
      "whatsappEnabled": true,
      "messengerEnabled": false,
      "telegramEnabled": false,
      "shopifyEnabled": true
    },
    "webhookUrl": "https://example.com/webhook",
    "metrics": {
      "totalMessages": 0,
      "avgResponseTime": 0,
      "satisfactionScore": 0
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "Chatbot created successfully"
}
```

### GET /chatbots/:id

Get specific chatbot details.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "chatbot-uuid",
    "name": "Customer Support Bot",
    "description": "Handles customer inquiries",
    "isActive": true,
    "model": "gpt-3.5-turbo",
    "personality": "helpful",
    "responseStyle": "professional",
    "temperature": 0.7,
    "maxTokens": 1000,
    "integrations": {
      "whatsappEnabled": true,
      "messengerEnabled": false,
      "telegramEnabled": false,
      "shopifyEnabled": true
    },
    "webhookUrl": "https://example.com/webhook",
    "metrics": {
      "totalMessages": 1247,
      "avgResponseTime": 1.2,
      "satisfactionScore": 4.8
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### PUT /chatbots/:id

Update chatbot configuration.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "name": "Updated Bot Name",
  "description": "Updated description",
  "temperature": 0.9,
  "isActive": true
}
```

### DELETE /chatbots/:id

Delete a chatbot.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Chatbot deleted successfully"
}
```

### GET /chatbots/stats

Get chatbot statistics for user.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalChatbots": 5,
    "activeChatbots": 3,
    "totalMessages": 15420,
    "avgResponseTime": 1.5,
    "avgSatisfactionScore": 4.6
  }
}
```

### POST /chatbots/:id/message

Send a message to chatbot (for testing).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "message": "Hello, how can you help me?",
  "sessionId": "session-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Hello! I'm here to help you. How can I assist you today?",
    "sessionId": "session-uuid",
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats

Get dashboard statistics.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMessages": 15420,
    "totalChatbots": 5,
    "activeUsers": 3,
    "responseTime": 1.5,
    "totalRevenue": 2990,
    "monthlyRevenue": 2990
  }
}
```

### GET /dashboard/activity

Get recent activity.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `limit` (number): Number of activities (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity-uuid",
      "type": "chatbot_created",
      "title": "Created chatbot \"Customer Support Bot\"",
      "description": "No description",
      "timestamp": "2023-01-01T00:00:00.000Z",
      "data": {
        "chatbotId": "chatbot-uuid",
        "isActive": true,
        "totalMessages": 0
      }
    }
  ]
}
```

### GET /dashboard/analytics

Get analytics data.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `timeRange` (string): '24h', '7d', '30d', '90d' (default: '7d')

**Response:**
```json
{
  "success": true,
  "data": {
    "timeRange": "7d",
    "chartData": [
      {
        "date": "2023-01-01",
        "messages": 150,
        "chatbots": 1,
        "users": 0,
        "errors": 2,
        "apiCalls": 150
      }
    ],
    "totalEvents": 153,
    "summary": {
      "messages": 150,
      "chatbots": 1,
      "users": 0,
      "errors": 2,
      "avgEventsPerDay": 22
    }
  }
}
```

---

## Subscription Endpoints

### GET /subscriptions/plans

Get available subscription plans.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "free-plan",
      "name": "Free",
      "description": "Perfect for getting started",
      "price": 0,
      "currency": "usd",
      "interval": "MONTHLY",
      "intervalCount": 1,
      "isActive": true,
      "apiCallsLimit": 1000,
      "storageLimit": 1,
      "usersLimit": 1,
      "chatbotsLimit": 2,
      "features": [
        "Basic Chatbot",
        "Email Support",
        "Standard Templates"
      ]
    },
    {
      "id": "pro-plan",
      "name": "Pro",
      "description": "For growing businesses",
      "price": 2900,
      "currency": "usd",
      "interval": "MONTHLY",
      "intervalCount": 1,
      "isActive": true,
      "apiCallsLimit": 10000,
      "storageLimit": 10,
      "usersLimit": 5,
      "chatbotsLimit": 10,
      "features": [
        "Advanced Chatbot",
        "Priority Support",
        "Custom Templates",
        "Analytics Dashboard",
        "API Access"
      ]
    }
  ]
}
```

### GET /subscriptions

Get current user subscription.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "subscription-uuid",
    "userId": "user-uuid",
    "tenantId": "tenant-uuid",
    "planId": "pro-plan",
    "status": "ACTIVE",
    "currentPeriodStart": "2023-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2023-02-01T00:00:00.000Z",
    "cancelAtPeriodEnd": false,
    "plan": {
      "id": "pro-plan",
      "name": "Pro",
      "description": "For growing businesses",
      "price": 2900,
      "currency": "usd",
      "interval": "MONTHLY",
      "features": [
        "Advanced Chatbot",
        "Priority Support",
        "Custom Templates",
        "Analytics Dashboard",
        "API Access"
      ]
    }
  }
}
```

### POST /subscriptions

Create new subscription.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "planId": "pro-plan",
  "paymentMethodId": "pm_card_visa"
}
```

### GET /subscriptions/usage

Get subscription usage statistics.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": {
      "id": "pro-plan",
      "name": "Pro",
      "price": 2900
    },
    "usage": {
      "apiCalls": 2500,
      "storage": 2.5,
      "users": 3,
      "chatbots": 7
    },
    "limits": {
      "apiCalls": 10000,
      "storage": 10,
      "users": 5,
      "chatbots": 10
    }
  }
}
```

---

## Webhooks

The API supports webhooks for real-time notifications of events.

### Webhook Events

- `chatbot.created`
- `chatbot.updated`
- `chatbot.deleted`
- `message.received`
- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`

### Webhook Payload Format

```json
{
  "event": "chatbot.created",
  "data": {
    "id": "chatbot-uuid",
    "name": "Customer Support Bot",
    "ownerId": "user-uuid",
    "tenantId": "tenant-uuid"
  },
  "timestamp": "2023-01-01T00:00:00.000Z",
  "tenantId": "tenant-uuid"
}
```

---

## SDKs and Libraries

### JavaScript/TypeScript

```javascript
import { AIOrchestratorAPI } from '@ai-orchestrator/sdk';

const api = new AIOrchestratorAPI({
  baseURL: 'https://api.ai-orchestrator.com/api',
  token: 'your-access-token'
});

// Create a chatbot
const chatbot = await api.chatbots.create({
  name: 'My Bot',
  description: 'A helpful assistant'
});

// Send a message
const response = await api.chatbots.sendMessage(chatbot.id, {
  message: 'Hello!',
  sessionId: 'session-123'
});
```

### Python

```python
from ai_orchestrator import AIOrchestratorAPI

api = AIOrchestratorAPI(
    base_url='https://api.ai-orchestrator.com/api',
    token='your-access-token'
)

# Create a chatbot
chatbot = api.chatbots.create({
    'name': 'My Bot',
    'description': 'A helpful assistant'
})

# Send a message
response = api.chatbots.send_message(chatbot['id'], {
    'message': 'Hello!',
    'sessionId': 'session-123'
})
```

---

## Support

For API support and questions:

- **Email**: api-support@ai-orchestrator.com
- **Documentation**: https://docs.ai-orchestrator.com
- **Status Page**: https://status.ai-orchestrator.com
