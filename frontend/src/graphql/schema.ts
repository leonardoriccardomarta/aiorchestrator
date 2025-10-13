import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    echo(message: String!): String
  }

  type Subscription {
    countdown(from: Int!): Int!
  }
`; 