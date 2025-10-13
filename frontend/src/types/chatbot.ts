export interface ChatbotConfig {
  name: string;
  welcomeMessage: string;
  avatar?: string;
  chatIcon?: string;
  iconPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  iconSize?: number;
  language?: 'en' | 'it' | 'es' | 'fr' | 'de';
  primaryColor?: string;
  gradient?: string;
  opacity?: number;
  font?: 'Inter' | 'Roboto' | 'Poppins' | 'Open Sans' | 'Lato';
  fontSize?: number;
  theme?: 'light' | 'dark';
  bubbleShape?: 'rounded' | 'square';
  previewDevice?: 'desktop' | 'tablet' | 'mobile';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export type ChatbotPosition = NonNullable<ChatbotConfig['position']>;
export type ChatbotLanguage = NonNullable<ChatbotConfig['language']>;
export type ChatbotFont = NonNullable<ChatbotConfig['font']>;
export type ChatbotDevice = NonNullable<ChatbotConfig['previewDevice']>; 