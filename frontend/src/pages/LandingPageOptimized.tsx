import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextHooks';
import { useUser } from '../contexts/UserContext';
import { 
  ArrowRight, 
  CheckCircle, 
  Play, 
  MessageSquare, 
  Bot, 
  BarChart3, 
  ShoppingCart,
  Globe,
  Zap,
  Shield,
  Users,
  Star,
  ChevronRight,
  X,
  User,
  LogOut,
  Settings,
  Menu
} from 'lucide-react';
import InteractiveDemo from '../components/demo/InteractiveDemo';
import AuthModal from '../components/Auth/AuthModal';
import PaymentModal from '../components/payment/PaymentModalSimple';
import LiveChatWidget from '../components/LiveChatWidget';

const LandingPageOptimized: React.FC = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { user: userContext, isTrialExpired, refreshUser } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [mobileMenuOpen]);

  // Auth status is now managed by AuthContext
  
  // Refresh user data when landing page loads
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔄 LandingPage: Refreshing user data...');
      refreshUser();
    }
  }, [isAuthenticated, user, refreshUser]);

  // Listen for subscription changes
  useEffect(() => {
    const handleSubscriptionChange = () => {
      console.log('🔄 LandingPage: Subscription changed, refreshing user data...');
      refreshUser();
    };

    // Listen for custom events (can be triggered from payment modals)
    window.addEventListener('subscriptionUpdated', handleSubscriptionChange);
    
    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionChange);
    };
  }, [refreshUser]);

  const handleGetStarted = () => {
    const demoEl = document.getElementById('demo');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

         const handleAuthSuccess = (userData: any) => {
           console.log('🎉 LandingPage: Auth success received!', userData);
           console.log('🔍 LandingPage: User data details:', {
             isNewUser: userData?.isNewUser,
             hasCompletedOnboarding: userData?.hasCompletedOnboarding,
             planId: userData?.planId,
             isTrialActive: userData?.isTrialActive
           });
           
           // IMPORTANTE: Salva i dati dell'utente nel localStorage
           console.log('💾 LandingPage: Saving user data to localStorage...');
           localStorage.setItem('userData', JSON.stringify(userData));
           console.log('✅ LandingPage: User data saved to localStorage');
           
           // Debug logs (can be removed in production)
           console.log('✅ Login successful, user data saved to localStorage');
           
           setShowAuthModal(false);
           
           // Wait for AuthContext to stabilize and check localStorage
           setTimeout(() => {
             try {
               // Check localStorage and redirect accordingly
               const token = localStorage.getItem('authToken');
               const storedUserData = localStorage.getItem('userData');
               
               if (!token || !storedUserData) {
                 console.error('Missing auth data in localStorage!');
                 return;
               }
               
               const parsedUserData = JSON.parse(storedUserData);
               
              // Always redirect to dashboard (onboarding happens inside the app)
              console.log('Redirecting to dashboard...');
              window.location.href = '/dashboard';
             } catch (error) {
               console.error('Error during redirect:', error);
               // Fallback redirect
               window.location.href = '/dashboard';
             }
           }, 1000); // Ridotto a 1 secondo
         };

  const handleLogout = () => {
    logout();
  };

  const handleSelectPlan = (planName: string) => {
    const plans = {
      starter: {
        id: 'starter',
        name: 'Starter Plan',
        price: 29,
        features: ['1 AI Chatbot', '5,000 messages/month', 'Basic Store Connections', '50+ Languages', 'Email Support']
      },
      professional: {
        id: 'professional', 
        name: 'Professional Plan',
        price: 99,
        features: ['2 AI Chatbots', '25,000 messages/month', 'Advanced Store Connections', '50+ Languages', 'Priority Support', 'Advanced Analytics', 'Custom Branding', 'Add to Cart', 'ML Personalization']
      },
      business: {
        id: 'business',
        name: 'Business Plan', 
        price: 299,
        features: ['3 AI Chatbots', '100,000 messages/month', 'Full Store Connections', '50+ Languages', 'Dedicated Support', 'API Access', 'White-label Options']
      }
    };

    setSelectedPlan(plans[planName as keyof typeof plans]);

    if (user) {
      // User is logged in - show upgrade/payment modal
      setShowPaymentModal(true);
    } else {
      // User not logged in - show auth modal
      setShowAuthModal(true);
    }
  };

  const getButtonText = (planName: string) => {
    if (!user) {
      // Not logged in
      if (planName === 'starter') {
        return 'Start 7-Day Free Trial';
      } else {
        return 'Get Started';
      }
    } else {
      // Logged in - check current plan
      const currentPlan = userContext?.planId || user?.planId || 'free';
      
      // Plan hierarchy: free < starter < professional < business
      const planHierarchy = { free: 0, starter: 1, professional: 2, business: 3 };
      const currentLevel = planHierarchy[currentPlan as keyof typeof planHierarchy] || 0;
      const targetLevel = planHierarchy[planName as keyof typeof planHierarchy] || 1;
      
      if (currentPlan === planName) {
        return 'Current Plan';
      } else if (targetLevel > currentLevel) {
        return `Upgrade to ${planName.charAt(0).toUpperCase() + planName.slice(1)}`;
      } else {
        return `Downgrade to ${planName.charAt(0).toUpperCase() + planName.slice(1)}`;
      }
    }
    return 'Get Started';
  };

  const getButtonStyle = (planName: string) => {
    if (!user) {
      // Not logged in - uniform styles
      if (planName === 'starter') {
        return 'w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
      } else if (planName === 'professional') {
        return 'w-full px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold';
      } else {
        return 'w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors';
      }
    } else {
      // Logged in - check if current plan
      const currentPlan = userContext?.planId || user?.planId || 'starter';
      const isCurrentPlan = (planName === currentPlan);
      
      if (planName === 'starter') {
        return isCurrentPlan 
          ? 'w-full px-4 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed'
          : 'w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
      } else if (planName === 'professional') {
        return isCurrentPlan
          ? 'w-full px-4 py-3 bg-blue-400 text-white rounded-lg cursor-not-allowed'
          : 'w-full px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold';
      } else if (planName === 'business') {
        return isCurrentPlan
          ? 'w-full px-4 py-3 bg-gray-600 text-white rounded-lg cursor-not-allowed'
          : 'w-full px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors';
      }
    }
    return 'w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors';
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    // Refresh user data from server
    await refreshUser();
    
    // Emit custom event to notify other components
    window.dispatchEvent(new CustomEvent('subscriptionUpdated'));
    
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI-Powered Chatbots",
      description: "Create intelligent chatbots that understand context and provide instant, accurate responses to your customers.",
      color: "bg-blue-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "50+ Languages Automatic",
      description: "Speaks ANY language your customers use - English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Arabic, and 45+ more. Automatic detection and native responses.",
      color: "bg-green-500"
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Easy Integration",
      description: "One-click integration with Shopify, WooCommerce, and any website. Embed anywhere with simple code snippets.",
      color: "bg-purple-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "AI Insights",
      description: "Understand customer trends with sentiment, intent, and smart recommendations to grow sales.",
      color: "bg-orange-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Setup",
      description: "Get started in minutes, not hours. Our guided setup walks you through every step.",
      color: "bg-yellow-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption. Your data is always safe and private.",
      color: "bg-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "E-commerce Manager",
      company: "BellaFashion Store",
      content: "Our conversion rate increased by 40% in just 2 weeks. The AI understands our products perfectly and handles 500+ customer inquiries daily without breaking a sweat!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Marco Rossi",
      role: "Founder & CEO",
      company: "TechFlow Solutions",
      content: "Finally, a chatbot that actually helps customers instead of frustrating them. Setup took 10 minutes and we're seeing 60% faster response times. Our customer satisfaction went from 3.2 to 4.8 stars!",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emma Chen",
      role: "Head of Customer Experience",
      company: "GlobalTech Corp",
      content: "The universal language support is absolutely game-changing. We serve customers in 15+ countries and the AI responds perfectly in their native language. Reduced support tickets by 45%!",
      rating: 5,
      avatar: "EC"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Live Chat Widget */}
      <LiveChatWidget />
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Orchestrator</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <a href="/affiliates" className="text-gray-600 hover:text-gray-900 transition-colors font-semibold">Affiliates</a>
              <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Mobile hamburger */}
              <button
                aria-label="Open menu"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <User className="w-4 h-4" />
                    <span>Go to App</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {(userContext?.planId || user.planId).charAt(0).toUpperCase() + (userContext?.planId || user.planId).slice(1)} Plan
                          </span>
                          {(userContext?.isTrialActive || user.isTrialActive) && !(userContext?.isPaid || user.isPaid) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-1">
                              Trial Active
                            </span>
                          )}
                          {(userContext?.isPaid || user.isPaid) && !(userContext?.isTrialActive || user.isTrialActive) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-1">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          // Check if user has active plan or trial
                          const hasActivePlan = (userContext?.isTrialActive || user.isTrialActive) || (userContext?.isPaid || user.isPaid);
                          if (hasActivePlan) {
                            navigate('/dashboard');
                          } else {
                            // Redirect to pricing if no active plan
                            navigate('/pricing');
                          }
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Go to App
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Start Free Trial
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay and panel */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60]"
          aria-modal="true"
          role="dialog"
          onKeyDown={(e) => { if (e.key === 'Escape') setMobileMenuOpen(false); }}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl border-l border-gray-200 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">AI Orchestrator</span>
              </div>
              <button
                aria-label="Close menu"
                autoFocus
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="px-4 py-3 space-y-1">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Features</a>
              <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Demo</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Pricing</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Reviews</a>
              <a href="/affiliates" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-semibold">Affiliates</a>
              <a href="/blog" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">Blog</a>
            </nav>

            <div className="mt-auto px-4 py-4 border-t border-gray-100 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Go to App
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/settings'); }}
                      className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogin(); }}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleSignUp(); }}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleGetStarted(); }}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Start Free Trial
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {user ? (
              <>
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Welcome back, {user.name}! You're logged in
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Ready to Build Your
                  <span className="text-blue-600"> AI Chatbot?</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Access your dashboard to create, customize, and deploy intelligent chatbots for your e-commerce store.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <button
                    onClick={() => setShowDemo(true)}
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try Live Demo
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 rounded-full text-sm font-semibold mb-6 border border-blue-200">
                  <Zap className="w-4 h-4 mr-2 text-blue-600" />
                  Multilingual AI | 50+ Languages | Fast Setup
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  AI Chatbots That
                  <span className="text-blue-600"> Actually Work</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    In Any Language
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Turn every visitor into a customer with AI chatbots that speak your customers' language. 
                  Boost sales, reduce support workload, and provide 24/7 personalized assistance.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Start 7-Day Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <button
                    onClick={() => setShowDemo(true)}
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try Live Demo
                  </button>
                </div>
              </>
            )}

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Setup in 5 minutes
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Cancel anytime
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center justify-center space-x-6 mt-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Bot className="w-5 h-5 text-green-600" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create, manage, and optimize your AI chatbots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Try our AI chatbot live. Ask about products, orders, or anything else!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-sm text-gray-600">AI Chatbot Demo</span>
                </div>
              </div>
              <div className="p-6">
                <InteractiveDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by 10,000+ Businesses
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Perfect for small businesses getting started</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">1 AI Chatbot</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Basic Analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Email Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">5,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Basic Store Connections</span>
                </li>
              </ul>
              <button
                onClick={() => handleSelectPlan('starter')}
                className={getButtonStyle('starter')}
                disabled={user?.planId === 'starter'}
              >
                {getButtonText('starter')}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 rounded-xl p-8 shadow-lg relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$99</span>
                <span className="text-blue-200">/month</span>
              </div>
              <p className="text-blue-200 mb-6">For growing businesses that need more power</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">2 AI Chatbots</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">Advanced Analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">Priority Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">Custom Branding</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">API Access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">25,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-white text-sm">Advanced Store Connections</span>
                </li>
              </ul>
              <button
                onClick={() => handleSelectPlan('professional')}
                className={getButtonStyle('professional')}
                disabled={user?.planId === 'professional'}
              >
                {getButtonText('professional')}
              </button>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Business</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Full e-commerce automation for serious businesses</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">3 AI Chatbots</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">50+ Languages Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">Enterprise Analytics & ML</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">24/7 Dedicated Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">White-label Solution</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">100,000 messages/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-600 text-sm">3 Websites</span>
                </li>
              </ul>
              <button
                onClick={() => handleSelectPlan('business')}
                className={getButtonStyle('business')}
                disabled={user?.planId === 'business'}
              >
                {getButtonText('business')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of businesses already using AI Orchestrator to increase sales and improve customer satisfaction.
          </p>
          {user && (user.planId === 'professional' || user.planId === 'business' || user.isPaid) ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Your Free Trial Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI Orchestrator</span>
              </div>
              <p className="text-gray-400">
                The most powerful AI chatbot platform for e-commerce businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</a></li>
                <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a></li>
              </ul>
            </div>
            
            {/* Company section removed per request */}
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            {/* Legal links temporarily removed to avoid 404s until pages are live */}
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Orchestrator. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={handlePaymentSuccess}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default LandingPageOptimized;
