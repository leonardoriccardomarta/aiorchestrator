import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useChatbot } from '../contexts/ChatbotContext';
import ChatbotSelector from '../components/ChatbotSelector';
import TrialCountdown from '../components/TrialCountdown';
import { 
  MessageSquare, 
  Users, 
  TrendingUp,
  ShoppingCart,
  Globe,
  Settings,
  BarChart3,
  Bot,
  Zap,
  Shield,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Plus,
  ExternalLink,
  Activity,
  DollarSign,
  Target,
  Sparkles,
  Eye,
  MessageCircle,
  Database,
  Cpu,
  Layers
} from 'lucide-react';
import OnboardingWizard from '../components/OnboardingWizard';
import { EmptyChatbots, EmptyConnections, EmptyAnalytics, EmptyMessages } from '../components/EmptyState';
import TrialEnforcement from '../components/TrialEnforcement';
import ChatbotManagement from '../components/ChatbotManagement';
import PlanLimitations from '../components/PlanLimitations';

interface DashboardStats {
  totalChatbots: number;
  totalMessages: number;
  activeConnections: number;
  totalRevenue: number;
  responseRate: number;
  customerSatisfaction: number;
  monthlyGrowth: number;
  activeUsers: number;
  conversionRate: number;
  avgResponseTime: number;
  languagesSupported: number;
  uptime: number;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  planId: string;
  isTrialActive: boolean;
  trialEndDate: string;
  isPaid: boolean;
  hasCompletedOnboarding: boolean;
  isNewUser: boolean;
}

interface RecentActivity {
  id: string;
  type: 'message' | 'order' | 'connection' | 'chatbot' | 'analytics' | 'integration';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  value?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { chatbots, selectedChatbotId, selectedChatbot } = useChatbot();
  const [userPlan, setUserPlan] = useState<string>('starter');
  const [stats, setStats] = useState<DashboardStats>({
    totalChatbots: chatbots.length,
    totalMessages: 0,
    activeConnections: 0,
    totalRevenue: 0,
    responseRate: 0,
    customerSatisfaction: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    languagesSupported: 0,
    uptime: 0
  });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
    checkFirstTimeUser();
  }, [selectedChatbotId, chatbots.length]); // Ricarica quando cambia chatbot o numero di chatbot

  const checkFirstTimeUser = () => {
    const isFirstTime = !localStorage.getItem('hasSeenOnboarding');
    if (isFirstTime) {
      setShowOnboarding(true);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Dashboard: Fetching data...', { selectedChatbotId, chatbotsLength: chatbots.length });
      
      // Fetch real dashboard data from API (filtered by selected chatbot)
      const url = selectedChatbotId 
        ? `${API_URL}/api/dashboard/stats?chatbotId=${selectedChatbotId}`
        : `${API_URL}/api/dashboard/stats`;
      
      console.log('📡 Dashboard: API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      console.log('📊 Dashboard: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dashboard: API Response:', data);
        
        if (data.success && data.data) {
          setStats({
            totalChatbots: data.data.totalChatbots || chatbots.length, // Use API data first, then context
            totalMessages: data.data.totalMessages || 0,
            activeConnections: data.data.activeConnections || 0,
            totalRevenue: data.data.totalRevenue || 0,
            responseRate: data.data.responseRate || 0,
            customerSatisfaction: data.data.customerSatisfaction || 0,
            monthlyGrowth: data.data.monthlyGrowth || 0,
            activeUsers: data.data.activeUsers || 0,
            conversionRate: data.data.conversionRate || 0,
            avgResponseTime: data.data.avgResponseTime || 0,
            languagesSupported: data.data.languagesActive || data.data.languagesSupported || 0,
            uptime: data.data.uptime || 0
          });
          
          setUserPlan(data.data.planInfo?.planId || 'starter');
        }
      } else {
        // Fallback to context data when API fails
        console.log('Dashboard API failed, using context data');
        setStats({
          totalChatbots: chatbots.length,
          totalMessages: 0,
          activeConnections: 0,
          totalRevenue: 0,
          responseRate: 0,
          customerSatisfaction: 0,
          monthlyGrowth: 0,
          activeUsers: 0,
          conversionRate: 0,
          avgResponseTime: 0,
          languagesSupported: 0,
          uptime: 0
        });
      }

      // Fetch real recent activity from API
      const activityResponse = await fetch(`${API_URL}/api/dashboard/activity`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        console.log('📈 Activity data received:', activityData);
        // Support both "activities" and "data" fields (backward compatibility)
        const activitiesArray = activityData.activities || activityData.data || [];
        console.log('📈 Activities array:', activitiesArray);
        // Log first activity to debug
        if (activitiesArray.length > 0) {
          console.log('📈 First activity object:', JSON.stringify(activitiesArray[0], null, 2));
        }
        // Ensure all activities have a value field
        const activitiesWithValue = activitiesArray.map((activity: any) => ({
          ...activity,
          value: activity.value ?? 0 // Use nullish coalescing to set 0 if value is null/undefined
        }));
        console.log('📈 Activities with value:', activitiesWithValue);
        // Log first processed activity
        if (activitiesWithValue.length > 0) {
          console.log('📈 First processed activity:', JSON.stringify(activitiesWithValue[0], null, 2));
        }
        setRecentActivity(activitiesWithValue);
      } else {
        // If no real activity, show empty state
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle, trend, prefix = '', suffix = '' }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="group bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 
            trend === 'down' ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
            <span>{trend === 'up' ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {prefix}{typeof value === 'number' && !isNaN(value) && value !== undefined && value !== null ? value.toLocaleString() : (value || 0)}{suffix}
        </p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, onClick, color, status, badge }: {
    title: string;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
    color: string;
    status?: 'active' | 'inactive' | 'pending' | 'new';
    badge?: string;
  }) => (
    <button
      onClick={onClick}
      className="group p-4 lg:p-6 text-left bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:scale-105 w-full"
    >
      <div className="flex items-start space-x-3 lg:space-x-4">
        <div className={`w-10 h-10 lg:w-12 lg:h-12 ${color} rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative flex-shrink-0`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          {badge && (
            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full font-bold">
              {badge}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1 lg:mb-2">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{title}</h3>
            {status === 'active' && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>}
            {status === 'pending' && <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>}
            {status === 'new' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>}
          </div>
          <p className="text-sm lg:text-base text-gray-600 group-hover:text-gray-700 transition-colors mb-2 lg:mb-3 line-clamp-2">{description}</p>
          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
            <span>Get started</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'message': return MessageSquare;
        case 'order': return ShoppingCart;
        case 'connection': return Settings;
        case 'chatbot': return Bot;
        case 'analytics': return BarChart3;
        case 'integration': return Globe;
        default: return MessageSquare;
      }
    };

    const getStatusColor = () => {
      switch (activity.status) {
        case 'success': return 'text-green-500 bg-green-100';
        case 'warning': return 'text-yellow-500 bg-yellow-100';
        case 'error': return 'text-red-500 bg-red-100';
        case 'info': return 'text-blue-500 bg-blue-100';
        default: return 'text-gray-500 bg-gray-100';
      }
    };

    const Icon = getIcon();

    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-xl transition-colors">
        <div className={`w-10 h-10 ${getStatusColor()} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
            {activity.value && (
              <span className="text-xs font-medium text-gray-700">
                {typeof activity.value === 'number' && activity.value > 0 ? '+' : ''}
                {typeof activity.value === 'number' && !isNaN(activity.value) && activity.value !== undefined && activity.value !== null ? activity.value.toLocaleString() : (activity.value || 0)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Bot className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-xl font-medium">Loading your dashboard...</p>
          <p className="mt-2 text-gray-500">Preparing your AI insights</p>
        </div>
      </div>
    );
  }

  // Safely render stats to avoid undefined errors
  const safeStats = {
    ...stats,
    totalChatbots: stats.totalChatbots ?? 0,
    totalMessages: stats.totalMessages ?? 0,
    responseRate: stats.responseRate ?? 0,
    avgResponseTime: stats.avgResponseTime ?? 0,
    totalRevenue: stats.totalRevenue ?? 0,
    conversionRate: stats.conversionRate ?? 0,
    languagesSupported: stats.languagesSupported ?? 0,
    uptime: stats.uptime ?? 0,
    customerSatisfaction: stats.customerSatisfaction ?? 0,
    activeConnections: stats.activeConnections ?? 0,
    monthlyMessages: stats.monthlyMessages ?? 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 lg:py-6 space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
                Welcome back!
              </h1>
              <p className="text-gray-600 text-xs lg:text-lg hidden sm:block">
                Here's what's happening with your AI chatbots today.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:space-x-4 w-full lg:w-auto">
              <div className="w-full lg:w-auto">
                <ChatbotSelector />
              </div>
              {!selectedChatbotId && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700 font-medium">All Chatbots</span>
                </div>
              )}
              <button
                onClick={() => setShowOnboarding(true)}
                className="flex items-center px-2 lg:px-4 py-1.5 lg:py-2 text-gray-700 bg-white border border-gray-300 rounded-md lg:rounded-lg hover:bg-gray-50 transition-colors text-xs lg:text-base"
              >
                <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Onboarding</span>
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="flex items-center px-3 lg:px-6 py-1.5 lg:py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg lg:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-xs lg:text-base"
              >
                <BarChart3 className="w-3 h-3 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">View </span>Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-8">
        {/* Stats Grid - Mobile: Single column, Desktop: 4 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-6 mb-4 lg:mb-8">
          <StatCard
            title="Active Chatbots"
            value={safeStats.totalChatbots}
            icon={Bot}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            subtitle="Running smoothly"
          />
          <StatCard
            title="Messages Today"
            value={safeStats.totalMessages}
            icon={MessageSquare}
            color="bg-gradient-to-r from-green-500 to-green-600"
            subtitle="Total conversations"
          />
          <StatCard
            title="Response Rate"
            value={safeStats.responseRate}
            icon={TrendingUp}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            subtitle={`Avg response: ${safeStats.avgResponseTime}`}
            suffix="%"
          />
          <StatCard
            title="Revenue Impact"
            value={safeStats.totalRevenue}
            icon={DollarSign}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            subtitle="Total generated"
            prefix="$"
          />
        </div>

        {/* Trial Countdown */}
        <TrialCountdown 
          onUpgrade={() => navigate('/pricing')}
        />

        {/* Quick Actions */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">Quick Actions</h2>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Features</span>
            </div>
          </div>
          {/* Mobile: Vertical Stack | Desktop: Grid */}
          <div className="space-y-4 md:hidden">
            <QuickAction
              title="Create New Chatbot"
              description="Set up a new AI assistant for your store with 50+ languages"
              icon={Bot}
              onClick={() => navigate('/chatbot')}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              status="active"
              badge="NEW"
            />
            <QuickAction
              title="Connect Shopify"
              description="Integrate with your Shopify store in one click"
              icon={ShoppingCart}
              onClick={() => navigate('/connections')}
              color="bg-gradient-to-r from-green-500 to-green-600"
              status="active"
            />
            <QuickAction
              title="View Analytics"
              description="See detailed performance insights and analytics"
              icon={BarChart3}
              onClick={() => navigate('/analytics')}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              status="active"
            />
            <QuickAction
              title="Multi-Language Support"
              description="Auto-detect 50+ languages in your chatbot"
              icon={Globe}
              onClick={() => navigate('/chatbot')}
              color="bg-gradient-to-r from-teal-500 to-teal-600"
              status="active"
            />
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction
              title="Create New Chatbot"
              description="Set up a new AI assistant for your store with 50+ languages"
              icon={Bot}
              onClick={() => navigate('/chatbot')}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              status="active"
              badge="NEW"
            />
            <QuickAction
              title="Connect Shopify"
              description="Integrate with your Shopify store in one click"
              icon={ShoppingCart}
              onClick={() => navigate('/connections')}
              color="bg-gradient-to-r from-green-500 to-green-600"
              status="active"
            />
            <QuickAction
              title="View Analytics"
              description="See detailed performance insights and analytics"
              icon={BarChart3}
              onClick={() => navigate('/analytics')}
              color="bg-gradient-to-r from-purple-500 to-purple-600"
              status="active"
            />
            <PlanLimitations feature="WooCommerce Setup" requiredPlan="professional">
              <QuickAction
                title="WooCommerce Setup"
                description="Connect your WooCommerce store for seamless integration"
                icon={Database}
                onClick={() => navigate('/connections')}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
                status="pending"
              />
            </PlanLimitations>
            <PlanLimitations feature="AI Insights" requiredPlan="professional">
              <QuickAction
                title="AI Insights"
                description="Advanced sentiment analysis and customer insights"
                icon={Cpu}
                onClick={() => navigate('/analytics')}
                color="bg-gradient-to-r from-indigo-500 to-indigo-600"
                status="new"
              />
            </PlanLimitations>
            <QuickAction
              title="Multi-Language Support"
              description="Auto-detect 50+ languages in your chatbot"
              icon={Globe}
              onClick={() => navigate('/chatbot')}
              color="bg-gradient-to-r from-teal-500 to-teal-600"
              status="active"
            />
          </div>
        </div>

        {/* Chatbot Management */}
        <div className="mb-4 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-xl font-semibold text-gray-900">Chatbot Management</h3>
                    <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Manage your AI assistants</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/chatbot')}
                  className="flex items-center px-3 md:px-4 py-1.5 md:py-2 text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <span className="hidden sm:inline">View All</span>
                  <ExternalLink className="w-4 h-4 sm:ml-1" />
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <ChatbotManagement />
            </div>
          </div>
        </div>

        {/* Recent Activity & Performance - Mobile: Vertical, Desktop: 2 columns */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-xl font-semibold text-gray-900">Recent Activity</h3>
                    <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Live updates from your AI</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/analytics')}
                  className="text-green-600 hover:text-green-700 text-xs md:text-sm font-medium"
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                </button>
              </div>
            </div>
            <div className="p-4 md:p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-1">
                  {recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Overview</h4>
                  <p className="text-gray-600 mb-4">Your chatbot is active and ready to help customers</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{safeStats.totalMessages}</div>
                      <div className="text-sm text-blue-600">Total Messages</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">{safeStats.activeConnections}</div>
                      <div className="text-sm text-green-600">Active Connections</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm md:text-xl font-semibold text-gray-900">Performance Overview</h3>
                  <p className="text-xs md:text-sm text-gray-600 hidden sm:block">System health & metrics</p>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6">
              {safeStats.totalMessages > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">System Health</p>
                        <p className="text-sm text-gray-600">All systems operational</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold text-xl">100%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Uptime</p>
                        <p className="text-sm text-gray-600">Last 30 days</p>
                      </div>
                    </div>
                    <span className="text-blue-600 font-bold text-xl">{safeStats.uptime}%</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Customer Satisfaction</p>
                        <p className="text-sm text-gray-600">Based on {safeStats.totalMessages} conversations</p>
                      </div>
                    </div>
                    <span className="text-purple-600 font-bold text-xl">
                      {safeStats.customerSatisfaction && safeStats.customerSatisfaction > 0 ? `${safeStats.customerSatisfaction.toFixed(1)}/5` : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Languages Active</p>
                        <p className="text-sm text-gray-600">Multilingual support</p>
                      </div>
                    </div>
                    <span className="text-orange-600 font-bold text-xl">
                      {safeStats.languagesSupported > 0 ? safeStats.languagesSupported : '0'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Total Messages</p>
                        <p className="text-sm text-gray-600">All time conversations</p>
                      </div>
                    </div>
                    <span className="text-indigo-600 font-bold text-xl">
                      {safeStats.totalMessagesAllTime || safeStats.totalMessages || '0'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Performance Data Yet</h4>
                  <p className="text-gray-600 mb-4">Start using your chatbot to see performance metrics</p>
                  <button
                    onClick={() => navigate('/chatbot')}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Onboarding Wizard */}
      <OnboardingWizard
        isOpen={showOnboarding}
        onComplete={() => {
          setShowOnboarding(false);
          localStorage.setItem('hasSeenOnboarding', 'true');
        }}
        onSkip={() => {
          setShowOnboarding(false);
          localStorage.setItem('hasSeenOnboarding', 'true');
        }}
      />
    </div>
  );
};

export default Dashboard;
// Force rebuild v2








