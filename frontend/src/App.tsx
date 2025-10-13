import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { UserProvider } from './contexts/UserContext';
import { ChatbotProvider } from './contexts/ChatbotContext';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <ChatbotProvider>
          <AppRouter />
        </ChatbotProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
