import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { client } from './lib/apollo';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './providers/AppProvider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);