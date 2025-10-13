import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        isActive
        isVerified
        tenantId
        roles
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        isActive
        isVerified
        tenantId
        roles
      }
    }
  }
`;

export const CREATE_CHATBOT = gql`
  mutation CreateChatBot($input: CreateChatBotInput!) {
    createChatBot(input: $input) {
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

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatBot($id: ID!, $input: CreateChatBotInput!) {
    updateChatBot(id: $id, input: $input) {
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

export const DELETE_CHATBOT = gql`
  mutation DeleteChatBot($id: ID!) {
    deleteChatBot(id: $id)
  }
`;

export const CREATE_FAQ = gql`
  mutation CreateFAQ($input: CreateFAQInput!) {
    createFAQ(input: $input) {
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

export const UPDATE_FAQ = gql`
  mutation UpdateFAQ($id: ID!, $input: UpdateFAQInput!) {
    updateFAQ(id: $id, input: $input) {
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

export const DELETE_FAQ = gql`
  mutation DeleteFAQ($id: ID!) {
    deleteFAQ(id: $id)
  }
`; 