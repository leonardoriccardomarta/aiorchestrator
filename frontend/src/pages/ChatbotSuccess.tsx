import React from 'react';
import { CheckCircle, Copy, Code, Globe, Smartphone, MessageCircle, Phone, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatbotSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  const scriptCode = `<script>
  window.chatbotConfig = {
    token: "YOUR_CHATBOT_TOKEN"
  };
</script>
<script src="https://your-domain.com/chatbot.js"></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const integrationOptions = [
    {
      title: "Website Integration",
      description: "Add the chatbot to your website with a simple code snippet",
      icon: Globe,
      code: scriptCode,
    },
    {
      title: "Shopify",
      description: "Connect your Shopify store",
      icon: Globe,
      instructions: `To integrate with your Shopify store:

1. Click the "Connect Shopify Store" button
2. Log in to your Shopify admin
3. Select the store you want to connect
4. Review and accept the permissions

The chatbot will be automatically:
- Added to your store's theme
- Configured to access your product catalog
- Set up to handle customer service queries
- Integrated with your order management system

Benefits:
- Automatic product recommendations
- Order status updates
- Inventory checking
- Customer support automation
- Shopping cart assistance`,
    },
    {
      title: "WhatsApp",
      description: "Connect your WhatsApp Business account",
      icon: Phone,
      instructions: "To integrate with WhatsApp Business API:\n1. Go to WhatsApp Business Platform\n2. Create a Business Account\n3. Get your API credentials\n4. Configure webhook URL",
    },
    {
      title: "Telegram",
      description: "Add your chatbot to Telegram",
      icon: MessageCircle,
      instructions: "To integrate with Telegram:\n1. Talk to @BotFather on Telegram\n2. Create a new bot and get the token\n3. Configure webhook URL\n4. Customize bot commands",
    },
    {
      title: "Facebook Messenger",
      description: "Add the chatbot to your Facebook page",
      icon: Facebook,
      instructions: "To integrate with Facebook Messenger:\n1. Go to Facebook Developers\n2. Create a new app\n3. Configure Messenger settings\n4. Set up webhooks\n5. Get page access token",
    },
    {
      title: "Mobile SDK",
      description: "Integrate the chatbot in your iOS or Android app",
      icon: Smartphone,
      instructions: "Mobile SDK Integration Steps:\n1. Install the SDK via npm/pod\n2. Initialize with your API key\n3. Add chat UI components\n4. Configure push notifications",
    },
    {
      title: "API Integration",
      description: "Use our API to build custom integrations",
      icon: Code,
      instructions: "API Integration Guide:\n1. Get your API key from dashboard\n2. Read the API documentation\n3. Use our client libraries\n4. Test endpoints in sandbox",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chatbot Published Successfully!</h1>
          <p className="text-lg text-gray-600">Your chatbot is now ready to be integrated. Choose your preferred integration method below.</p>
        </div>

        {/* Integration Options */}
        <div className="space-y-8">
          {/* Website Integration */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Website Integration</h3>
                  <p className="text-sm text-gray-500">Add this code to your website's HTML</p>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-800">{scriptCode}</code>
                </pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 p-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              
              {/* Shopify Integration */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/shopify-logo.svg" alt="Shopify" className="h-8 w-8" />
                    <div>
                      <h4 className="font-medium text-gray-900">Connect with Shopify</h4>
                      <p className="text-sm text-gray-500">Integrate the chatbot directly with your Shopify store</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOption('Shopify')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#5E8E3E] rounded-md hover:bg-[#4A7331] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5E8E3E]"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.9999 11.9999C21.9999 17.5228 17.5228 21.9999 11.9999 21.9999C6.47703 21.9999 1.99994 17.5228 1.99994 11.9999C1.99994 6.47703 6.47703 1.99994 11.9999 1.99994C17.5228 1.99994 21.9999 6.47703 21.9999 11.9999Z" />
                      <path fill="white" d="M10.5 16.5L15.5 11.9999L10.5 7.49994V16.5Z" />
                    </svg>
                    Connect Shopify Store
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Other Integration Options */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Integration Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {integrationOptions.slice(1).map((option, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-6 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => setSelectedOption(option.title)}
                  >
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <option.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="text-base font-medium text-gray-900 text-center mb-2">{option.title}</h4>
                    <p className="text-sm text-gray-500 text-center">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration Instructions Modal */}
          {selectedOption && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {integrationOptions.find(opt => opt.title === selectedOption)?.title} Integration
                  </h3>
                  <button
                    onClick={() => setSelectedOption(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {integrationOptions.find(opt => opt.title === selectedOption)?.instructions}
                  </pre>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedOption(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back to Editor
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotSuccess; 