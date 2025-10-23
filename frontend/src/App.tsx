import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { ChatbotProvider } from './contexts/ChatbotContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <ChatbotProvider>
            <AppRouter />
          </ChatbotProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
