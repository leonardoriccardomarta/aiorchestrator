import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalMessages
      totalChatbots
      activeUsers
      responseTime
    }
  }
`;

export const GET_CHATBOTS = gql`
  query GetChatbots {
    chatbots {
      id
      name
      description
      ownerId
      tenantId
      isActive
      settings {
        model
        personality
        responseStyle
      }
      integrations {
        whatsapp
        messenger
        telegram
        shopify
      }
      metrics {
        totalMessages
        avgResponseTime
        satisfactionScore
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHATBOT = gql`
  query GetChatbot($id: ID!) {
    chatbot(id: $id) {
      id
      name
      description
      ownerId
      tenantId
      isActive
      settings {
        model
        personality
        responseStyle
      }
      integrations {
        whatsapp
        messenger
        telegram
        shopify
      }
      metrics {
        totalMessages
        avgResponseTime
        satisfactionScore
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FAQS = gql`
  query GetFaqs {
    faqs {
      id
      question
      answer
      category
      tenantId
      ownerId
      isActive
      tags
      createdAt
      updatedAt
    }
  }
`;

export const GET_FAQ = gql`
  query GetFaq($id: ID!) {
    faq(id: $id) {
      id
      question
      answer
      category
      tenantId
      ownerId
      isActive
      tags
      createdAt
      updatedAt
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      tenantId
      isActive
      isVerified
      roles
      createdAt
      updatedAt
    }
  }
`;