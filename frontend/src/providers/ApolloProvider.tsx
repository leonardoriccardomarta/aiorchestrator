import React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { client } from '../lib/apollo';

export const ApolloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}; 