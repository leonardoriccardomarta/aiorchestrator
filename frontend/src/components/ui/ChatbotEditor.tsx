import React from 'react';
import ChatbotCustomizer from './ChatbotCustomizer';
import { ColorConfig } from './ColorPicker';

export interface ChatbotConfig {
  name: string;
  welcomeMessage: string;
  theme: 'light' | 'dark';
  colors: ColorConfig;
  position: 'bottom-right' | 'bottom-left' | 'center';
  deviceSize: 'mobile' | 'tablet' | 'desktop';
  font: {
    family: string;
    size: string;
    weight: number;
  };
  bubbleShape: 'rounded' | 'square' | 'sharp' | 'bubble';
  botAvatar: string;
  chatIcon: string;
  openingAnimation: 'fade' | 'slide' | 'bounce' | 'scale';
  messageAnimation: 'fade' | 'slide' | 'bounce' | 'typing';
  animationSpeed: number;
  language: string;
  integrations: {
    website: boolean;
    mobileApp: boolean;
    facebook: boolean;
    twitter: boolean;
    whatsapp: boolean;
    telegram: boolean;
  };
}

interface ChatbotEditorProps {
  config: ChatbotConfig;
  onConfigChange: (config: ChatbotConfig) => void;
}

const ChatbotEditor: React.FC<ChatbotEditorProps> = ({ config, onConfigChange }) => {
  return (
    <div className="h-full">
      <ChatbotCustomizer config={config} onChange={onConfigChange} />
    </div>
  );
};

export default ChatbotEditor; 