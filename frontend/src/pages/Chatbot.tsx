import React, { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../config/constants';

// Dichiarazione TypeScript per window.AIOrchestratorConfig
declare global {
  interface Window {
    AIOrchestratorConfig?: {
      chatbotId: string;
      apiKey: string;
      theme: string;
      title: string;
      placeholder: string;
      showAvatar: boolean;
      welcomeMessage: string;
      primaryLanguage: string;
      primaryColor: string;
      secondaryColor?: string;
      primaryDarkColor: string;
      headerLightColor: string;
      headerDarkColor: string;
      textColor: string;
      accentColor: string;
      fontFamily?: string;
      logo?: string;
    };
  }
}
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Copy, 
  ExternalLink, 
  Plus,
  Play,
  Pause,
  Globe,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Code,
  Save,
  X,
  Send,
  Loader2,
  Download,
  HelpCircle,
  Palette,
  Upload,
  RotateCcw,
  Lock,
  RefreshCw
} from 'lucide-react';
import ChatbotManagement from '../components/ChatbotManagement';
import EmbedCodeGenerator from '../components/EmbedCodeGenerator';
import ChatbotTour from '../components/ChatbotTour';
import PlanLimitations from '../components/PlanLimitations';
import TourButton from '../components/TourButton';
import { useUser } from '../contexts/UserContext';
import { useChatbot } from '../contexts/ChatbotContext';
import AddChatbotModal from '../components/AddChatbotModal';
import ChatbotSelector from '../components/ChatbotSelector';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'button' | 'card';
}

const Chatbot: React.FC = () => {
  const { user } = useUser();
  const { chatbots, selectedChatbot, selectChatbot, updateChatbot } = useChatbot();
  const [activeTab, setActiveTab] = useState<'chat' | 'embed' | 'manage'>('chat');
  const [currentChatbotId, setCurrentChatbotId] = useState<string>('');
  const [chatbotName, setChatbotName] = useState<string>('My AI Assistant');
  const [welcomeMessage, setWelcomeMessage] = useState<string>("Hello! I'm your AI assistant. How can I help you today?");
  const [primaryLanguage, setPrimaryLanguage] = useState<string>('auto');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [chatbotDeleted, setChatbotDeleted] = useState(false);
  const [showAddChatbotModal, setShowAddChatbotModal] = useState(false);
  const [isFirstChatbot, setIsFirstChatbot] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Widget customization state
  const [widgetTheme, setWidgetTheme] = useState<'blue' | 'purple' | 'green' | 'red' | 'orange' | 'pink' | 'indigo' | 'teal'>('blue');
  const [widgetTitle, setWidgetTitle] = useState<string>('AI Support');
  const [widgetPlaceholder, setWidgetPlaceholder] = useState<string>('Type your message...');
  const [widgetMessage, setWidgetMessage] = useState<string>('Hello! I\'m your AI assistant. How can I help you today?');
  const [showWidgetAvatar, setShowWidgetAvatar] = useState<boolean>(true);
  
  // Custom branding state (for professional+ plans) - only fontFamily and logo
  const [customBranding, setCustomBranding] = useState({
    fontFamily: 'Open Sans',
    logo: ''
  });
  
  // White-label state (for Business plan only)
  const [whiteLabelEnabled, setWhiteLabelEnabled] = useState(false);
  const [whiteLabelText, setWhiteLabelText] = useState('');
  
  // removed detectLanguage; use primaryLanguage only

  // Save widget customizations manually
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Track if branding has been loaded from database to prevent overwrites
  const brandingLoadedRef = React.useRef(false);
  const brandingModifiedRef = React.useRef(false);

  // Helper function to resize and compress logo to reduce file size
  const resizeLogo = (dataUrl: string, maxSize = 200): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions - ensure we maintain quality for display
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        // Use high-quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with good quality (0.85 instead of 0.7 for less sgranamento)
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        console.log(`📦 Logo resized: ${dataUrl.length} -> ${resizedDataUrl.length} chars`);
        resolve(resizedDataUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Helper function to check if a URL is a blob URL and convert it to base64 if needed
  const convertBlobToBase64 = async (url: string): Promise<string> => {
    // If it's already a data URL or not a blob URL, return as is
    if (!url.startsWith('blob:')) {
      return url;
    }
    
    try {
      // Convert blob URL to base64
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          // Resize and compress to keep URL short
          const resized = await resizeLogo(base64);
          resolve(resized);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('❌ Error converting blob to base64:', error);
      return url; // Return original if conversion fails
    }
  };

  // Auto-select chatbot when entering Chatbot page if none selected (ONLY on mount)
  const hasAutoSelectedRef = React.useRef(false);
  const pageMountRef = React.useRef(true);
  
  useEffect(() => {
    // Only run auto-selection on initial page mount, not when chatbots change
    if (pageMountRef.current && chatbots.length > 0 && !selectedChatbot) {
      console.log('🎯 Auto-selecting first chatbot on initial page mount');
      selectChatbot(chatbots[0].id);
      pageMountRef.current = false; // Only run once
    }
  }, []); // Empty deps - only run once on mount

  // Track previous chatbot ID to only load when chatbot actually changes
  const previousChatbotRef = React.useRef<string | null>(null);
  
  // Sync with ChatbotContext - IMPORTANT: This runs every time selectedChatbot changes
  useEffect(() => {
    if (selectedChatbot) {
      // Only reload if chatbot ID actually changed
      if (previousChatbotRef.current === selectedChatbot.id) {
        console.log('🔄 Chatbot unchanged, skipping reload');
        return;
      }
      
      console.log('🔄 Chatbot changed, loading data for:', selectedChatbot.id);
      console.log('🔄 Chatbot data:', selectedChatbot);
      
      // Reset branding loaded flag when chatbot changes
      brandingLoadedRef.current = false;
      previousChatbotRef.current = selectedChatbot.id;
      setCurrentChatbotId(selectedChatbot.id);
      setChatbotName(selectedChatbot.name || 'My AI Assistant');
      setWelcomeMessage(selectedChatbot.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
      setPrimaryLanguage(selectedChatbot.language || 'auto');
      
      // CRITICAL: Reset local state when chatbot changes to prevent data bleeding
      // Add welcome message for the selected chatbot instead of clearing all messages
      setMessages([{
        id: '1',
        text: selectedChatbot.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
      
      // Load widget customization settings
      if (selectedChatbot.settings) {
        const settings = typeof selectedChatbot.settings === 'string' ? JSON.parse(selectedChatbot.settings) : selectedChatbot.settings;
        
        // Load theme
        if (settings.theme) {
          console.log('🔄 Loading theme from database:', settings.theme);
          setWidgetTheme(settings.theme);
        }
        
        // Load placeholder
        if (settings.placeholder) {
          console.log('🔄 Loading placeholder from database:', settings.placeholder);
          setWidgetPlaceholder(settings.placeholder);
        }
        
        // Load avatar
        if (settings.showAvatar !== undefined) {
          console.log('🔄 Loading showAvatar from database:', settings.showAvatar);
          setShowWidgetAvatar(settings.showAvatar);
        }
        
        // Load title
        if (settings.title) {
          console.log('🔄 Loading title from database:', settings.title);
          setWidgetTitle(settings.title);
        } else {
          // Fallback to chatbot name if no title in settings
          setWidgetTitle(selectedChatbot.name || 'My AI Assistant');
        }
        
        // Load message
        if (settings.message) {
          console.log('🔄 Loading message from database:', settings.message);
          setWidgetMessage(settings.message);
        } else {
          // Fallback to welcome message if no message in settings
          setWidgetMessage(selectedChatbot.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
        }
        
        // Load custom branding settings (for professional+ plans)
        if (settings.branding) {
          // Update branding with logo handling
          console.log('🔄 Loading branding from database');
          // Check if logo is a blob URL
          const brandingToLoad = { ...settings.branding };
          console.log('🖼️ Loading branding from settings, logo:', brandingToLoad.logo ? brandingToLoad.logo.substring(0, 50) + '...' : 'empty');
          
          if (brandingToLoad.logo && brandingToLoad.logo.startsWith('blob:')) {
            console.log('⚠️ Logo is blob URL, converting...');
            // Blob URLs are temporary and expire - don't load them immediately
            // Load branding WITHOUT logo, then try to convert in background
            const brandingWithoutLogo = { ...brandingToLoad, logo: '' };
            setCustomBranding(prev => ({ ...prev, ...brandingWithoutLogo }));
            
            // Try to convert blob URL to base64 in background
            convertBlobToBase64(brandingToLoad.logo).then(base64Logo => {
              console.log('✅ Logo converted from blob to base64, length:', base64Logo.length);
              setCustomBranding(prev => ({ ...prev, logo: base64Logo }));
            }).catch(() => {
              console.log('⚠️ Could not convert blob URL, logo will be empty');
            });
          } else {
            // Logo is not a blob URL, load it directly
            setCustomBranding(prev => ({ ...prev, ...brandingToLoad }));
          }
        }
        
        // Load white-label settings (Business plan only)
        if (user?.planId === 'business' && settings.whiteLabel) {
          console.log('🔄 Loading white-label from database');
          setWhiteLabelEnabled(settings.whiteLabel.removeBranding || false);
          setWhiteLabelText(settings.whiteLabel.customText || '');
        }
        
        // Check if logo needs resizing (for non-blob URLs)
        if (settings.branding && settings.branding.logo && settings.branding.logo.length > 0 && !settings.branding.logo.startsWith('blob:') && settings.branding.logo.length > 150000) {
          console.log(`⚠️ Logo too large (${settings.branding.logo.length} chars), resizing...`);
          resizeLogo(settings.branding.logo, 200).then(async (resized) => {
            console.log(`✅ Logo resized from ${settings.branding.logo.length} to ${resized.length} chars`);
                setCustomBranding(prev => ({ ...prev, ...settings.branding, logo: resized }));
                // Auto-save the resized logo to database
                try {
                  await fetch(`${API_URL}/api/chatbots/${selectedChatbot.id}`, {
                    method: 'PATCH',
                    headers: { 
                      'Content-Type': 'application/json', 
                      'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
                    },
                    body: JSON.stringify({
                      settings: {
                        ...settings,
                        branding: {
                          ...settings.branding,
                          logo: resized
                        }
                      }
                    })
                  });
                  console.log('✅ Resized logo saved to database');
                } catch (e) {
                  console.error('Failed to save resized logo:', e);
                }
              }).catch(err => {
                console.error('Error resizing logo:', err);
                setCustomBranding(prev => ({ ...prev, ...settings.branding }));
              });
        }
      }
    }
  }, [selectedChatbot]);
  
  const saveWidgetCustomizations = async () => {
    if (!currentChatbotId) {
      console.log('❌ No chatbot ID, skipping save');
      return;
    }
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Convert blob URL to base64 and resize before saving if needed
    let brandingToSave = customBranding;
    if (user?.planId !== 'starter' && customBranding.logo) {
      let logoToSave = customBranding.logo;
      
      // Convert blob URL to base64 if needed
      if (customBranding.logo.startsWith('blob:')) {
        console.log('🔄 Converting blob URL to base64 before saving...');
        try {
          logoToSave = await convertBlobToBase64(customBranding.logo);
        } catch (error) {
          console.error('❌ Error converting blob URL before save (expired), removing:', error);
          logoToSave = '';
        }
      }
      
      // Always resize logo to 200px for quality (max size for crisp display)
      if (logoToSave && logoToSave.startsWith('data:')) {
        console.log('📐 Resizing logo to 200px for quality...');
        logoToSave = await resizeLogo(logoToSave, 200);
      }
      
      brandingToSave = { ...customBranding, logo: logoToSave };
      // Update state with converted/resized logo
      setCustomBranding(brandingToSave);
    }
    
    console.log('💾 Saving all chatbot settings (main + widget customizations)...', {
      chatbotId: currentChatbotId,
      name: widgetTitle, // widgetTitle is the chatbot name
      welcomeMessage: widgetMessage, // widgetMessage is the welcome message
      language: primaryLanguage,
      settings: {
        theme: widgetTheme,
        placeholder: widgetPlaceholder,
        showAvatar: showWidgetAvatar,
        title: widgetTitle,
        message: widgetMessage
      }
    });
    
    try {
      // Build new settings object without preserving old settings (to avoid double stringification issues)
      const newSettings: any = {
        theme: widgetTheme,
        placeholder: widgetPlaceholder,
        showAvatar: showWidgetAvatar,
        title: widgetTitle,
        message: widgetMessage
      };
      
      // Only add branding if user has professional+ plan
      if (user?.planId !== 'starter') {
        newSettings.branding = brandingToSave;
      }
      
      // Add white-label settings if user has Business plan
      if (user?.planId === 'business') {
        newSettings.whiteLabel = {
          removeBranding: whiteLabelEnabled,
          customText: whiteLabelText || ''
        };
      }
      
      const payload = {
        name: widgetTitle, // Save widgetTitle as chatbot name
        welcomeMessage: widgetMessage, // Save widgetMessage as chatbot welcomeMessage
        language: primaryLanguage,
        settings: newSettings
      };
      
      console.log('📤 Sending save request with payload:', JSON.stringify(payload).substring(0, 500) + '...');
      
      const response = await fetch(`${API_URL}/api/chatbots/${currentChatbotId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ All chatbot settings saved:', result);
        setSaveStatus('success');
        
        // Update local state to match saved values
        setChatbotName(widgetTitle);
        setWelcomeMessage(widgetMessage);
        
        // Dispatch event for sync (no external component to update)
        
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('❌ Save failed with status:', response.status);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('❌ Failed to save chatbot settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };


  // Theme palette (mirror of widget preview)
  const themeColors = {
    blue:   { 
      primary: 'from-indigo-600 to-indigo-700', 
      secondary: 'from-indigo-50 to-indigo-100', 
      text: 'text-indigo-900', 
      border: 'border-indigo-200',
      userMsg: 'bg-indigo-600', 
      send: 'bg-indigo-600' 
    },
    purple: { 
      primary: 'from-purple-600 to-purple-700', 
      secondary: 'from-purple-50 to-purple-100', 
      text: 'text-purple-900', 
      border: 'border-purple-200',
      userMsg: 'bg-purple-600', 
      send: 'bg-purple-600' 
    },
    green:  { 
      primary: 'from-green-600 to-green-700', 
      secondary: 'from-green-50 to-green-100', 
      text: 'text-green-900', 
      border: 'border-green-200',
      userMsg: 'bg-green-600', 
      send: 'bg-green-600' 
    },
    red:    { 
      primary: 'from-red-600 to-red-700', 
      secondary: 'from-red-50 to-red-100', 
      text: 'text-red-900', 
      border: 'border-red-200',
      userMsg: 'bg-red-600', 
      send: 'bg-red-600' 
    },
    orange: { 
      primary: 'from-orange-600 to-orange-700', 
      secondary: 'from-orange-50 to-orange-100', 
      text: 'text-orange-900', 
      border: 'border-orange-200',
      userMsg: 'bg-orange-600', 
      send: 'bg-orange-600' 
    },
    pink:   { 
      primary: 'from-pink-600 to-pink-700', 
      secondary: 'from-pink-50 to-pink-100', 
      text: 'text-pink-900', 
      border: 'border-pink-200',
      userMsg: 'bg-pink-600', 
      send: 'bg-pink-600' 
    },
    indigo: { 
      primary: 'from-indigo-600 to-indigo-700', 
      secondary: 'from-indigo-50 to-indigo-100', 
      text: 'text-indigo-900', 
      border: 'border-indigo-200',
      userMsg: 'bg-indigo-600', 
      send: 'bg-indigo-600' 
    },
    teal:   { 
      primary: 'from-teal-600 to-teal-700', 
      secondary: 'from-teal-50 to-teal-100', 
      text: 'text-teal-900', 
      border: 'border-teal-200',
      userMsg: 'bg-teal-600', 
      send: 'bg-teal-600' 
    }
  } as const;
  const tc = themeColors[widgetTheme] || themeColors.blue;

  const createDefaultChatbot = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chatbots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: 'My AI Assistant',
          description: 'Your personal AI assistant',
          settings: {
            language: 'auto',
            personality: 'professional',
            welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?"
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        const chatbot = result.data;
        setCurrentChatbotId(chatbot.id);
        setChatbotName(chatbot.name);
        setWelcomeMessage(chatbot.settings?.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
        setPrimaryLanguage(chatbot.language || 'auto');
        
        // Update chat welcome message
        setMessages([{
          id: '1',
          text: chatbot.settings?.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }]);
        
        console.log('Default chatbot created successfully:', chatbot.id);
      } else {
        console.error('Failed to create default chatbot:', result.error);
      }
    } catch (error) {
      console.error('Error creating default chatbot:', error);
    }
  };

  const loadChatbot = async (autoCreate = true) => {
    try {
      console.log('🔍 Loading chatbots...');
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token:', token ? 'exists' : 'missing');
      
      const res = await fetch(`${API_URL}/api/chatbots`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('📡 Response status:', res.status);
      const json = await res.json();
      console.log('📊 Response data:', json);
      
      if (json?.data && json.data.length > 0) {
        // Use selectedChatbot from context as source of truth
        const sourceChatbotId = selectedChatbot?.id || currentChatbotId;
        
        // If we have a specific chatbot ID, find that specific chatbot
        // Otherwise, use the first one
        let targetChatbot = sourceChatbotId 
          ? json.data.find((c: any) => c.id === sourceChatbotId) 
          : json.data[0];
        
        // If chatbot doesn't exist in data, fall back to first
        if (!targetChatbot) {
          targetChatbot = json.data[0];
        }
        
        console.log('✅ Found chatbot:', targetChatbot.id);
        setCurrentChatbotId(targetChatbot.id);
        setChatbotName(targetChatbot.name || 'My AI Assistant');
        setWelcomeMessage(targetChatbot.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?");
        setPrimaryLanguage(targetChatbot.language || 'auto');
        setChatbotDeleted(false);
        
        // Load widget customization settings
        console.log('🔧 Loading chatbot settings:', targetChatbot.settings);
        if (targetChatbot.settings) {
          const settings = typeof targetChatbot.settings === 'string' ? JSON.parse(targetChatbot.settings) : targetChatbot.settings;
          console.log('🔧 Parsed settings:', settings);
          if (settings.theme) {
            console.log('🔧 Setting theme:', settings.theme);
            setWidgetTheme(settings.theme);
          }
          if (settings.placeholder) {
            console.log('🔧 Setting placeholder:', settings.placeholder);
            setWidgetPlaceholder(settings.placeholder);
          }
          if (settings.showAvatar !== undefined) {
            console.log('🔧 Setting showAvatar:', settings.showAvatar);
            setShowWidgetAvatar(settings.showAvatar);
          }
          if (settings.title) {
            console.log('🔧 Setting title:', settings.title);
            setWidgetTitle(settings.title);
          }
          if (settings.message) {
            console.log('🔧 Setting message:', settings.message);
            setWidgetMessage(settings.message);
          }
        } else {
          console.log('🔧 No settings found, using defaults');
        }
        
        // Update chat welcome message
        setMessages([{
          id: '1',
          text: targetChatbot.welcomeMessage || "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        }]);
      } else {
        // Auto-create for first-time users or Starter plan users
        if (autoCreate || user?.planId === 'starter') {
          console.log('⚠️ No chatbots found, creating default chatbot...');
          await createDefaultChatbot();
        } else {
          console.log('⚠️ No chatbots found (after delete)');
          setChatbotDeleted(true);
        }
      }
    } catch (e) {
      console.error('❌ Error loading chatbot:', e);
    }
  };

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }]);
    // Removed loadChatbots call - chatbots are loaded automatically by ChatbotContext
  }, []);

  // Note: Removed auto-sync useEffects to avoid conflicts
  // Settings and customizations are now saved together when user clicks Save

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Memoize custom branding to prevent unnecessary re-renders
  const memoizedCustomBranding = useMemo(() => customBranding, [
    customBranding.fontFamily,
    customBranding.logo
  ]);

  // Expose widget configuration globally for live preview synchronization
  useEffect(() => {
    if (currentChatbotId) {
      const baseConfig = {
        chatbotId: currentChatbotId,
        apiKey: API_URL,
        theme: widgetTheme,
        title: widgetTitle,
        placeholder: widgetPlaceholder,
        showAvatar: showWidgetAvatar,
        welcomeMessage: widgetMessage,
        primaryLanguage: primaryLanguage,
        primaryColor: getThemeColor(widgetTheme),
        primaryDarkColor: getThemeDarkColor(widgetTheme),
        headerLightColor: getThemeColor(widgetTheme),
        headerDarkColor: getThemeDarkColor(widgetTheme),
        textColor: '#1f2937',
        accentColor: getThemeColor(widgetTheme),
        logo: user?.planId !== 'starter' ? memoizedCustomBranding.logo : ''
      };

      // Add custom branding for professional+ plans (only fontFamily and logo)
      if (user?.planId !== 'starter') {
        window.AIOrchestratorConfig = {
          ...baseConfig,
          fontFamily: memoizedCustomBranding.fontFamily,
          logo: memoizedCustomBranding.logo
        } as Window['AIOrchestratorConfig'];
      } else {
        window.AIOrchestratorConfig = baseConfig;
      }
      
      console.log('🎯 Widget config exposed globally:', window.AIOrchestratorConfig);
    }
  }, [currentChatbotId, widgetTheme, widgetTitle, widgetPlaceholder, showWidgetAvatar, widgetMessage, primaryLanguage, memoizedCustomBranding, user?.planId]);

  // Listen for custom branding updates (removed BrandingSettings, only for sync now)
  useEffect(() => {
    const handleBrandingUpdate = (event: CustomEvent) => {
      const branding = event.detail;
      console.log('🔄 Received branding update:', branding);
      setCustomBranding(branding);
    };

    window.addEventListener('embedBrandingUpdated', handleBrandingUpdate as EventListener);
    
    return () => {
      window.removeEventListener('embedBrandingUpdated', handleBrandingUpdate as EventListener);
    };
  }, []);

  // Note: No auto-update needed - colors come from theme, we only store fontFamily and logo

  // Reset branding loaded flag when theme changes (so auto-update works on first theme change)
  useEffect(() => {
    brandingLoadedRef.current = false;
  }, [widgetTheme]);

  // Convert blob URLs to base64 automatically
  useEffect(() => {
    if (customBranding.logo && customBranding.logo.startsWith('blob:')) {
      convertBlobToBase64(customBranding.logo).then(base64Logo => {
        setCustomBranding(prev => ({ ...prev, logo: base64Logo }));
      }).catch(error => {
        console.error('❌ Error converting blob URL (likely expired), removing logo:', error);
        // Remove the expired blob URL - it can't be used anymore
        setCustomBranding(prev => ({ ...prev, logo: '' }));
      });
    }
  }, [customBranding.logo]);

  // Helper function to update custom branding and sync with settings
  const updateCustomBranding = (updates: Partial<typeof customBranding>) => {
    const newBranding = { ...customBranding, ...updates };
    setCustomBranding(newBranding);
    
    // Mark as modified to prevent database overwrite
    brandingModifiedRef.current = true;
    
    // Sync with settings
    window.dispatchEvent(new CustomEvent('embedBrandingUpdated', { detail: newBranding }));
  };

  // Helper function to update custom branding with logo blob conversion if needed
  const updateCustomBrandingWithLogo = async (updates: Partial<typeof customBranding>) => {
    // Check if logo is a blob URL and convert it
    if (updates.logo && updates.logo.startsWith('blob:')) {
      try {
        const base64Logo = await convertBlobToBase64(updates.logo);
        updates.logo = base64Logo;
      } catch (error) {
        console.error('❌ Error converting blob URL:', error);
      }
    }
    
    updateCustomBranding(updates);
  };

  // Reset custom branding to theme defaults
  const resetCustomBranding = async () => {
    const resetBranding = {
      fontFamily: 'Open Sans',
      logo: ''
    };
    
    // Update local state first
    updateCustomBranding(resetBranding);
    
    // Save to database immediately
    if (currentChatbotId) {
      try {
        const response = await fetch(`${API_URL}/api/chatbots/${currentChatbotId}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
          },
          body: JSON.stringify({
            settings: {
              theme: widgetTheme,
              placeholder: widgetPlaceholder,
              showAvatar: showWidgetAvatar,
              title: widgetTitle,
              message: widgetMessage,
              branding: resetBranding
            }
          })
        });
        
        if (response.ok) {
          console.log('✅ Custom branding reset saved to database');
          // No need to reload - local state is already updated
        } else {
          console.error('❌ Failed to save reset branding');
        }
      } catch (error) {
        console.error('❌ Error saving reset branding:', error);
      }
    }
  };

  // Don't dispatch automatically to avoid loops - let updateCustomBranding handle it

  // Helper function to get theme colors
  const getThemeColor = (theme: string) => {
    const colors = {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      green: '#10B981',
      red: '#EF4444',
      orange: '#F97316',
      pink: '#EC4899',
      indigo: '#6366F1',
      teal: '#14B8A6'
    };
    return colors[theme] || '#3B82F6';
  };

  // Generate embed code with custom branding (for professional+ plans)
  const generateEmbedCode = () => {
    if (!currentChatbotId) return 'Loading chatbot...';
    
    const apiUrl = process.env.API_URL || 'https://aiorchestrator-vtihz.ondigitalocean.app';
    const isProfessionalPlan = user?.planId === 'professional' || user?.planId === 'business';
    
    const baseCode = `<!-- AI Orchestrator Chatbot Widget -->
<script 
  src="https://www.aiorchestrator.dev/chatbot-widget.js"
  data-ai-orchestrator-id="${currentChatbotId}"
  data-api-key="${apiUrl}"
  data-theme="${widgetTheme}"
  data-title="${widgetTitle}"
  data-placeholder="${widgetPlaceholder}"
  data-show-avatar="${showWidgetAvatar}"
  data-welcome-message="${welcomeMessage}"
  data-primary-language="${primaryLanguage}"`;

    // Add custom branding for professional+ plans
    if (isProfessionalPlan) {
      // Only include logo if it's not empty and not a blob URL
      const logoAttribute = customBranding.logo && !customBranding.logo.startsWith('blob:') 
        ? `\n  data-logo="${customBranding.logo}"` 
        : '';
      
      // Add white-label attributes for Business plan
      let whiteLabelAttributes = '';
      if (user?.planId === 'business' && whiteLabelEnabled) {
        whiteLabelAttributes = `\n  data-show-powered-by="false"`;
        if (whiteLabelText) {
          whiteLabelAttributes += `\n  data-powered-by-text="${whiteLabelText.replace(/"/g, '&quot;')}"`;
        }
      }
      
      return baseCode + `
  data-font-family="${customBranding.fontFamily || 'Inter'}"${logoAttribute}${whiteLabelAttributes}
  defer>
</script>`;
    }
    
    return baseCode + `
  defer>
</script>`;
  };

  const getThemeDarkColor = (theme: string) => {
    const colors = {
      blue: '#2563EB',
      purple: '#7C3AED',
      green: '#059669',
      red: '#DC2626',
      orange: '#EA580C',
      pink: '#DB2777',
      indigo: '#4F46E5',
      teal: '#0D9488'
    };
    return colors[theme] || '#2563EB';
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.text,
          context: {
            chatbotId: currentChatbotId,
            primaryLanguage
          }
        })
      });

      const data = await response.json();
      
      console.log('📨 Chat response:', data);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data || data.response || data.message || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const scrollToBottom = () => {
    const messagesEnd = document.getElementById('messages-end');
    messagesEnd?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-600 text-xl font-medium">Loading chatbot...</p>
          <p className="mt-2 text-slate-500">Preparing your AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10 xl:px-12 2xl:px-16 w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-3 sm:py-4 lg:py-6 space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 lg:mb-2" data-tour="chatbot-header">My AI Chatbot</h1>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-lg hidden sm:block">Manage and test your AI assistant</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2 lg:space-x-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto">
                <ChatbotSelector showAllOption={false} />
              </div>
              <button
                onClick={() => loadChatbot()}
                className="flex items-center justify-center gap-2 px-3 lg:px-4 py-1.5 sm:py-2 text-slate-700 bg-white border border-slate-300 rounded-md lg:rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm lg:text-base touch-manipulation min-h-[44px]"
              >
                <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>Refresh</span>
              </button>
              <TourButton onClick={() => setShowTour(true)} />
              <div className="flex items-center space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 bg-green-100 text-green-700 rounded-md lg:rounded-lg">
                <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs lg:text-sm font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-8 w-full">
        {/* Tabs */}
        <div className="mb-3 sm:mb-4 lg:mb-8" data-tour="tour-welcome">
          <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chat')}
              data-tour="tour-test-chat"
              className={`flex-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-md text-xs sm:text-sm lg:text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                activeTab === 'chat' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              <span className="hidden sm:inline">Test </span>Chat
            </button>
            <button
              onClick={() => setActiveTab('embed')}
              data-tour="tour-embed"
              className={`flex-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-md text-xs sm:text-sm lg:text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                activeTab === 'embed' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              Configure
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              data-tour="tour-manage"
              className={`flex-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-3 rounded-md text-xs sm:text-sm lg:text-sm font-medium transition-colors touch-manipulation min-h-[44px] ${
                activeTab === 'manage' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
              <span className="hidden sm:inline">My </span>Chatbots
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <div key={widgetTheme} className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full max-w-full" data-tour="chat-interface">
            {/* Chat Header */}
            <div className={`bg-gradient-to-br ${tc.secondary} border-b-2 ${tc.border} p-3 lg:p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${tc.primary}`}>
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <div className={`font-bold text-sm lg:text-base ${tc.text}`}>{widgetTitle}</div>
                    <div className="text-xs text-slate-600 flex items-center gap-1 lg:gap-2">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                      <span className="hidden sm:inline">Online 24/7</span>
                      <span className="sm:hidden">Online</span>
                      {primaryLanguage && primaryLanguage !== 'auto' && (
                        <span className="px-1.5 lg:px-2 py-0.5 text-[9px] lg:text-[10px] rounded bg-slate-100 text-slate-700">{primaryLanguage.toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <button className="text-slate-600 hover:bg-slate-200 rounded-lg p-1.5 lg:p-2 transition-colors" title="Minimize">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                  </button>
                  <button className="text-slate-600 hover:bg-slate-200 rounded-lg p-1.5 lg:p-2 transition-colors" title="Close">
                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 lg:h-96 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl ${
                      message.isUser
                        ? `${tc.userMsg} text-white shadow-sm`
                        : 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                    }`}
                  >
                    <p className={`text-xs lg:text-sm whitespace-pre-wrap font-medium ${message.isUser ? 'text-white' : 'text-slate-900'}`}>{message.text}</p>
                    <p className={`text-[10px] lg:text-xs mt-1 ${
                      message.isUser ? 'text-white/70' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                      <span className="text-xs lg:text-sm">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div id="messages-end" />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 lg:p-4 bg-white border-t border-slate-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={widgetPlaceholder}
                  className="flex-1 px-3 sm:px-4 lg:px-4 py-2 sm:py-2.5 lg:py-3 border border-slate-300 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm lg:text-base bg-white text-slate-900"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className={`text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg lg:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 lg:gap-2 ${tc.send} hover:opacity-90 active:opacity-75 touch-manipulation min-h-[44px]`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </button>
              </div>
              {/* footer tagline removed as requested */}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6" data-tour="chatbot-management">
            {/* Plan Status */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-indigo-200 w-full max-w-full">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900">Your Plan Status</h3>
                <span className="px-2 lg:px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs lg:text-sm font-medium">
                  {user?.planId === 'starter' ? 'Starter' : user?.planId === 'professional' ? 'Professional' : 'Business'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-indigo-600 mb-1">
                    {currentChatbotId ? (
                      user?.planId === 'starter' ? '1/1' : user?.planId === 'professional' ? '1/2' : user?.planId === 'business' ? '1/3' : '1/1'
                    ) : (
                      user?.planId === 'starter' ? '0/1' : user?.planId === 'professional' ? '0/2' : user?.planId === 'business' ? '0/3' : '0/1'
                    )}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-600">Chatbots Used</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600 mb-1">
                    {user?.planId === 'starter' ? '5K' : user?.planId === 'professional' ? '25K' : user?.planId === 'business' ? '100K' : '5K'}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-600">Messages/Month</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-purple-600 mb-1">
                    {user?.planId === 'starter' ? '1' : user?.planId === 'professional' ? '2' : user?.planId === 'business' ? '3' : '1'}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-600">Websites</div>
                </div>
              </div>
            </div>

            {/* Current Chatbot */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 lg:p-6 w-full max-w-full">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-3 sm:mb-4 lg:mb-6">Your Chatbot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {/* Main Chatbot - Hide if deleted */}
                {!chatbotDeleted && currentChatbotId && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl lg:rounded-xl p-3 sm:p-4 lg:p-6 border border-indigo-200">
                  <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm lg:text-base text-slate-900">{chatbotName}</h4>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600">Main chatbot</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] lg:text-xs text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                  <div className="mb-2 sm:mb-3 lg:mb-4 p-2 lg:p-3 bg-white/50 rounded-lg">
                    <p className="text-[10px] lg:text-xs text-slate-600 italic">{welcomeMessage}</p>
                  </div>
                  <div className="flex space-x-1 lg:space-x-2">
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="flex-1 px-2 lg:px-3 py-1.5 sm:py-2 lg:py-2 bg-indigo-600 text-white rounded-md lg:rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-xs lg:text-sm touch-manipulation min-h-[40px]"
                    >
                      <MessageSquare className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                      Test
                    </button>
                    <button 
                      onClick={() => setActiveTab('embed')}
                      className="flex-1 px-2 lg:px-3 py-1.5 sm:py-2 lg:py-2 bg-slate-100 text-slate-700 rounded-md lg:rounded-lg hover:bg-slate-200 active:bg-slate-300 transition-colors text-xs lg:text-sm touch-manipulation min-h-[40px]"
                    >
                      <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                      Configure
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-2 lg:px-3 py-1.5 sm:py-2 lg:py-2 bg-red-100 text-red-700 rounded-md lg:rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors text-xs lg:text-sm touch-manipulation min-h-[40px]"
                    >
                      <X className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                </div>
                )}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">Delete chatbot?</h4>
                      <p className="text-sm text-slate-600 mb-4">This action cannot be undone.</p>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowDeleteConfirm(false)} className="px-3 py-2 text-sm rounded border">Cancel</button>
                        <button onClick={async () => { 
                          if(!currentChatbotId) { alert('No chatbot to delete'); return; }
                          try {
                            const res = await fetch(`${API_URL}/api/chatbots/${currentChatbotId}`, {
                              method: 'DELETE',
                              headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
                            });
                            const j = await res.json();
                            if(j?.success) { 
                              setShowDeleteConfirm(false); 
                              setChatbotDeleted(false); // Reset per permettere ricreazione
                              setCurrentChatbotId(''); 
                              setShowDeleteSuccess(true);
                              setTimeout(() => setShowDeleteSuccess(false), 3000);
                              
                              // No need to reload - chatbot is deleted from context
                            } else { 
                              alert('Delete failed'); 
                            }
                          } catch(e) { 
                            alert('Delete failed'); 
                          }
                        }} className="px-3 py-2 text-sm rounded bg-red-600 text-white">Delete</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Create First Chatbot - Show when no chatbot exists */}
                {(!currentChatbotId || chatbotDeleted) && (
                  <div 
                    onClick={() => {
                      setIsFirstChatbot(true);
                      setShowAddChatbotModal(true);
                      setChatbotDeleted(false);
                    }}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 lg:p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                        <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-sm lg:text-base text-slate-900 mb-2">Create Your First Chatbot</h4>
                      <p className="text-xs lg:text-sm text-slate-600 mb-3 lg:mb-4">Start building your AI assistant now</p>
                      <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md lg:rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors text-xs lg:text-sm inline-block">
                        <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1 inline" />
                        Create Chatbot
                      </div>
                    </div>
                  </div>
                )}

                {/* Add New Chatbot - Show if chatbot exists */}
                {currentChatbotId && !chatbotDeleted ? (
                  <div 
                    onClick={() => {
                      setIsFirstChatbot(false);
                      setShowAddChatbotModal(true);
                    }}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-indigo-300 hover:border-indigo-400 transition-all cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Create New Chatbot</h4>
                      <p className="text-sm text-slate-600 mb-4">Add another AI assistant for different purposes</p>
                      <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors text-sm inline-block">
                        <Plus className="w-4 h-4 mr-1 inline" />
                        Create
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Integration Methods */}
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6 w-full max-w-full" data-tour="tour-integration">
              <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4 lg:mb-6">Integration Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Embedding Method */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 lg:p-6 border border-indigo-200">
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Code className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm lg:text-base text-slate-900">Embedding Code</h4>
                      <p className="text-xs lg:text-sm text-slate-600">Add to any website</p>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm text-slate-600 mb-3 lg:mb-4">
                    Copy and paste our JavaScript code into your website. Works with any platform (WordPress, Wix, Squarespace, custom HTML, etc.).
                  </p>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 lg:p-3 mb-3 lg:mb-4">
                    <p className="text-[10px] lg:text-xs text-indigo-800 font-medium mb-1">📝 How to install:</p>
                    <ol className="text-[10px] lg:text-xs text-indigo-700 space-y-1 list-decimal list-inside">
                      <li>Click "Get Embed Code" below</li>
                      <li>Copy the code snippet</li>
                      <li>Paste it before the <code className="bg-indigo-100 px-1 rounded">&lt;/body&gt;</code> tag in your website</li>
                      <li>Save and publish your website</li>
                    </ol>
                  </div>
                  <button 
                    onClick={() => setActiveTab('embed')}
                    className="w-full px-3 lg:px-4 py-1.5 lg:py-2 bg-indigo-600 text-white rounded-md lg:rounded-lg hover:bg-indigo-700 transition-colors text-xs lg:text-sm"
                  >
                    <Code className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
                    Get Embed Code
                  </button>
                </div>

                {/* E-commerce Connections */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 lg:p-6 border border-green-200">
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm lg:text-base text-slate-900">Shopify Integration</h4>
                      <p className="text-xs lg:text-sm text-slate-600">One-click setup</p>
                    </div>
                  </div>
                  <p className="text-xs lg:text-sm text-slate-600 mb-3 lg:mb-4">
                    Connect directly to your Shopify store with one click for seamless product and order sync. Your chatbot will automatically access your product catalog, handle order inquiries, and provide real-time inventory information.
                  </p>
                  <div className="bg-green-50 rounded-lg p-3 mb-3 lg:mb-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div className="text-xs text-green-800">
                        <p className="font-medium mb-1">What you get:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Real product recommendations</li>
                          <li>• Order tracking assistance</li>
                          <li>• Inventory status updates</li>
                          <li>• Add to cart functionality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/connections'}
                    className="w-full px-3 lg:px-4 py-1.5 lg:py-2 bg-green-600 text-white rounded-md lg:rounded-lg hover:bg-green-700 transition-colors text-xs lg:text-sm"
                  >
                    <Globe className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
                    Connect Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}



        {activeTab === 'embed' && (
          <div className="space-y-4 lg:space-y-6 w-full">
             <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full">
              {/* Embed Options */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-6 w-full max-w-full flex-1">
                <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4 lg:mb-6">Embed Your Chatbot</h3>
                
                {/* Quick Embed */}
                <div className="bg-slate-50 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 w-full max-w-full">
                  <h4 className="font-medium text-sm lg:text-base text-slate-900 mb-2">Quick Embed</h4>
                  <p className="text-xs lg:text-sm text-slate-600 mb-3 lg:mb-4">Add this code to your website to embed your chatbot:</p>
                  <div className="bg-slate-900 rounded-lg p-3 lg:p-4 overflow-x-auto max-w-full w-full">
                    <code className="block w-full text-green-400 text-xs lg:text-sm whitespace-pre break-all">
                      {generateEmbedCode()}
                    </code>
                  </div>
                  <div className="flex space-x-2 mt-2 lg:mt-3">
                    <button onClick={() => {
                      const code = generateEmbedCode();
                      navigator.clipboard.writeText(code).then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }).catch(() => {
                        setCopied(false);
                      });
                    }} className="px-3 lg:px-4 py-1.5 lg:py-2 bg-indigo-600 text-white rounded-md lg:rounded-lg hover:bg-indigo-700 transition-colors text-xs lg:text-sm">
                      <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 inline" />
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>

                {/* Widget Customization */}
                <div className="mb-4 lg:mb-6">
                  <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                    <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                    <h4 className="text-sm lg:text-base font-semibold text-slate-900">Widget Customization</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                    {/* Basic Settings */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Theme Color</label>
                      <div className="flex space-x-1 lg:space-x-2">
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-indigo-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'blue' ? 'border-indigo-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('blue')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-purple-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'purple' ? 'border-purple-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('purple')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-green-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'green' ? 'border-green-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('green')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-red-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'red' ? 'border-red-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('red')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-orange-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'orange' ? 'border-orange-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('orange')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-pink-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'pink' ? 'border-pink-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('pink')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-indigo-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'indigo' ? 'border-indigo-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('indigo')}
                        ></div>
                        <div 
                          className={`w-6 h-6 lg:w-8 lg:h-8 bg-teal-600 rounded-full cursor-pointer border-2 ${widgetTheme === 'teal' ? 'border-teal-800' : 'border-transparent'} hover:border-slate-300`}
                          onClick={() => setWidgetTheme('teal')}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Widget Title</label>
                      <input
                        type="text"
                        value={widgetTitle}
                        onChange={(e) => {
                          setWidgetTitle(e.target.value);
                          setChatbotName(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base"
                        placeholder="AI Support"
                      />
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Input Placeholder</label>
                      <input
                        type="text"
                        value={widgetPlaceholder}
                        onChange={(e) => setWidgetPlaceholder(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base"
                        placeholder="Type your message..."
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Widget Message</label>
                      <textarea
                        value={widgetMessage}
                        onChange={(e) => {
                          setWidgetMessage(e.target.value);
                          setWelcomeMessage(e.target.value);
                        }}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base bg-white text-slate-900"
                        placeholder="Hello! I'm your AI assistant. How can I help you today?"
                      />
                    </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="showAvatar"
                          checked={showWidgetAvatar}
                          onChange={(e) => setShowWidgetAvatar(e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                        />
                        <label htmlFor="showAvatar" className="ml-2 block text-xs lg:text-sm text-slate-700">
                          Show Avatar
                        </label>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">Primary Language</label>
                      <select
                        value={primaryLanguage}
                        onChange={(e) => setPrimaryLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base bg-white text-slate-900 touch-manipulation min-h-[44px]"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="en">English</option>
                        <option value="it">Italiano</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="pt">Português</option>
                        <option value="ru">Русский</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                        <option value="ko">한국어</option>
                        <option value="ar">العربية</option>
                        <option value="hi">हिन्दी</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Custom Branding Section (Professional+ plans) */}
                  {(user?.planId === 'professional' || user?.planId === 'business') && (
                    <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-slate-200">
                      <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                        <Palette className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                        <h5 className="text-sm lg:text-base font-semibold text-slate-900">Custom Branding</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        {/* Logo */}
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-2">Logo</label>
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 lg:p-6 text-center hover:border-slate-400 transition-colors">
                            {customBranding.logo ? (
                              <div className="space-y-2">
                                <img src={customBranding.logo} alt="Logo preview" className="w-16 h-16 lg:w-20 lg:h-20 rounded mx-auto object-contain" />
                                <button
                                  onClick={() => updateCustomBranding({ logo: '' })}
                                  className="text-xs lg:text-sm text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-xs lg:text-sm text-slate-600 mb-2">Upload your logo</p>
                                <p className="text-[10px] lg:text-xs text-slate-500 mb-3">PNG, JPG up to 2MB</p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  id="logo-upload-grid"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = async () => {
                                        const base64 = reader.result as string;
                                        const compressed = await resizeLogo(base64);
                                        updateCustomBranding({ logo: compressed });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="logo-upload-grid"
                                  className="inline-block bg-indigo-600 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium hover:bg-indigo-700 cursor-pointer"
                                >
                                  Choose File
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Font Family */}
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-2">Font Family</label>
                          <select
                            value={customBranding.fontFamily}
                            onChange={(e) => updateCustomBranding({ fontFamily: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Lato">Lato</option>
                            <option value="Poppins">Poppins</option>
                          </select>
                          <p className="text-[10px] lg:text-xs text-slate-500 mt-2">Choose a font that matches your brand identity</p>
                        </div>
                      </div>
                              </div>
                            )}

                    {/* White-Label Section (Business only) */}
                    {user?.planId === 'business' && (
                      <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-slate-200">
                        <div className="flex items-center space-x-2 mb-4 lg:mb-6">
                          <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                          <h5 className="text-sm lg:text-base font-semibold text-slate-900">White-Label Solution</h5>
                            </div>
                        <div className="bg-indigo-50 rounded-lg p-4 lg:p-6 border border-indigo-200 space-y-4">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="remove-branding-embed"
                              checked={whiteLabelEnabled}
                              onChange={(e) => {
                                setWhiteLabelEnabled(e.target.checked);
                                if (selectedChatbot) {
                                  const settings = typeof selectedChatbot.settings === 'string' 
                                    ? JSON.parse(selectedChatbot.settings) 
                                    : selectedChatbot.settings || {};
                                  const updatedSettings = {
                                    ...settings,
                                    whiteLabel: {
                                      ...settings.whiteLabel,
                                      removeBranding: e.target.checked
                                    }
                                  };
                                  updateChatbot(selectedChatbot.id, {
                                    settings: JSON.stringify(updatedSettings)
                                  });
                                }
                              }}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded mt-0.5"
                            />
                            <div className="flex-1">
                              <label htmlFor="remove-branding-embed" className="block text-sm lg:text-base font-medium text-slate-900 cursor-pointer">
                                Remove "Powered by AI Orchestrator" branding
                              </label>
                              <p className="text-xs lg:text-sm text-slate-600 mt-1">
                                When enabled, you can customize or remove the "Powered by" text at the bottom of your chatbot.
                              </p>
                          </div>
                          </div>
                          
                          {whiteLabelEnabled && (
                            <div>
                              <label htmlFor="white-label-text" className="block text-xs lg:text-sm font-medium text-slate-700 mb-2">
                                Custom Footer Text (optional)
                              </label>
                              <input
                                type="text"
                                id="white-label-text"
                                value={whiteLabelText}
                                onChange={(e) => {
                                  const newText = e.target.value;
                                  setWhiteLabelText(newText);
                                  if (selectedChatbot) {
                                    const settings = typeof selectedChatbot.settings === 'string' 
                                      ? JSON.parse(selectedChatbot.settings) 
                                      : selectedChatbot.settings || {};
                                    const updatedSettings = {
                                      ...settings,
                                      whiteLabel: {
                                        ...settings.whiteLabel,
                                        removeBranding: whiteLabelEnabled,
                                        customText: newText
                                      }
                                    };
                                    updateChatbot(selectedChatbot.id, {
                                      settings: JSON.stringify(updatedSettings)
                                    });
                                  }
                                }}
                                placeholder='e.g., "Powered by Your Company" or leave empty to hide'
                                className="w-full px-3 py-2 border border-slate-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm lg:text-base bg-white text-slate-900"
                              />
                              <p className="text-[10px] lg:text-xs text-slate-500 mt-1">
                                Leave empty to completely hide the footer text, or enter your own custom text.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Save Button */}
                    <div className="mt-4 lg:mt-6 flex justify-end items-center space-x-2 lg:space-x-4">
                      {saveStatus === 'success' && (
                        <span className="text-green-600 text-xs lg:text-sm flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>Saved successfully!</span>
                        </span>
                      )}
                      {saveStatus === 'error' && (
                        <span className="text-red-600 text-xs lg:text-sm flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                          <span>Save failed. Try again.</span>
                        </span>
                      )}
                      <button
                        onClick={saveWidgetCustomizations}
                        disabled={isSaving}
                        className={`px-4 lg:px-6 py-1.5 lg:py-2 rounded-md lg:rounded-lg transition-colors flex items-center space-x-1 lg:space-x-2 ${
                          isSaving 
                            ? 'bg-slate-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white text-xs lg:text-sm`}
                      >
                        {isSaving ? (
                          <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                        ) : (
                          <Save className="w-3 h-3 lg:w-4 lg:h-4" />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save Widget Settings'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="mb-4 lg:mb-6">
                    <h4 className="font-medium text-sm lg:text-base text-slate-900 mb-3 lg:mb-4">Chatbot Preview</h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden w-full max-w-full">
                      <div className="bg-slate-100 px-3 lg:px-4 py-1.5 lg:py-2 border-b border-slate-200">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
                          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></div>
                          <span className="ml-2 lg:ml-4 text-xs lg:text-sm text-slate-600">Live Preview</span>
                        </div>
                      </div>
                      {/* Just the chatbot iframe, full size */}
                      {currentChatbotId ? (
                        <iframe
                          key={`${currentChatbotId}-${customBranding.logo ? customBranding.logo.substring(0, 50) : 'no-logo'}-${customBranding.fontFamily}-${whiteLabelEnabled}-${whiteLabelText}`}
                          src={`${API_URL}/public/embed/${currentChatbotId}?theme=${widgetTheme}&title=${encodeURIComponent(widgetTitle)}&placeholder=${encodeURIComponent(widgetPlaceholder)}&message=${encodeURIComponent(widgetMessage)}&showAvatar=${showWidgetAvatar}&primaryLanguage=${encodeURIComponent(primaryLanguage)}${user?.planId !== 'starter' ? `&fontFamily=${encodeURIComponent(customBranding.fontFamily)}${customBranding.logo && !customBranding.logo.startsWith('blob:') ? `&logo=${encodeURIComponent(customBranding.logo)}` : ''}` : ''}${user?.planId === 'business' ? `&showPoweredBy=${!whiteLabelEnabled}${whiteLabelEnabled ? `&poweredByText=${encodeURIComponent(whiteLabelText || '')}` : ''}` : ''}`}
                          className="w-full max-w-full h-[400px] lg:h-[740px] border-0"
                          title="Live Chatbot Preview"
                          onLoad={() => console.log('🖼️ iframe loaded, logo:', customBranding.logo ? customBranding.logo.substring(0, 100) : 'none', 'whiteLabel:', whiteLabelEnabled)}
                        />
                      ) : (
                        <div className="w-full max-w-full h-[300px] lg:h-[600px] bg-slate-50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3 animate-pulse">
                              <Bot className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <p className="text-slate-600 text-sm lg:text-base">Loading chatbot...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embed Code Generator Modal */}
      {showEmbedModal && (
        <EmbedCodeGenerator
          chatbotId="demo-chatbot"
          apiKey="demo-token"
          onClose={() => setShowEmbedModal(false)}
        />
      )}

      {/* Chatbot Tour */}
      <ChatbotTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
      />

      {/* Success Notifications */}
      {showSaveSuccess && (
        <div className="fixed top-20 right-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl shadow-2xl p-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">Settings Saved!</div>
              <div className="text-slate-600 text-sm">Your chatbot has been updated successfully</div>
            </div>
          </div>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="fixed top-20 right-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500 rounded-xl shadow-2xl p-6 z-50 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">Chatbot Deleted!</div>
              <div className="text-slate-600 text-sm">Your chatbot has been removed successfully</div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {/* Add Chatbot Modal */}
      <AddChatbotModal
        isOpen={showAddChatbotModal}
        onClose={() => setShowAddChatbotModal(false)}
        isFirstChatbot={isFirstChatbot}
      />
    </div>
  );
};

export default Chatbot;
