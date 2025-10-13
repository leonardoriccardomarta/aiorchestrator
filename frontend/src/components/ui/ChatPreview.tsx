import { useState } from 'react';

// Default chat icon as SVG
const DEFAULT_CHAT_ICON = `
<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
</svg>`;

interface ChatPreviewProps {
  name?: string;
  welcomeMessage?: string;
  avatar?: string;
  chatIcon?: string;
  iconPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  iconSize?: number;
  primaryColor?: string;
  gradient?: string;
  opacity?: number;
  font?: string;
  fontSize?: number;
  theme?: 'light' | 'dark';
  bubbleShape?: 'rounded' | 'square';
  previewDevice?: 'desktop' | 'tablet' | 'mobile';
  language?: 'en' | 'it' | 'es' | 'fr' | 'de';
}

type ThemeStyles = {
  bg: string;
  text: string;
  secondaryText: string;
  inputBg: string;
  border: string;
};

const ChatPreview: React.FC<ChatPreviewProps> = ({
  name = "AI Assistant",
  welcomeMessage = "Hi! How can I help you today?",
  avatar,
  chatIcon,
  iconSize = 48,
  primaryColor = "#2563eb",
  gradient,
  opacity = 1,
  font = "Inter",
  fontSize = 14,
  theme = "light",
  bubbleShape = "rounded",
  previewDevice = "desktop",
  language = "en",
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Translations for welcome message
  const translations: Record<ChatPreviewProps['language'] & string, string> = {
    en: "Hi! How can I help you today?",
    it: "Ciao! Come posso aiutarti oggi?",
    es: "¡Hola! ¿Cómo puedo ayudarte hoy?",
    fr: "Bonjour! Comment puis-je vous aider aujourd'hui?",
    de: "Hallo! Wie kann ich Ihnen heute helfen?"
  };

  const localizedMessage = welcomeMessage || translations[language];

  // Device preview styles with adjusted padding for mobile
  const _deviceStyles: Record<NonNullable<ChatPreviewProps['previewDevice']>, string> = {
    desktop: "w-[320px]",
    tablet: "w-[280px]",
    mobile: "w-[240px]"
  };

  const _inputStyles: Record<NonNullable<ChatPreviewProps['previewDevice']>, { padding: string, inputWidth: string }> = {
    desktop: { padding: "p-4", inputWidth: "w-full" },
    tablet: { padding: "p-3", inputWidth: "w-full" },
    mobile: { padding: "p-2", inputWidth: "w-[180px]" }
  };

  // Bubble shape styles
  const _bubbleStyles: Record<NonNullable<ChatPreviewProps['bubbleShape']>, string> = {
    rounded: "rounded-2xl",
    square: "rounded-none"
  };

  // Theme styles
  const _themeStyles: Record<NonNullable<ChatPreviewProps['theme']>, ThemeStyles> = {
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      secondaryText: "text-gray-500",
      inputBg: "bg-gray-50",
      border: "border-gray-200"
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      secondaryText: "text-gray-300",
      inputBg: "bg-gray-700",
      border: "border-gray-700"
    }
  };

  const currentTheme = _themeStyles[theme];

  return (
    <div className="absolute inset-0 flex items-end justify-end p-4">
      <div className="relative flex flex-col items-end">
        {/* Chat Window */}
        {isOpen && (
          <div 
            className={`mb-4 ${_deviceStyles[previewDevice]} ${currentTheme.bg} shadow-xl overflow-hidden ${_bubbleStyles[bubbleShape]}`}
            style={{ maxHeight: '80vh' }}
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center gap-3" 
              style={{ 
                background: gradient || primaryColor,
                opacity: opacity
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white text-xl" style={{ fontFamily: `"${font}", sans-serif` }}>{name.charAt(0)}</div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white" style={{ fontFamily: `"${font}", sans-serif`, fontSize: `${fontSize}px` }}>{name}</h3>
                <span className="text-xs text-white/80" style={{ fontFamily: `"${font}", sans-serif` }}>Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className={`h-[400px] overflow-y-auto p-4 ${currentTheme.inputBg}`}>
              <div className="flex items-start gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`text-sm ${currentTheme.text}`} style={{ fontFamily: `"${font}", sans-serif` }}>{name.charAt(0)}</div>
                  )}
                </div>
                <div className={`${currentTheme.bg} p-3 ${_bubbleStyles[bubbleShape]} shadow-sm max-w-[85%] ${currentTheme.border} border`}>
                  <p className={`${currentTheme.text}`} style={{ fontSize: `${fontSize}px`, fontFamily: `"${font}", sans-serif` }}>
                    {localizedMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className={`border-t ${currentTheme.border} ${currentTheme.bg} ${_inputStyles[previewDevice].padding}`}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className={`${_inputStyles[previewDevice].inputWidth} h-8 px-2 text-sm ${currentTheme.text} ${currentTheme.inputBg} ${_bubbleStyles[bubbleShape]} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{ fontFamily: `"${font}", sans-serif` }}
                />
                <button
                  className={`h-8 w-8 flex items-center justify-center ${_bubbleStyles[bubbleShape]} text-white shrink-0`}
                  style={{ background: gradient || primaryColor, opacity: opacity }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 12h14m-7-7l7 7-7 7" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          style={{
            background: gradient || primaryColor,
            opacity: opacity,
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          }}
        >
          {chatIcon ? (
            <img src={chatIcon} alt="Chat" className="w-1/2 h-1/2 object-contain" />
          ) : (
            <div className="w-6 h-6 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: DEFAULT_CHAT_ICON }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatPreview; 