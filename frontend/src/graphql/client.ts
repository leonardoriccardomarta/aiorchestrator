import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { API_URL } from '../config/constants';

const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`,
  credentials: 'same-origin', // This is more secure than 'include' for same-origin requests
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
}); 