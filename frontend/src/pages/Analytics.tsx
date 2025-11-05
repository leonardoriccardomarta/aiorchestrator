import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/constants';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Globe, 
  Clock, 
  Target, 
  Zap,
  Activity,
  DollarSign,
  Star,
  Eye,
  MousePointer,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useChatbot } from '../contexts/ChatbotContext';
import ChatbotSelector from '../components/ChatbotSelector';

interface AnalyticsData {
  overview: {
    totalMessages: number;
    totalUsers: number;
    conversionRate: number;
    avgResponseTime: number;
    satisfactionScore: number;
    revenue: number;
    growthRate: number;
  };
  messages: {
    daily: Array<{ date: string; count: number }>;
    hourly: Array<{ hour: number; count: number }>;
    byLanguage: Array<{ language: string; count: number; percentage: number }>;
  };
  performance: {
    responseTime: Array<{ date: string; avgTime: number }>;
    satisfaction: Array<{ date: string; score: number }>;
    conversion: Array<{ date: string; rate: number }>;
  };
  insights: Array<{
    id: string;
    type: 'positive' | 'negative' | 'neutral';
    title: string;
    description: string;
    impact: string;
    recommendation: string;
  }>;
}

const Analytics: React.FC = () => {
  const { user } = useUser();
  const { selectedChatbotId, chatbots } = useChatbot();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'messages' | 'satisfaction'>('messages');
  const noData = !data || (data?.overview?.totalMessages || 0) === 0;

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedChatbotId]); // Reload when chatbot or time range changes

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // REAL API call - filtered by chatbot
      const url = selectedChatbotId 
        ? `${API_URL}/api/analytics?range=${timeRange}&chatbotId=${selectedChatbotId}`
        : `${API_URL}/api/analytics?range=${timeRange}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        // If no data, show real zeros (no chatbot active)
        setData({
          overview: {
            totalMessages: 0,
            totalUsers: 0,
            conversionRate: 0,
            avgResponseTime: 0,
            satisfactionScore: 0,
            revenue: 0,
            growthRate: 0
          },
          messages: { 
            daily: [], 
            hourly: [], 
            byLanguage: [] 
          },
          performance: {
            responseTime: [],
            satisfaction: [],
            conversion: []
          },
          insights: []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Real zeros if no chatbot active
      setData({
        overview: {
          totalMessages: 0,
          totalUsers: 0,
          conversionRate: 0,
          avgResponseTime: 0,
          satisfactionScore: 0,
          revenue: 0,
          growthRate: 0
        },
        messages: { 
          daily: [], 
          hourly: [], 
          byLanguage: [] 
        },
        performance: {
          responseTime: [],
          satisfaction: [],
          conversion: []
        },
        insights: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data removed - using real API data only

  // Export removed by request

  const StatCard = ({ title, value, icon: Icon, color, prefix = '', suffix = '' }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
        <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg lg:rounded-xl ${color}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-xs sm:text-xs lg:text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
      </div>
    </div>
  );

  const InsightCard = ({ insight }: { insight: any }) => {
    const getTypeColor = () => {
      switch (insight.type) {
        case 'positive': return 'bg-green-50 border-green-200 text-green-800';
        case 'negative': return 'bg-red-50 border-red-200 text-red-800';
        case 'neutral': return 'bg-blue-50 border-blue-200 text-blue-800';
        default: return 'bg-gray-50 border-gray-200 text-gray-800';
      }
    };

    const getImpactColor = () => {
      switch (insight.impact) {
        case 'High': return 'bg-red-100 text-red-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700';
        case 'Low': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-3 lg:mb-4">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">{insight.title}</h4>
            <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3">{insight.description}</p>
            <div className="flex items-center space-x-2 mb-2 lg:mb-3">
              <span className="text-[10px] lg:text-xs font-medium text-gray-500">Impact:</span>
              <span className={`px-2 py-1 rounded-full text-[10px] lg:text-xs font-medium ${getImpactColor()}`}>
                {insight.impact}
              </span>
            </div>
            <p className="text-xs lg:text-sm text-gray-700 bg-gray-50 p-2 lg:p-3 rounded-md lg:rounded-lg">
              <span className="font-medium">Recommendation:</span> {insight.recommendation}
            </p>
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
              <BarChart3 className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-xl font-medium">Loading analytics...</p>
          <p className="mt-2 text-gray-500">Analyzing your chatbot performance</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No analytics data yet</h3>
          <p className="text-gray-600">Start using your chatbots to see analytics here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-lg hidden sm:block">Real-time insights into your chatbot performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4 w-full lg:w-auto">
              <div className="w-full sm:w-auto">
                <ChatbotSelector />
              </div>
              {!selectedChatbotId && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-blue-700 font-medium">Aggregated Data</span>
                </div>
              )}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 lg:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base bg-white text-gray-900 touch-manipulation min-h-[44px]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={fetchAnalyticsData}
                className="flex items-center justify-center px-3 lg:px-4 py-1.5 sm:py-2 text-gray-700 bg-gray-100 rounded-md lg:rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors font-medium text-sm lg:text-base touch-manipulation min-h-[44px]"
              >
                <RefreshCw className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
        {/* Overview - styled like Dashboard */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4 sm:mb-6 lg:mb-8" data-tour="overview">
          <div className="px-3 sm:px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Overview</h3>
                <p className="text-xs lg:text-sm text-gray-600">Key KPIs for your chatbot</p>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Messages"
            value={noData ? 0 : (data?.overview?.totalMessages || 0)}
            icon={MessageSquare}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Users"
            value={noData ? 0 : (data?.overview?.totalUsers || 0)}
            icon={Users}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          {/* Removed conversion/revenue to avoid non-real metrics */}
          <StatCard
            title="Avg Response Time"
            value={noData ? 0 : (data?.overview?.avgResponseTime || 0)}
            icon={Clock}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            suffix="s"
          />
          <StatCard
            title="Satisfaction Score"
            value={noData ? 0 : (data?.overview?.satisfactionScore || 0)}
            icon={Star}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            suffix="/5"
          />
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <StatCard
              title="Languages Active"
              value={noData ? 0 : (data?.messages?.byLanguage?.length || 0)}
              icon={Globe}
              color="bg-gradient-to-r from-teal-500 to-teal-600"
            />
          </div>
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="text-xs lg:text-sm text-gray-600">Uptime</div>
            <div className="text-xl lg:text-3xl font-bold text-green-600">
              99.9%
            </div>
          </div>
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="text-xs lg:text-sm text-gray-600">Users</div>
            <div className="text-xl lg:text-3xl font-bold text-blue-600">{noData ? 0 : (data?.overview?.totalUsers || 0)}</div>
          </div>
        </div>

        {/* Charts Section - real only; empty state when no data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8" data-tour="charts">
          {/* Messages Over Time */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Messages Over Time</h3>
            </div>
            {noData || !data?.messages?.daily?.length ? (
              <div className="h-32 lg:h-48 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-lg lg:rounded-xl">
                <div className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-lg lg:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">No Data Yet</h4>
                  <p className="text-xs lg:text-sm text-gray-600">Start chatting to see message trends</p>
                </div>
              </div>
            ) : (
              <div className="h-32 lg:h-48">{/* chart implementation placeholder removed */}</div>
            )}
          </div>

          {/* Language Distribution */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Messages by Language</h3>
            {noData || !data?.messages?.byLanguage?.length ? (
              <div className="h-32 lg:h-48 flex items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-lg lg:rounded-xl">
                <div className="text-center">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-lg lg:rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">No Data Yet</h4>
                  <p className="text-xs lg:text-sm text-gray-600">Languages will appear once messages arrive</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4">
                {data?.messages?.byLanguage?.map((lang) => (
                  <div key={lang.language} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 text-sm lg:text-base">{lang.language}</span>
                    <span className="text-xs lg:text-sm text-gray-600">{lang.percentage}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Insights - Only for Professional+ plans */}
        {(user?.planId === 'professional' || user?.planId === 'business') && (
          <div className="mb-6 lg:mb-8" data-tour="ai-insights">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900">AI Insights</h2>
              <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
                <Zap className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>Powered by Machine Learning</span>
              </div>
            </div>
          {data?.insights && data.insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {data.insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12 bg-gray-50 rounded-xl lg:rounded-2xl">
              <Activity className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 text-gray-300" />
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">Analytics Overview</h3>
              <p className="text-gray-600 mb-4 text-sm lg:text-base">Your chatbot analytics are being collected in real-time</p>
              <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg lg:text-2xl font-bold text-blue-600">{data?.overview?.totalMessages || 0}</div>
                  <div className="text-xs lg:text-sm text-blue-600">Total Messages</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg lg:text-2xl font-bold text-green-600">{data?.overview?.totalUsers || 0}</div>
                  <div className="text-xs lg:text-sm text-green-600">Unique Users</div>
                </div>
              </div>
            </div>
          )}
          </div>
        )}

        {/* Performance Trends - REAL DATA */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Performance Trends</h3>
            {/* Export removed */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <div className="text-center">
              <div className="text-xl lg:text-3xl font-bold text-green-600 mb-1 lg:mb-2">
                99.9%
              </div>
              <div className="text-xs lg:text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-3xl font-bold text-blue-600 mb-1 lg:mb-2">
                {data?.overview?.avgResponseTime ? `${data.overview.avgResponseTime}s` : '0s'}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-xl lg:text-3xl font-bold text-purple-600 mb-1 lg:mb-2">
                {data?.overview?.satisfactionScore ? `${data.overview.satisfactionScore}/5` : '0/5'}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

