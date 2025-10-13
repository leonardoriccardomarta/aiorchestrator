import React, { useState, useEffect } from 'react';
import { API_URL, FRONTEND_URL } from '../config/constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextHooks';
import LiveChatWidget from '../components/LiveChatWidget';
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  Gift,
  ArrowRight,
  Check,
  BarChart3,
  Star,
  Zap,
  Target,
  Award,
  Bot,
  Mail,
  Download,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Copy,
  RefreshCw,
  ExternalLink,
  CreditCard
} from 'lucide-react';

interface AffiliateStats {
  affiliateCode: string;
  commissionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  minimumPayout: number;
  lastPayoutDate: string | null;
  totalReferrals: number;
  convertedReferrals: number;
  pendingReferrals: number;
  canRequestPayout: boolean;
  recentReferrals: any[];
  recentPayouts: any[];
}

const AffiliateProgram: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [marketingMaterials, setMarketingMaterials] = useState<any>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    // Load marketing materials for everyone
    loadMarketingMaterials();
    
    if (isAuthenticated) {
      loadAffiliateStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadMarketingMaterials = async () => {
    // Set static materials immediately (no backend needed)
    setMarketingMaterials({
      emailTemplates: {
        introduction: {
          subject: "Boost Your E-commerce Sales with AI - Special Offer Inside",
          body: `Hi [Name],

I wanted to share something that could really help your business grow.

I've been using AI Orchestrator for my e-commerce store, and the results have been incredible:
- 24/7 customer support in 50+ languages
- Automated responses that actually help customers buy
- Detailed analytics to understand customer behavior
- Easy integration with Shopify and WooCommerce

They're offering a 7-day free trial, and I think you'd love it.

Check it out here: [YOUR_REFERRAL_LINK]

Let me know if you have any questions!

Best regards,
[Your Name]`
        },
        followUp: {
          subject: "Quick question about AI chatbots for your store",
          body: `Hey [Name],

Did you get a chance to check out AI Orchestrator?

I know running an online store is busy, but this tool seriously pays for itself:
- Reduces support workload by 80%
- Increases conversions by helping customers find what they need
- Works in any language automatically
- Takes just 5 minutes to set up

The 7-day free trial lets you test everything risk-free: [YOUR_REFERRAL_LINK]

Worth a look if you want to scale without hiring more support staff!

Cheers,
[Your Name]`
        },
        newsletter: {
          subject: "How I Cut Support Costs by 80% (and you can too)",
          body: `Hi there,

If you're spending hours answering the same customer questions, there's a better way.

I recently started using AI Orchestrator for my e-commerce business, and it's been a game-changer:

✅ Automatically answers customer questions 24/7
✅ Works in 50+ languages (no setup needed)
✅ Integrates with Shopify/WooCommerce in minutes
✅ Provides smart analytics on customer behavior

The best part? It costs less than hiring one support person, but works 24/7.

They offer a 7-day free trial: [YOUR_REFERRAL_LINK]

Try it out and let me know what you think!

[Your Name]`
        }
      },
      socialMedia: {
        facebook: [{
          text: `🚀 Just discovered the easiest way to add AI chatbots to any e-commerce store!

✅ Works in 50+ languages automatically
✅ Integrates with Shopify & WooCommerce
✅ 24/7 customer support
✅ 7-day FREE trial

Perfect if you want to scale customer support without hiring more people.

Try it free: [YOUR_REFERRAL_LINK]

#ecommerce #AI #chatbot #automation`
        }],
        twitter: [{
          text: `🤖 AI chatbots for e-commerce that actually work

• 50+ languages (auto-detect)
• Shopify/WooCommerce ready
• Setup in 5 mins
• 7-day FREE trial

Try @AIOrchestrator: [YOUR_REFERRAL_LINK]

#ecommerce #AI #SaaS`
        }],
        linkedin: [{
          text: `After testing dozens of AI chatbot solutions, I found one that actually delivers results for e-commerce businesses.

AI Orchestrator stands out because:

1. Automatic language detection (50+ languages)
2. Deep Shopify/WooCommerce integration
3. ML-powered analytics
4. Real-time sentiment analysis
5. Setup takes literally 5 minutes

The ROI is clear: 80% reduction in support costs, 24/7 availability, and happier customers.

They offer a 7-day free trial: [YOUR_REFERRAL_LINK]

Highly recommended for any e-commerce business looking to scale support efficiently.

#Ecommerce #ArtificialIntelligence #CustomerService #BusinessGrowth`
        }]
      }
    });
  };

  const loadAffiliateStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/affiliate/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setShowRegisterForm(false);
      } else if (response.status === 404) {
        // Not yet an affiliate
        setStats(null);
        setShowRegisterForm(true);
      }
    } catch (error) {
      console.error('Error loading affiliate stats:', error);
      // Backend not available, assume user needs to register
      setStats(null);
      setShowRegisterForm(true);
    } finally {
      setLoading(false);
    }
  };

  const registerAsAffiliate = async () => {
    // Use PayPal email or fallback to login email
    const emailToUse = paypalEmail || user?.email;
    
    if (!emailToUse) {
      alert('Please enter your PayPal email');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/affiliate/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ paypalEmail: emailToUse })
      });

      const data = await response.json();
      
      if (data.success) {
        await loadAffiliateStats();
        setShowRegisterForm(false);
    } else {
        alert(data.error || 'Failed to register as affiliate');
      }
    } catch (error) {
      console.error('Error registering as affiliate:', error);
      alert('Failed to register as affiliate');
    }
  };

  const copyReferralLink = () => {
    const link = `${FRONTEND_URL}/?ref=${stats?.affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showMaterial = (type: string, material: any) => {
    setSelectedMaterial({ type, ...material });
    setShowMaterialModal(true);
  };

  const copyMaterial = (text: string) => {
    // Replace placeholder with actual referral link
    const referralLink = stats?.affiliateCode 
      ? `${FRONTEND_URL}/?ref=${stats.affiliateCode}`
      : `${FRONTEND_URL}/ (Register to get your unique link)`;
    const finalText = text.replace(/\[YOUR_REFERRAL_LINK\]/g, referralLink);
    
    navigator.clipboard.writeText(finalText);
    setShowMaterialModal(false);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
  };

  const downloadMaterial = (materialName: string) => {
    alert(`Contact aiorchestratoor@gmail.com to request ${materialName} banner designs`);
  };

  const handleGetStarted = () => {
    if (!isAuthenticated || !user) {
      // Non loggato - mostra prompt di login
      setShowLoginPrompt(true);
      return;
    }
    
    // Loggato - scroll alla sezione appropriata
    // Aspetta un momento per assicurarsi che la pagina sia renderizzata
    setTimeout(() => {
      if (stats) {
        // Già affiliato - scroll alla dashboard
        const dashElement = document.getElementById('dashboard');
        if (dashElement) {
          dashElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      } else if (showRegisterForm) {
        // Non ancora affiliato - scroll al form
        const formElement = document.getElementById('register-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      } else {
        // Ancora loading - scroll alla fine della pagina
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Live Chat Widget */}
      <LiveChatWidget />
      
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
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
      {/* Header - Same as landing */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-white" />
            </div>
              <span className="text-xl font-bold text-gray-900">AI Orchestrator</span>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg shadow-blue-500/30"
            >
              Back to Home
            </button>
          </div>
          </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Hero Section - Same style as landing */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 rounded-full text-sm font-semibold mb-6 border border-blue-200">
              <Gift className="w-4 h-4 mr-2 text-blue-600" />
              Paid on the 1st of Every Month
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Earn 50% Commission
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">On Every Sale!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our affiliate program and earn up to €500+ per month by referring customers to AI Orchestrator
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
              >
                Learn More
          </button>
        </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">50%</div>
              <div className="text-gray-600 font-medium">Commission Rate</div>
          </div>
            <div className="text-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">€50</div>
              <div className="text-gray-600 font-medium">Minimum Payout</div>
          </div>
            <div className="text-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">30 days</div>
              <div className="text-gray-600 font-medium">Cookie Duration</div>
        </div>
            <div className="text-center bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">1st</div>
              <div className="text-gray-600 font-medium">Monthly Payout Day</div>
        </div>
      </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start earning in 3 simple steps
            </p>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-blue-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2 text-gray-900">1. Sign Up</div>
                <p className="text-gray-600 text-lg">
                  Create your free account and get your unique referral link instantly
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2 text-gray-900">2. Share</div>
                <p className="text-gray-600 text-lg">
                  Share your link on social media, blog, or directly with your network
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-gray-100 hover:border-green-200">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2 text-gray-900">3. Earn</div>
                <p className="text-gray-600 text-lg">
                  Get 50% commission on every sale. Paid on the 1st of each month via PayPal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earning Potential */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Earning Potential
            </h2>
            <p className="text-xl text-gray-600">
              Based on our average plan price of €99/month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:shadow-2xl transition-all">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600 mb-2">Starter</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">€150</div>
                <div className="text-gray-600 mb-6">/month</div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">3 referrals/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">50% commission</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">€49.50 per sale</span>
                </div>
                </div>
          </div>
        </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500 relative transform hover:scale-105 transition-all">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </span>
                </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600 mb-2">Professional</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">€500</div>
                <div className="text-gray-600 mb-6">/month</div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">10 referrals/month</span>
                </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">50% commission</span>
              </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">€49.50 per sale</span>
                  </div>
                </div>
              </div>
              </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:shadow-2xl transition-all">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600 mb-2">Elite</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">€1,500+</div>
                <div className="text-gray-600 mb-6">/month</div>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">30+ referrals/month</span>
                </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">50% commission</span>
                </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">€49.50 per sale</span>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Join Our Program?
            </h2>
                </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: DollarSign, color: 'blue', title: 'High Commission', desc: 'Earn 50% on every sale - one of the highest rates in the industry' },
              { icon: BarChart3, color: 'purple', title: 'Real-Time Tracking', desc: 'Track your referrals and earnings in real-time with our dashboard' },
              { icon: Mail, color: 'green', title: 'Monthly Payouts', desc: 'Get paid on the 1st of every month via PayPal (minimum €50)' },
              { icon: Star, color: 'yellow', title: 'Premium Product', desc: 'Promote a high-quality AI platform that customers love' },
              { icon: Zap, color: 'pink', title: 'Instant Approval', desc: 'Get approved instantly and start earning right away' },
              { icon: Award, color: 'indigo', title: '30-Day Cookies', desc: 'Earn commission on sales within 30 days of your referral' },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <benefit.icon className={`w-6 h-6 text-${benefit.color}-600`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
              </div>
              </div>
            ))}
              </div>
        </div>
      </section>

      {/* Marketing Materials - Show to all */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Marketing Materials
            </h2>
            <p className="text-xl text-gray-600">
              {isAuthenticated && stats ? 'Your personalized marketing materials' : 'Everything you need to promote AI Orchestrator'}
            </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Social Media */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Social Media Kit</h3>
                </div>
              <p className="text-gray-600 mb-6">
                Ready-to-use posts and images for all social platforms
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Facebook Posts</span>
              </div>
                  <button 
                    onClick={() => marketingMaterials && showMaterial('social', marketingMaterials.socialMedia.facebook[0])}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-700">Twitter/X Templates</span>
                  </div>
                  <button 
                    onClick={() => marketingMaterials && showMaterial('social', marketingMaterials.socialMedia.twitter[0])}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <span className="text-gray-700">LinkedIn Content</span>
                  </div>
                  <button 
                    onClick={() => marketingMaterials && showMaterial('social', marketingMaterials.socialMedia.linkedin[0])}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Copy
                  </button>
                </div>
            </div>
        </div>

            {/* Email Templates */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Email Templates</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Pre-written email templates to reach out to your network
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Introduction Email</span>
                  <button 
                    onClick={() => marketingMaterials && showMaterial('email', marketingMaterials.emailTemplates.introduction)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Copy
                  </button>
              </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Follow-up Email</span>
                  <button 
                    onClick={() => marketingMaterials && showMaterial('email', marketingMaterials.emailTemplates.followUp)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Copy
                  </button>
              </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Newsletter Template</span>
                  <button 
                    onClick={() => marketingMaterials && showMaterial('email', marketingMaterials.emailTemplates.newsletter)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Copy
                  </button>
              </div>
              </div>
            </div>
              
            {/* Blog Articles */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Content Ideas</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Blog post ideas and talking points for your content
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-1">Why AI Chatbots?</div>
                  <div className="text-sm text-gray-600">Complete article outline</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-1">E-commerce Success Stories</div>
                  <div className="text-sm text-gray-600">Case studies and examples</div>
              </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900 mb-1">Multilingual Support Guide</div>
                  <div className="text-sm text-gray-600">Technical overview</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of affiliates already earning with AI Orchestrator
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <p className="mt-4 text-gray-600 text-sm">
            No credit card required • Paid on the 1st of every month
          </p>
        </div>
      </section>

      {/* Affiliate Registration Form - Only for logged-in users without affiliate account */}
      {isAuthenticated && showRegisterForm && (
        <section id="register-form" className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Complete Your Registration
                </h2>
                <p className="text-gray-600">
                  Enter your PayPal email to receive your monthly payouts
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Your login email:</div>
                  <div className="font-semibold text-gray-900">{user?.email}</div>
              </div>
                
                <label className="block text-gray-700 font-semibold mb-2">
                  PayPal Email (for receiving payments)
                </label>
                <input
                  type="email"
                  value={paypalEmail || user?.email || ''}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder={user?.email || 'your-email@paypal.com'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                />
                <div className="text-xs text-gray-500 mb-4">
                  Use the same email as your login or enter a different PayPal email
                </div>
                <button
                  onClick={registerAsAffiliate}
                  disabled={!paypalEmail && !user?.email}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Activate Affiliate Account
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Affiliate Dashboard - Only for registered affiliates */}
      {isAuthenticated && stats && !loading && (
        <section id="dashboard" className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Your Affiliate Dashboard
              </h2>
              <p className="text-xl text-gray-600">
                Welcome back, {user?.firstName}! Track your earnings in real-time
              </p>
              </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  €{stats.totalEarnings.toFixed(2)}
              </div>
                <div className="text-gray-600 text-sm">Total Earnings</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                  {stats.canRequestPayout && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  €{stats.pendingEarnings.toFixed(2)}
                </div>
                <div className="text-gray-600 text-sm">Pending (paid 1st of month)</div>
        </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.totalReferrals}
                </div>
                <div className="text-gray-600 text-sm">Total Referrals</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-yellow-600" />
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.convertedReferrals}
                </div>
                <div className="text-gray-600 text-sm">Converted ({stats.commissionRate}%)</div>
              </div>
        </div>

            {/* Referral Link */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-12 border-2 border-blue-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6 text-blue-600" />
                Your Referral Link
              </h3>
              <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={`http://localhost:5176/?ref=${stats.affiliateCode}`}
                    readOnly
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 font-mono text-sm"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                          </div>
        </div>
              <div className="text-gray-600 text-sm">
                Share this link to start earning {stats.commissionRate}% commission on every sale!
                          </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Recent Referrals
              </h3>
              {stats.recentReferrals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No referrals yet</p>
                  <p className="text-sm">Start sharing your link to earn commissions!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentReferrals.map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-semibold text-gray-900">{ref.referredEmail}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ref.status === 'converted' && (
                          <>
                            <span className="text-green-600 font-bold">
                              €{ref.commissionAmount.toFixed(2)}
                            </span>
                            <Check className="w-5 h-5 text-green-500" />
                          </>
                        )}
                        {ref.status === 'pending' && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                            Pending Payment
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
              )}
            </div>
      </div>
        </section>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please login or create an account to access the affiliate program and start earning commissions.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/');
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Go to Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
      </div>
      </div>
      )}

      {/* Copy Success Notification */}
      {showCopySuccess && (
        <div className="fixed top-20 right-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-xl shadow-2xl p-4 z-50 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
              <div>
              <div className="font-bold text-gray-900">Copied to clipboard!</div>
              <div className="text-sm text-gray-600">
                {stats ? 'Your personalized link is included' : 'Register to get your unique referral link'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMaterialModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-br from-blue-50 to-indigo-100 border-b-2 border-blue-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Marketing Material</h3>
                <button 
                  onClick={() => setShowMaterialModal(false)}
                  className="text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
              </div>
              
            <div className="p-6">
              {selectedMaterial.subject && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Subject:</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-900 font-semibold">
                    {selectedMaterial.subject}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  {selectedMaterial.text ? 'Post Text:' : 'Email Body:'}
                </label>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {(selectedMaterial.body || selectedMaterial.text || '').replace(/\[YOUR_REFERRAL_LINK\]/g, `http://localhost:5176/?ref=${stats?.affiliateCode || 'YOUR_CODE'}`)}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => copyMaterial(selectedMaterial.body || selectedMaterial.text || '')}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowMaterialModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Same as landing, only legal pages */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
                          </div>
              <div className="text-2xl font-bold">AI Orchestrator</div>
            </div>
            <p className="text-gray-400 mb-6">
              © 2025 AI Orchestrator. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </button>
              <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AffiliateProgram; 
