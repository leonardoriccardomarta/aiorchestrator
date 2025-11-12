import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ActiveChatbots from '../components/dashboard/ActiveChatbots';
import RecentEvents from '../components/dashboard/RecentEvents';
import TestQuickActions from '../components/dashboard/TestQuickActions';
import { apiService } from '../services/api';
import { CardLoading } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';
import { Icons } from '../components/ui/Icon';
import FeedbackModal from '../components/FeedbackModal';
import FakeTestimonials from '../components/traction/FakeTestimonials';

interface Event {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

interface SystemHealth {
  label: string;
  value: string;
  status: 'green' | 'yellow' | 'red';
}

interface DashboardStats {
  totalMessages: number;
  totalChatbots: number;
  activeUsers: number;
  responseTime: number;
  revenue: number;
  conversions: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [chatbots, setChatbots] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsResponse, botsResponse, eventsResponse] = await Promise.all([
          apiService.getDashboardStats(timeRange),
          apiService.getChatbots(),
          apiService.getRecentEvents()
        ]);
        
        // Extract data from mock API responses
        setDashboardStats(statsResponse.data);
        setChatbots(botsResponse.data || []);
        setEvents(eventsResponse.data || []);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Handle loading states
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle error states
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-error-600 text-6xl mb-4"></div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
             Unable to load dashboard
          </h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="primary"
            leftIcon={<Icons.Dashboard />}
             className="transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
          >
             Retry
          </Button>
        </div>
      </div>
    );
  }

  const statsData = dashboardStats || { 
    totalMessages: 0, 
    totalChatbots: 0, 
    activeUsers: 0, 
    responseTime: 0,
    revenue: 0,
    conversions: 0
  };



  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-6">
      {/* Welcome Modal - Onboarding Progressivo */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step <= onboardingStep ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-slate-500">
                Step {onboardingStep} of 3
              </div>
            </div>

            {/* Slide 1: What is AI Orchestrator? */}
            {onboardingStep === 1 && (
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl"></span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to AI Orchestrator</h1>
                <p className="text-lg text-slate-600 mb-6">
                  The next generation of business automation powered by AI
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-First Approach</h3>
                      <p className="text-slate-600">
                        Unlike traditional automation tools, we use AI to understand, analyze, and make smart decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2: Why AI Orchestrator? */}
            {onboardingStep === 2 && (
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">⚡</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Why AI Orchestrator?</h1>
                <p className="text-lg text-slate-600 mb-6">
                  The difference between traditional automation and intelligent AI
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">vs n8n/Zapier</h3>
                      <p className="text-slate-600">
                        While they move data, we make intelligent decisions. Our AI understands context and learns from interactions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl"></span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Business Ready</h3>
                      <p className="text-slate-600">
                        Built for enterprise with advanced analytics, security, and scalability that traditional tools can't match.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3: How to Get Started */}
            {onboardingStep === 3 && (
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl"></span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Ready to Start?</h1>
                <p className="text-lg text-slate-600 mb-6">
                  Let's build your first AI-powered workflow
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl"></span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 1: Create AI Chatbot</h3>
                      <p className="text-slate-600">
                        Build intelligent chatbots that understand context and provide human-like responses.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 2: Build Workflows</h3>
                      <p className="text-slate-600">
                        Create intelligent workflows that make AI-driven decisions, not just data moves.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl"></span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Step 3: Monitor & Optimize</h3>
                      <p className="text-slate-600">
                        Track performance with AI-powered analytics and continuously improve your automation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              {onboardingStep > 1 && (
                <button
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium border border-slate-300 rounded-xl hover:bg-slate-50 transition-all duration-300"
                >
                  ← Back
                </button>
              )}
              
              {onboardingStep < 3 ? (
                <button
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowWelcomeModal(false);
                    navigate('/chatbot');
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Start Building Now! 
                </button>
              )}
              
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto" data-testid="dashboard">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">🏠 AI Orchestrator Dashboard</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Complete overview of your AI-powered business automation system
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
             AI Chatbots
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
            ⚡ Smart Workflows
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
             Business Intelligence
          </span>
        </div>
        
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <TestQuickActions />
        </div>
        
        {/* Time Range Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Time Range</h2>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {range === '24h' ? '24 Hours' : 
                   range === '7d' ? '7 Days' :
                   range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>


      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-indigo-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-xl sm:text-2xl">💬</span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Total Messages</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                {statsData.totalMessages || 0}
              </p>
              <p className="text-xs sm:text-sm text-green-600">+12% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl sm:text-2xl"></span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Active Chatbots</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                {statsData.totalChatbots || 0}
              </p>
              <p className="text-xs sm:text-sm text-green-600">+8% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-purple-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl sm:text-2xl">👥</span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                {statsData.activeUsers || 0}
              </p>
              <p className="text-xs sm:text-sm text-green-600">+15% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-yellow-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-xl sm:text-2xl">⚡</span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Response Time</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                {statsData.responseTime || 0}ms
              </p>
              <p className="text-xs sm:text-sm text-red-600">-5% vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl sm:text-2xl"></span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                ${(statsData.revenue || 0).toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm text-green-600">+23% vs last month</p>
          </div>
        </div>
      </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-indigo-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-xl sm:text-2xl"></span>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-600">Conversions</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                {statsData.conversions || 0}%
              </p>
              <p className="text-xs sm:text-sm text-green-600">+7% vs last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Chatbots */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-slate-200">
          <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900"> Active Chatbots</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-xl max-w-md w-full p-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900">Chatbots Management</h3>
                        <p class="text-slate-600">Access all chatbot features</p>
                      </div>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">View all active chatbots</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Create new chatbots</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Manage chatbot settings</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">View chatbot analytics</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Configure integrations</span>
                      </div>
                    </div>
                    <div class="bg-indigo-50 rounded-lg p-3 mb-4">
                      <p class="text-sm text-indigo-800">This is a demo - in production you would be redirected to the Chatbots page.</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                      Continue
                    </button>
                  </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
              }}
              rightIcon={<Icons.ChevronRight />}
               className="transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              View all
            </Button>
          </div>
          <ActiveChatbots 
            chatbots={chatbots} 
            onChatbotClick={(id) => {
              const chatbot = chatbots.find(c => c.id === id);
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900">${chatbot?.name || 'Chatbot'} Details</h3>
                      <p class="text-slate-600">Chatbot information and features</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-4">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Name:</span>
                      <span class="text-sm text-slate-900">${chatbot?.name || 'Unknown'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Status:</span>
                      <span class="text-sm text-slate-900">${chatbot?.status || 'Active'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Messages Today:</span>
                      <span class="text-sm text-slate-900">${chatbot?.messagesToday || 0}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Total Messages:</span>
                      <span class="text-sm text-slate-900">${chatbot?.totalMessages || 0}</span>
                    </div>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-slate-700"><strong>Description:</strong> ${chatbot?.description || 'No description'}</p>
                  </div>
                  <div class="space-y-2 mb-4">
                    <p class="text-sm font-medium text-slate-700">Features Available:</p>
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        <span class="text-xs text-slate-600">View chatbot analytics</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        <span class="text-xs text-slate-600">Edit chatbot settings</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        <span class="text-xs text-slate-600">Test chatbot responses</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-indigo-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-indigo-800">This is a demo - in production you would be redirected to chatbot details.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    Continue
                  </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
          />
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-slate-200">
          <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">📅 Recent Events</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
                modal.innerHTML = `
                  <div class="bg-white rounded-xl max-w-md w-full p-6">
                    <div class="flex items-center space-x-3 mb-4">
                      <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900">Events Log</h3>
                        <p class="text-slate-600">System event management</p>
                      </div>
                    </div>
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">View all system events</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Filter by event type</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Search event history</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Export event logs</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Monitor system activity</span>
                      </div>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-3 mb-4">
                      <p class="text-sm text-purple-800">This is a demo - in production you would be redirected to the Events page.</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                      Continue
                    </button>
                  </div>
                `;
                document.body.appendChild(modal);
                setTimeout(() => modal.remove(), 5000);
              }}
              rightIcon={<Icons.ChevronRight />}
               className="transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1"
            >
              View all
            </Button>
          </div>
          <RecentEvents 
            events={events} 
            onEventClick={(event) => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
              modal.innerHTML = `
                <div class="bg-white rounded-xl max-w-md w-full p-6">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900">Event Details</h3>
                      <p class="text-slate-600">System event information</p>
                    </div>
                  </div>
                  <div class="space-y-3 mb-4">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Title:</span>
                      <span class="text-sm text-slate-900">${event.title}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Type:</span>
                      <span class="text-sm text-slate-900">${event.type}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-slate-700">Timestamp:</span>
                      <span class="text-sm text-slate-900">${event.timestamp}</span>
                    </div>
                  </div>
                  <div class="bg-slate-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-slate-700"><strong>Description:</strong> ${event.description}</p>
                  </div>
                  <div class="space-y-2 mb-4">
                    <p class="text-sm font-medium text-slate-700">Event Actions:</p>
                    <div class="space-y-1">
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-slate-600">View full event details</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-slate-600">Export event data</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        <span class="text-xs text-slate-600">Mark as resolved</span>
                      </div>
                    </div>
                  </div>
                  <div class="bg-orange-50 rounded-lg p-3 mb-4">
                    <p class="text-sm text-orange-800">This is a demo - in production you would see detailed event information.</p>
                  </div>
                  <button onclick="this.closest('.fixed').remove()" class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                    Continue
                  </button>
                </div>
              `;
              document.body.appendChild(modal);
              setTimeout(() => modal.remove(), 5000);
            }}
          />
        </div>
      </div>

      {/* Why AI Orchestrator Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-indigo-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why AI Orchestrator?</h2>
          <p className="text-slate-600 text-sm sm:text-base">The next generation of business automation</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-First Approach</h3>
            <p className="text-sm text-slate-600 mb-3">
              Unlike n8n or Zapier that just move data, we use AI to understand context and make intelligent decisions.
            </p>
            <div className="text-xs text-indigo-600 font-medium">vs n8n: Data moves → AI decisions</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Conversational Intelligence</h3>
            <p className="text-sm text-slate-600 mb-3">
              Our chatbots don't just respond - they understand customer intent and guide them through complex processes.
            </p>
            <div className="text-xs text-purple-600 font-medium">vs Zapier: Simple triggers → Smart conversations</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Business Ready</h3>
            <p className="text-sm text-slate-600 mb-3">
              Pre-built templates for e-commerce, customer support, and sales - no complex setup required.
            </p>
            <div className="text-xs text-green-600 font-medium">vs Both: Complex setup → Ready-to-use</div>
          </div>
        </div>
      </div>

      {/* Demo Tour Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
            modal.innerHTML = `
              <div class="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl">
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-bold text-slate-900 mb-4"> AI Orchestrator Demo Tour</h2>
                  <p class="text-slate-600">See how AI Orchestrator transforms your business automation</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div class="space-y-6">
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl"></span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 1: Create AI Chatbot</h3>
                        <p class="text-slate-600 text-sm">Build intelligent chatbots that understand customer context and make smart decisions - unlike basic automation tools.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl">⚡</span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 2: Build Smart Workflows</h3>
                        <p class="text-slate-600 text-sm">Create workflows that use AI to make decisions, not just move data like n8n or Zapier.</p>
                      </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span class="text-2xl"></span>
                      </div>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-900 mb-2">Step 3: Monitor & Optimize</h3>
                        <p class="text-slate-600 text-sm">Track AI performance and get insights that help your business grow.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <h4 class="text-lg font-semibold text-slate-900 mb-4">Why AI Orchestrator?</h4>
                    <div class="space-y-3">
                      <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">AI makes decisions, not just data moves</span>
                      </div>
                      <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Conversational intelligence</span>
                      </div>
                      <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Business-ready templates</span>
                      </div>
                      <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span class="text-sm text-slate-700">Easier than n8n, smarter than Zapier</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex space-x-4">
                  <button onclick="this.closest('.fixed').remove(); window.location.href='/chatbot';" class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                    Start Building Now
                  </button>
                  <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium">
                    Close
                  </button>
                </div>
              </div>
            `;
            document.body.appendChild(modal);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
           Take a Demo Tour
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border border-transparent hover:border-slate-200">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/chatbot')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 relative group"
            title="Create intelligent AI chatbots that understand context and make smart decisions - unlike basic automation tools"
          >
            <span className="mr-1 sm:mr-2 text-lg sm:text-xl"></span>
            <span className="text-sm sm:text-base font-medium">New Chatbot</span>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Create AI chatbots that understand context
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
          <button
            onClick={() => navigate('/workflows')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg hover:from-green-700 hover:to-green-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 relative group"
            title="Build intelligent workflows that make AI-driven decisions - more powerful than n8n"
          >
            <span className="mr-1 sm:mr-2 text-lg sm:text-xl">⚡</span>
            <span className="text-sm sm:text-base font-medium">Create Workflow</span>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              AI-powered workflows that make decisions
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 relative group"
            title="Track AI performance and conversation insights - deeper than basic analytics"
          >
            <span className="mr-1 sm:mr-2 text-lg sm:text-xl"></span>
            <span className="text-sm sm:text-base font-medium">View Analytics</span>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              AI performance and conversation insights
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-6 py-3 sm:py-4 rounded-lg hover:from-gray-700 hover:to-gray-800 flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-1 relative group"
            title="Configure AI models, integrations, and business settings"
          >
            <span className="mr-1 sm:mr-2 text-lg sm:text-xl">⚙️</span>
            <span className="text-sm sm:text-base font-medium">Settings</span>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Configure AI models and integrations
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
        </div>

        {/* Testimonials Section */}
        <div className="lg:col-span-2">
          <FakeTestimonials className="mt-6" />
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          onSuccess={() => setFeedbackSubmitted(true)}
        />
      )}

      {/* Success Message */}
      {feedbackSubmitted && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 z-50 max-w-sm">
          <div className="flex items-center">
            <div className="text-green-600 text-2xl mr-3"></div>
            <div>
              <h4 className="font-semibold text-green-800">Thanks for your feedback!</h4>
              <p className="text-green-700 text-sm">Feedback sent successfully! You'll receive a confirmation email shortly.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
