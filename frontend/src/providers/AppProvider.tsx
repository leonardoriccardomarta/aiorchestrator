import React from 'react';
import { ResponsiveProvider } from '../components/ResponsiveProvider';
import { ThemeProvider } from '../components/ui/design-system/ThemeProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ai-orchestrator-theme">
      <ResponsiveProvider>
        {children}
      </ResponsiveProvider>
    </ThemeProvider>
  );
};
