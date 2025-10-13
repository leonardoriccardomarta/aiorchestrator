import React, { useState, useEffect } from 'react';
import { BarChart2, AlertCircle, TrendingUp, Users, MessageSquare, RefreshCw, Zap } from 'lucide-react';

interface UsageStats {
  current: {
    messagesCount: number;
    chatbotsCount: number;
    teamMembersCount: number;
    channelsCount: number;
  };
  limits: {
    messages: number;
    chatbots: number;
    teamMembers: number;
    channels: number;
  };
  percentages: {
    messages: number;
    chatbots: number;
    teamMembers: number;
    channels: number;
  };
}

const UsageDashboard: React.FC = () => {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/usage/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsageStats(data);
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (!refreshing) {
      fetchUsageStats();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
            <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading your usage statistics...</p>
        </div>
      </div>
    );
  }

  if (!usageStats) {
    return (
      <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Unable to load usage statistics</p>
        <button 
          onClick={fetchUsageStats}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  const UsageCard = ({ 
    title, 
    current, 
    limit, 
    percentage, 
    icon: Icon,
    color 
  }: {
    title: string;
    current: number;
    limit: number;
    percentage: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 lg:p-7 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">{title}</h3>
            <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">Usage</span>
          </div>
        </div>
        {percentage >= 85 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg animate-pulse">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Current usage</span>
          <span className="font-bold text-gray-900 text-lg">
            {current.toLocaleString()} / {limit === 999 ? '∞' : limit.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ease-out ${
            percentage >= 95 ? 'bg-gradient-to-r from-red-500 to-red-600' :
            percentage >= 85 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
            percentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
            'bg-gradient-to-r from-green-500 to-green-600'
          } relative`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 font-medium">{percentage}% used</span>
          {percentage >= 80 && (
            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-md">
              Consider upgrading
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 rounded-2xl">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-heading">Usage & Limits</h1>
          <p className="text-gray-600 text-base lg:text-lg font-body">Monitor your plan usage and optimize your workflow</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl border border-gray-200 transition-all duration-200 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 transition-transform duration-200 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span>Refresh</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="group relative overflow-hidden bg-gradient-primary hover:shadow-lg text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span className="relative z-10">Upgrade Plan</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>

      {/* Responsive Grid with Enhanced Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <UsageCard
          title="Messages"
          current={usageStats.current.messagesCount}
          limit={usageStats.limits.messages}
          percentage={usageStats.percentages.messages}
          icon={MessageSquare}
          color="from-blue-500 to-blue-600"
        />
        
        <UsageCard
          title="Chatbots"
          current={usageStats.current.chatbotsCount}
          limit={usageStats.limits.chatbots}
          percentage={usageStats.percentages.chatbots}
          icon={BarChart2}
          color="from-green-500 to-green-600"
        />
        
        <UsageCard
          title="Team Members"
          current={usageStats.current.teamMembersCount}
          limit={usageStats.limits.teamMembers}
          percentage={usageStats.percentages.teamMembers}
          icon={Users}
          color="from-purple-500 to-purple-600"
        />
        
        <UsageCard
          title="Channels"
          current={usageStats.current.channelsCount}
          limit={usageStats.limits.channels}
          percentage={usageStats.percentages.channels}
          icon={TrendingUp}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Enhanced Warning Section */}
      {Object.entries(usageStats.percentages).some(([, percentage]) => percentage >= 80) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-orange-800 text-xl">Usage Warnings</h3>
          </div>
          <div className="text-base text-orange-700 space-y-2 mb-4">
            {Object.entries(usageStats.percentages).map(([key, percentage]) => {
              if (percentage >= 80) {
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong> usage is at <strong>{percentage}%</strong></span>
                  </div>
                );
              }
              return null;
            }).filter(Boolean)}
          </div>
          <button 
            onClick={() => window.location.href = '/pricing'}
            className="group bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <span>Upgrade your plan</span>
            <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UsageDashboard;