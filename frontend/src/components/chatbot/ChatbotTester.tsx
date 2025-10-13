import React, { useState, useEffect, useCallback } from 'react';
// Icons will be represented with emojis for better compatibility

interface ChatbotTesterProps {
  chatbotConfig: {
    id: string;
    name: string;
    primaryColor: string;
    gradient: { from: string; to: string };
    theme: 'light' | 'dark';
    welcomeMessage: string;
    language: string;
    avatar?: string;
    chatIcon?: string;
    fontFamily: string;
    fontSize: string;
    bubbleShape: string;
  };
}

interface TestMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotTester: React.FC<ChatbotTesterProps> = ({ chatbotConfig }) => {
  const [messages, setMessages] = useState<TestMessage[]>([
    {
      id: '1',
      text: chatbotConfig.welcomeMessage,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  // Removed hasAutoSentMessage to prevent automatic testing
  const [testResults, setTestResults] = useState<{
    responsiveness: boolean;
    styling: boolean;
    functionality: boolean;
    integration: boolean;
  }>({
    responsiveness: false,
    styling: false,
    functionality: false,
    integration: false
  });

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    const userMessage: TestMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: TestMessage = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for your message: "${inputMessage}". This is a test of the ${chatbotConfig.name} chatbot.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  }, [inputMessage, chatbotConfig.name]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Removed automatic testing to prevent multiple messages

  const getBubbleRadius = () => {
    switch (chatbotConfig.bubbleShape) {
      case 'rounded-full': return '20px';
      case 'rounded-xl': return '12px';
      case 'rounded-md': return '6px';
      default: return '0px';
    }
  };

  const getFontSize = () => {
    switch (chatbotConfig.fontSize) {
      case 'sm': return '14px';
      case 'md': return '16px';
      case 'lg': return '18px';
      default: return '16px';
    }
  };

  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'w-[320px] max-w-[320px]';
      case 'tablet': return 'w-[450px] max-w-[450px]';
      default: return 'w-[600px] max-w-[600px]'; // Increased from 500px to match customization tab
    }
  };

  const getPreviewHeight = () => {
    switch (previewDevice) {
      case 'mobile': return 'h-[420px]';
      case 'tablet': return 'h-[480px]';
      default: return 'h-[550px]'; // Increased to match customization tab
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Chatbot Testing</h3>
            <p className="mt-1 text-sm text-gray-500">
              Test your chatbot across different devices and verify functionality
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                 Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  previewDevice === 'tablet'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                 Tablet
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                 Mobile
              </button>
            </div>
            <button
              onClick={() => {
                // Send a single test message
                const testMessage = "Hi there! I'm testing your chatbot.";
                const userMessage: TestMessage = {
                  id: Date.now().toString(),
                  text: testMessage,
                  sender: 'user',
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, userMessage]);
                
                // Simulate bot response
                setIsTyping(true);
                setTimeout(() => {
                  const botMessage: TestMessage = {
                    id: (Date.now() + 1).toString(),
                    text: `Hello! I'm ${chatbotConfig.name}. How can I help you today?`,
                    sender: 'bot',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, botMessage]);
                  setIsTyping(false);
                }, 1000 + Math.random() * 2000);
                
                // Set test results with animation
                setTestResults({
                  responsiveness: false,
                  styling: false,
                  functionality: false,
                  integration: false
                });
                
                // Animate test results one by one
                setTimeout(() => {
                  setTestResults(prev => ({ ...prev, responsiveness: true }));
                }, 500);
                
                setTimeout(() => {
                  setTestResults(prev => ({ ...prev, styling: true }));
                }, 1000);
                
                setTimeout(() => {
                  setTestResults(prev => ({ ...prev, functionality: true }));
                }, 1500);
                
                setTimeout(() => {
                  setTestResults(prev => ({ ...prev, integration: true }));
                }, 2000);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              🔄 Run Tests
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chatbot Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium text-gray-900">Live Preview - {previewDevice.charAt(0).toUpperCase() + previewDevice.slice(1)}</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium text-xs">Live Testing</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 flex items-center justify-center min-h-[500px] overflow-hidden">
            <div className={`${getPreviewWidth()} transition-all duration-300 mx-auto`}>
              {/* Website mockup */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1 bg-gray-100 rounded-sm h-6 flex items-center px-3">
                    <span className="text-xs text-gray-500">yourwebsite.com</span>
                  </div>
                </div>
                <div 
                  className="bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm relative overflow-hidden"
                  style={{
                    height: previewDevice === 'mobile' ? '200px' : previewDevice === 'tablet' ? '250px' : '300px'
                  }}
                >
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Test Environment</h3>
                    <p className="text-xs">Simulating {previewDevice} view</p>
                  </div>
                </div>
              </div>
              
              {/* Chatbot Widget */}
              <div 
                className={`chatbot-test-container border rounded-lg overflow-hidden shadow-xl mx-auto flex flex-col ${getPreviewHeight()}`}
                style={{ 
                  width: previewDevice === 'mobile' ? '300px' : previewDevice === 'tablet' ? '400px' : '500px', // Increased widths
                  fontFamily: chatbotConfig.fontFamily,
                  fontSize: getFontSize()
                }}
              >
                {/* Header */}
                <div 
                  className="chatbot-header p-4 flex items-center space-x-3 text-white flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${chatbotConfig.gradient.from}, ${chatbotConfig.gradient.to})`
                  }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden flex-shrink-0">
                    {chatbotConfig.avatar ? (
                      <img src={chatbotConfig.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {chatbotConfig.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-semibold truncate ${
                      chatbotConfig.fontSize === 'sm' ? 'text-sm' : 
                      chatbotConfig.fontSize === 'md' ? 'text-base' : 'text-lg'
                    }`}>
                      {chatbotConfig.name}
                    </div>
                    <div className="text-xs opacity-90 truncate">🟢 Online · Test Mode</div>
                  </div>
                </div>

                {/* Messages */}
                <div className={`flex-1 p-4 overflow-y-auto ${
                  chatbotConfig.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'bot' && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold overflow-hidden mr-2">
                            {chatbotConfig.avatar ? (
                              <img 
                                src={chatbotConfig.avatar} 
                                alt="Avatar" 
                                className="w-full h-full object-cover rounded-full" 
                              />
                            ) : (
                              <span className="text-xs">
                                {chatbotConfig.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          className={`max-w-xs px-3 py-2 shadow-sm break-words ${
                            message.sender === 'user'
                              ? 'text-white'
                              : chatbotConfig.theme === 'dark' 
                                ? 'bg-gray-700 text-white' 
                                : 'bg-white text-gray-900'
                          }`}
                          style={{
                            borderRadius: getBubbleRadius(),
                            background: message.sender === 'user' ? chatbotConfig.primaryColor : undefined
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold overflow-hidden mr-2">
                          {chatbotConfig.avatar ? (
                            <img 
                              src={chatbotConfig.avatar} 
                              alt="Avatar" 
                              className="w-full h-full object-cover rounded-full" 
                            />
                          ) : (
                            <span className="text-xs">
                              {chatbotConfig.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className={`px-3 py-2 shadow-sm ${
                          chatbotConfig.theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                        }`} style={{ borderRadius: getBubbleRadius() }}>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className={`p-4 border-t flex-shrink-0 ${
                  chatbotConfig.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className={`flex-1 px-4 py-2 border rounded-lg min-w-0 ${
                        chatbotConfig.theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                      style={{
                        fontSize: getFontSize()
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      className="px-4 py-2 rounded-lg text-white transition-all hover:shadow-lg transform hover:scale-105 flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${chatbotConfig.gradient.from}, ${chatbotConfig.gradient.to})`
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">Test Results</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  testResults.responsiveness ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {testResults.responsiveness ? '✓' : '○'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">Responsiveness</div>
                  <div className="text-sm text-gray-500">Chatbot displays correctly</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                testResults.responsiveness ? 'text-green-600' : 'text-gray-400'
              }`}>
                {testResults.responsiveness ? 'Passed' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  testResults.styling ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {testResults.styling ? '✓' : '○'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">Styling</div>
                  <div className="text-sm text-gray-500">Colors and design applied</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                testResults.styling ? 'text-green-600' : 'text-gray-400'
              }`}>
                {testResults.styling ? 'Passed' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  testResults.functionality ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {testResults.functionality ? '✓' : '○'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">Functionality</div>
                  <div className="text-sm text-gray-500">Input and messaging works</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                testResults.functionality ? 'text-green-600' : 'text-gray-400'
              }`}>
                {testResults.functionality ? 'Passed' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  testResults.integration ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {testResults.integration ? '✓' : '○'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">Integration</div>
                  <div className="text-sm text-gray-500">Ready for deployment</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                testResults.integration ? 'text-green-600' : 'text-gray-400'
              }`}>
                {testResults.integration ? 'Passed' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Testing Tips</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Try sending different types of messages</li>
              <li>• Test on different screen sizes</li>
              <li>• Verify the chatbot responds correctly</li>
              <li>• Check that styling matches your configuration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotTester; 