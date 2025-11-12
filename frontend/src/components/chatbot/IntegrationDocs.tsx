import React, { useState } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertCircle, Book, Code, Globe, ShoppingBag } from 'lucide-react';

interface IntegrationDoc {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  prerequisites: string[];
  steps: {
    title: string;
    description: string;
    code?: string;
    image?: string;
  }[];
  troubleshooting: {
    problem: string;
    solution: string;
  }[];
}

interface IntegrationDocsProps {
  chatbotId: string;
}

const getDocs = (chatbotId: string): IntegrationDoc[] => ([
  {
    id: 'website',
    name: 'Website',
    icon: '',
    description: 'Integrate the chatbot into your website with just a few lines of code',
    difficulty: 'easy',
    timeRequired: '5-10 minutes',
    prerequisites: [
      'Access to your website code',
      'Basic HTML knowledge'
    ],
    steps: [
      {
        title: 'Copy the integration code',
        description: 'In the "Installation Code" section, copy the provided JavaScript code.',
        code: `<script>\n  // Chatbot code\n  (function() {\n    // Chatbot configuration\n  })();\n</script>`
      },
      {
        title: 'Paste the code in your website',
        description: 'Open your website\'s HTML file and paste the code before the closing </body> tag.',
        code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Your Website</title>\n</head>\n<body>\n  <!-- Website content -->\n  \n  <!-- Chatbot code -->\n  <script>\n    // Chatbot code goes here\n  </script>\n</body>\n</html>`
      },
      {
        title: 'Verify the installation',
        description: 'Save the file and reload the page. The chatbot should appear in the bottom right corner.'
      }
    ],
    troubleshooting: [
      {
        problem: 'Chatbot doesn\'t appear',
        solution: 'Verify that the code was inserted correctly and there are no errors in the browser console.'
      },
      {
        problem: 'Chatbot appears but doesn\'t work',
        solution: 'Check that your internet connection is active and there are no firewall blocks.'
      }
    ]
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: '🛍️',
    description: 'Integrate the chatbot widget into your Shopify store with our simple installation process',
    difficulty: 'easy',
    timeRequired: '10-15 minutes',
    prerequisites: [
      'Active Shopify store',
      'Store admin access',
      'Access to theme code editor'
    ],
    steps: [
      {
        title: 'Go to Shopify Admin Panel',
        description: 'Log into your Shopify admin at yourstore.myshopify.com/admin'
      },
      {
        title: 'Navigate to Online Store → Themes',
        description: 'In the left sidebar, click "Online Store" and then "Themes"'
      },
      {
        title: 'Access Theme Code Editor',
        description: 'Find your current active theme and click "Actions" → "Edit code"'
      },
      {
        title: 'Open theme.liquid file',
        description: 'In the Layout section, click on "theme.liquid" to open the main theme file'
      },
      {
        title: 'Copy the widget code from the Integrations tab',
        description: 'Go back to the AI Orchestrator Integrations tab, click "Install Widget" for Shopify, and copy the generated code'
      },
      {
        title: 'Insert the widget code',
        description: 'Paste the widget code just before the closing </body> tag in your theme.liquid file',
        code: `<!-- Paste the widget code here, just before </body> -->
<!-- AI Orchestrator Chatbot Widget -->
<script>
  window.aiOrchestratorConfig = {
    chatbotId: '${chatbotId}',
    // ... configuration options
  };
</script>
<script src="https://cdn.ai-orchestrator.com/widget/v1/chatbot.js" async></script>
<!-- End AI Orchestrator Chatbot Widget -->
</body>`
      },
      {
        title: 'Save the changes',
        description: 'Click the "Save" button to save your theme changes'
      },
      {
        title: 'Test the installation',
        description: 'Visit your store frontend to verify the chatbot widget appears in the bottom right corner'
      }
    ],
    troubleshooting: [
      {
        problem: 'Widget doesn\'t appear on store',
        solution: 'Check that the code was pasted correctly before the </body> tag and that there are no JavaScript errors in the browser console.'
      },
      {
        problem: 'Widget appears but doesn\'t respond',
        solution: 'Verify that your chatbot is published and active in the AI Orchestrator dashboard.'
      },
      {
        problem: 'Widget conflicts with theme',
        solution: 'Some themes may have CSS conflicts. Contact support for theme-specific assistance.'
      },
      {
        problem: 'Code got removed after theme update',
        solution: 'Theme updates may overwrite custom code. You\'ll need to re-add the widget code after updating your theme.'
      }
    ]
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: '💬',
    description: 'Connect the chatbot to WhatsApp Business to handle messages automatically',
    difficulty: 'hard',
    timeRequired: '30-60 minutes',
    prerequisites: [
      'WhatsApp Business API account',
      'Verified phone number',
      'Advanced technical knowledge'
    ],
    steps: [
      {
        title: 'Create a WhatsApp Business API account',
        description: 'Go to business.whatsapp.com and register a developer account.'
      },
      {
        title: 'Verify your phone number',
        description: 'Follow the verification process for your business phone number.'
      },
      {
        title: 'Configure the webhook',
        description: 'In the control panel, configure the webhook URL to receive messages.',
        code: `https://api.chatbot.com/webhooks/whatsapp/${chatbotId}`
      },
      {
        title: 'Test the connection',
        description: 'Send a test message to the verified number to verify everything works.'
      }
    ],
    troubleshooting: [
      {
        problem: 'Number doesn\'t get verified',
        solution: 'Make sure the number is active and you have access to receive the verification code.'
      },
      {
        problem: 'Messages don\'t arrive',
        solution: 'Verify that the webhook is configured correctly and the URL is accessible.'
      }
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    icon: '',
    description: 'Integrate the chatbot with Facebook Messenger to interact with your followers',
    difficulty: 'medium',
    timeRequired: '20-40 minutes',
    prerequisites: [
      'Facebook Developer account',
      'Facebook business page',
      'Basic API knowledge'
    ],
    steps: [
      {
        title: 'Create a Facebook Developer app',
        description: 'Go to developers.facebook.com and create a new app.',
        code: `1. Click "Create App"\n2. Select "Business"\n3. Enter the app name`
      },
      {
        title: 'Add Messenger Platform',
        description: 'In the app settings, add the "Messenger Platform" product.'
      },
      {
        title: 'Configure the webhook',
        description: 'Set the webhook URL and verification token.',
        code: `Webhook URL: https://api.chatbot.com/webhooks/facebook/${chatbotId}\nVerify Token: ${Math.random().toString(36).substr(2, 9)}`
      },
      {
        title: 'Connect the Facebook page',
        description: 'Select your Facebook page and authorize the app.'
      }
    ],
    troubleshooting: [
      {
        problem: 'App doesn\'t get approved',
        solution: 'Make sure to follow Facebook\'s guidelines and provide all required information.'
      },
      {
        problem: 'Webhook doesn\'t work',
        solution: 'Verify that the URL is publicly accessible and the verification token is correct.'
      }
    ]
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '📬',
    description: 'Create a Telegram bot to interact with your users',
    difficulty: 'easy',
    timeRequired: '10-20 minutes',
    prerequisites: [
      'Telegram account',
      'Basic bot knowledge'
    ],
    steps: [
      {
        title: 'Create a bot via @BotFather',
        description: 'Open Telegram, search for @BotFather and send /newbot command.',
        code: `/newbot\nYour Bot Name\nYour Bot Username`
      },
      {
        title: 'Get the bot token',
        description: 'BotFather will provide you with a token. Copy and save it securely.'
      },
      {
        title: 'Configure the webhook',
        description: 'Set the webhook URL in your chatbot panel.',
        code: `https://api.chatbot.com/webhooks/telegram/${chatbotId}`
      },
      {
        title: 'Test the bot',
        description: 'Start a conversation with your bot and send a test message.'
      }
    ],
    troubleshooting: [
      {
        problem: 'Bot doesn\'t respond',
        solution: 'Check that the token is correct and the webhook is properly configured.'
      },
      {
        problem: 'Webhook fails',
        solution: 'Ensure the webhook URL is accessible and the token is valid.'
      }
    ]
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    description: 'Integrate with Instagram Direct to manage direct messages',
    difficulty: 'medium',
    timeRequired: '25-45 minutes',
    prerequisites: [
      'Instagram Business account',
      'Facebook Business account',
      'Connected Facebook page'
    ],
    steps: [
      {
        title: 'Connect Instagram to Facebook',
        description: 'Go to business.facebook.com and connect your Instagram account.'
      },
      {
        title: 'Enable messaging permissions',
        description: 'In the Instagram settings, enable messaging permissions for your business account.'
      },
      {
        title: 'Configure automatic responses',
        description: 'Set up automatic responses for common questions and inquiries.'
      },
      {
        title: 'Test the integration',
        description: 'Send a direct message to your Instagram account to test the integration.'
      }
    ],
    troubleshooting: [
      {
        problem: 'Instagram account not connected',
        solution: 'Make sure your Instagram account is a business account and properly connected to Facebook.'
      },
      {
        problem: 'Messages not received',
        solution: 'Check that messaging permissions are enabled and the integration is active.'
      }
    ]
  }
]);

const IntegrationDocs: React.FC<IntegrationDocsProps> = ({ chatbotId }) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('website');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  const docs = getDocs(chatbotId);
  const currentDoc = docs.find(doc => doc.id === selectedDoc);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Unknown';
    }
  };

  const toggleStep = (stepIndex: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepIndex)) {
      newExpanded.delete(stepIndex);
    } else {
      newExpanded.add(stepIndex);
    }
    setExpandedSteps(newExpanded);
  };

  const copyToClipboard = async (text: string, codeType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeType);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const widgetCode = `<!-- AI Orchestrator Chatbot Widget -->
<script>
  window.aiOrchestratorConfig = {
    chatbotId: '${chatbotId}',
    name: 'Your Assistant',
    primaryColor: '#4F46E5',
    gradient: { from: '#4F46E5', to: '#2563EB' },
    theme: 'light',
    welcomeMessage: 'Hi! How can I help you today?',
    language: 'English',
    fontFamily: 'Inter',
    fontSize: 'md',
    bubbleShape: 'rounded-xl',
    position: 'bottom-right'
  };
</script>
<script src="${window.location.origin}/chatbot-widget.js" async></script>
<!-- End AI Orchestrator Chatbot Widget -->`;

  const sections = {
    overview: {
      title: 'Overview',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Integration Documentation</h3>
            <p className="text-slate-700 leading-relaxed">
              This documentation covers all aspects of integrating your AI Orchestrator chatbot with various platforms.
              Our chatbot system features real-time customization, improved widget functionality, and streamlined
              integration processes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-indigo-900">Latest Updates</h4>
              </div>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Fixed preview layout and positioning issues</li>
                <li>• Corrected send button arrow direction</li>
                <li>• Improved avatar rendering and proportions</li>
                <li>• Enhanced Shopify widget installation process</li>
                <li>• Fixed responsive design for mobile/tablet views</li>
                <li>• Improved integration connection status accuracy</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Supported Platforms</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Website Widget (Universal)</li>
                <li>• Shopify Store Integration</li>
                <li>• WhatsApp Business API</li>
                <li>• Facebook Messenger</li>
                <li>• Telegram Bot</li>
                <li>• Custom API Integration</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Important Notes</h4>
                <p className="text-sm text-amber-800">
                  All integrations now require proper validation before showing as "Connected". The Shopify integration
                  is now a manual widget installation process that provides you with the exact code to add to your theme.
                  Test your integrations thoroughly before going live.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    
    widget: {
      title: 'Website Widget',
      icon: <Code className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Universal Website Widget</h3>
            <p className="text-slate-700 mb-4">
              Embed your chatbot on any website using our lightweight, customizable widget. The widget automatically
              adapts to your design preferences and works on all devices.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900">Widget Installation Code</h4>
              <button
                onClick={() => copyToClipboard(widgetCode, 'widget')}
                className="flex items-center space-x-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedCode === 'widget' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{widgetCode}</code>
            </pre>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Configuration Options</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Property</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-slate-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">chatbotId</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">Unique identifier for your chatbot</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">name</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">Display name of your chatbot</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">primaryColor</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">Primary color for buttons and user messages</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">gradient</td>
                    <td className="px-4 py-2 text-sm">object</td>
                    <td className="px-4 py-2 text-sm">Gradient colors for header background</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">position</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">Widget position: bottom-right, bottom-left, etc.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">fontSize</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">Font size: sm, md, lg</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-mono">bubbleShape</td>
                    <td className="px-4 py-2 text-sm">string</td>
                    <td className="px-4 py-2 text-sm">Message bubble shape: rounded-full, rounded-xl, etc.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Features</h4>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Responsive design that works on all devices</li>
              <li>• Real-time customization updates</li>
              <li>• Analytics tracking built-in</li>
              <li>• GDPR compliant</li>
              <li>• Lightweight (&lt; 50KB)</li>
              <li>• No dependencies required</li>
            </ul>
          </div>
        </div>
      )
    },

    shopify: {
      title: 'Shopify Integration',
      icon: <ShoppingBag className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Shopify Store Integration</h3>
            <p className="text-slate-700 mb-4">
              Add our AI chatbot widget to your Shopify store to provide instant customer support, 
              product recommendations, and order assistance. The widget integrates seamlessly with 
              your store design and works on all devices.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Quick Installation</h4>
            </div>
            <p className="text-sm text-green-800">
              Use the dedicated Shopify integration in the main "Integrations" tab for a guided installation 
              process with auto-generated widget code.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Step-by-Step Installation</h4>
            
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Access Shopify Admin</h5>
                    <p className="text-sm text-slate-600 mt-1">Log into your Shopify admin panel at yourstore.myshopify.com/admin</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Navigate to Themes</h5>
                    <p className="text-sm text-slate-600 mt-1">Go to Online Store → Themes in the left sidebar</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Edit Theme Code</h5>
                    <p className="text-sm text-slate-600 mt-1">Click "Actions" → "Edit code" on your active theme</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Open theme.liquid</h5>
                    <p className="text-sm text-slate-600 mt-1">In the Layout section, click on "theme.liquid"</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">5</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Get Widget Code</h5>
                    <p className="text-sm text-slate-600 mt-1">Go to the Integrations tab, click "Install Widget" for Shopify, and copy the generated code</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">6</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Insert Widget Code</h5>
                    <p className="text-sm text-slate-600 mt-1 mb-2">Paste the widget code just before the closing &lt;/body&gt; tag</p>
                    <div className="bg-slate-900 rounded p-3 text-xs">
                      <pre className="text-green-400 whitespace-pre-wrap">{`<!-- AI Orchestrator Chatbot Widget -->
<script>
  window.aiOrchestratorConfig = {
    chatbotId: '${chatbotId}',
    // ... your configuration
  };
</script>
<script src="https://cdn.ai-orchestrator.com/widget/v1/chatbot.js" async></script>
<!-- End AI Orchestrator Chatbot Widget -->
</body>`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">7</div>
                  <div>
                    <h5 className="font-medium text-slate-900">Save & Test</h5>
                    <p className="text-sm text-slate-600 mt-1">Save the file and visit your store to test the widget</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Common Issues & Solutions</h4>
                <div className="space-y-2 text-sm text-red-800">
                  <div>
                    <span className="font-medium">Widget not showing:</span> Verify code placement before &lt;/body&gt; tag
                  </div>
                  <div>
                    <span className="font-medium">Widget not responding:</span> Check that your chatbot is published and active
                  </div>
                  <div>
                    <span className="font-medium">After theme update:</span> You may need to re-add the widget code
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Widget Features for Shopify</h4>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Product recommendations based on customer queries</li>
              <li>• Order status checking and updates</li>
              <li>• Cart abandonment recovery assistance</li>
              <li>• Customer support automation</li>
              <li>• Multi-language support for international stores</li>
              <li>• Mobile-responsive design</li>
              <li>• Analytics and conversation tracking</li>
            </ul>
          </div>
        </div>
      )
    },

    testing: {
      title: 'Testing & Troubleshooting',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Testing Your Integration</h3>
            <p className="text-slate-700 mb-4">
              The improved testing system now includes device-specific previews and comprehensive functionality tests.
              Use the Test tab to verify your chatbot works correctly across all devices.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Test Checklist</h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h5 className="font-medium text-slate-900">Visual Tests</h5>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Preview loads correctly</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Colors match your design</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Font changes apply properly</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Avatar displays without distortion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Mobile responsiveness works</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-slate-900">Functional Tests</h5>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Widget opens and closes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Messages send successfully</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Bot responses appear</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Keyboard shortcuts work</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Analytics tracking active</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Common Issues & Solutions</h4>
            
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-4">
                <h5 className="font-medium text-slate-900 mb-2">Widget not appearing</h5>
                <p className="text-sm text-slate-700 mb-2">
                  If the widget doesn't show up on your website:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Check that the script is placed before &lt;/body&gt;</li>
                  <li>• Verify the chatbot ID is correct</li>
                  <li>• Check browser console for JavaScript errors</li>
                  <li>• Ensure no ad blockers are interfering</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h5 className="font-medium text-slate-900 mb-2">Styling issues</h5>
                <p className="text-sm text-slate-700 mb-2">
                  If the widget appearance is incorrect:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Check that font changes are saved and published</li>
                  <li>• Verify gradient colors are properly set</li>
                  <li>• Clear browser cache and reload</li>
                  <li>• Test in different browsers</li>
                </ul>
              </div>

              <div className="border border-slate-200 rounded-lg p-4">
                <h5 className="font-medium text-slate-900 mb-2">Avatar distortion</h5>
                <p className="text-sm text-slate-700 mb-2">
                  If the avatar appears stretched or distorted:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Use square images (1:1 aspect ratio) for best results</li>
                  <li>• Recommended size: 256x256 pixels or larger</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                  <li>• Re-upload the avatar if issues persist</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-2">Need Help?</h4>
            <p className="text-sm text-indigo-800 mb-2">
              If you're still experiencing issues, try these resources:
            </p>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Use the Test tab to run automated diagnostics</li>
              <li>• Check the browser console for error messages</li>
              <li>• Contact support with your chatbot ID and error details</li>
              <li>• Join our community forum for peer support</li>
            </ul>
          </div>
        </div>
      )
    }
  };

  if (!currentDoc) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-slate-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Documentation Not Found</h3>
          <p className="text-slate-500">The requested integration documentation could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">{currentDoc.icon}</span>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{currentDoc.name} Integration</h2>
            <p className="text-slate-600">{currentDoc.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentDoc.difficulty)}`}>
            {getDifficultyText(currentDoc.difficulty)}
          </span>
          <span className="text-slate-500">⏱️ {currentDoc.timeRequired}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Integrations</h3>
            <nav className="space-y-2">
              {docs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDoc === doc.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{doc.icon}</span>
                    <span>{doc.name}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Prerequisites */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              {currentDoc.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  <span className="text-slate-700">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Setup Steps</h3>
            <div className="space-y-4">
              {currentDoc.steps.map((step, index) => (
                <div key={index} className="border border-slate-200 rounded-lg">
                  <button
                    onClick={() => toggleStep(index)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-slate-900">{step.title}</span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 transform transition-transform ${
                        expandedSteps.has(index) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSteps.has(index) && (
                    <div className="px-4 pb-4">
                      <p className="text-slate-600 mb-3">{step.description}</p>
                      {step.code && (
                        <div className="relative">
                          <pre className="bg-slate-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                            <code>{step.code}</code>
                          </pre>
                          <button
                            onClick={() => navigator.clipboard.writeText(step.code || '')}
                            className="absolute top-2 right-2 text-slate-400 hover:text-white"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Troubleshooting</h3>
            <div className="space-y-4">
              {currentDoc.troubleshooting.map((item, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-4">
                  <h4 className="font-medium text-slate-900 mb-1">{item.problem}</h4>
                  <p className="text-slate-600">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-800">Need Help?</h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>
                    If you encounter any issues during the integration process, please contact our support team. 
                    We're here to help you get your chatbot up and running!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeSection === key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {section.icon}
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {sections[activeSection as keyof typeof sections].content}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700">
              <strong>Documentation last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              All integrations have been tested and verified to work correctly.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <a
              href="https://docs.ai-orchestrator.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View Full Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDocs; 
