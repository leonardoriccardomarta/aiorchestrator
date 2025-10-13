import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Target,
  ArrowLeft,
  Crown
} from 'lucide-react';

interface MLAnalyticsData {
  sentiment: {
    totalAnalyzed: number;
    sentimentDistribution: {
      positive: number;
      neutral: number;
      negative: number;
    };
    sentimentPercentage: {
      positive: string;
      neutral: string;
      negative: string;
    };
    averageScore: number;
  };
  intent: {
    totalClassified: number;
    intentDistribution: { [key: string]: number };
    intentPercentage: { [key: string]: string };
    averageConfidence: number;
  };
  recommendations: {
    totalRecommendations: number;
    totalUsers: number;
    averageClickRate: number;
    averageConversionRate: number;
  };
  churn: {
    totalPredictions: number;
    churnPrevented: number;
    averageRisk: number;
    highRiskUsers: number;
    preventionRate: string;
  };
  anomaly: {
    totalChecks: number;
    anomaliesDetected: number;
    spamDetected: number;
    botsDetected: number;
    fraudDetected: number;
    accuracy: string;
  };
}

const MLAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MLAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState('starter');

  useEffect(() => {
    fetchMLAnalytics();
  }, []);

  const fetchMLAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/ml/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.status === 403) {
        const errorData = await response.json();
        setError(errorData.error);
        setUserPlan('starter');
        return;
      }

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setUserPlan('pro');
      } else {
        throw new Error('Failed to fetch ML analytics');
      }
    } catch (err) {
      console.error('Error fetching ML analytics:', err);
      setError('Failed to load ML analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading ML Analytics...</p>
        </div>
      </div>
    );
  }

  // Upgrade required screen
  if (error && userPlan === 'starter') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ML Analytics Suite
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Unlock powerful machine learning insights including sentiment analysis, 
              intent classification, churn prediction, and more!
            </p>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-8">
              <Crown className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Available on Pro & Enterprise Plans</h3>
              <p className="text-blue-100">
                Starting at €99/month - Includes full ML suite
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Sentiment Analysis</h4>
                <p className="text-sm text-gray-600">Real-time emotion detection and urgency scoring</p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-xl">
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Intent Classification</h4>
                <p className="text-sm text-gray-600">Smart routing based on customer intent</p>
              </div>
              
              <div className="p-6 bg-indigo-50 rounded-xl">
                <BarChart3 className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Churn Prediction</h4>
                <p className="text-sm text-gray-600">Predict and prevent customer churn</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-shadow"
            >
              Upgrade to Pro - €99/month
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-blue-600" />
                ML Analytics Suite
              </h1>
              <p className="text-gray-600 mt-2">
                Advanced machine learning insights and predictions
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">
              <span className="font-semibold">Pro Plan Active</span>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-600" />
            Sentiment Analysis
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Analyzed</div>
              <div className="text-2xl font-bold">{data.sentiment.totalAnalyzed}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Positive
              </div>
              <div className="text-2xl font-bold text-green-600">
                {data.sentiment.sentimentPercentage.positive}%
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Neutral</div>
              <div className="text-2xl font-bold text-yellow-600">
                {data.sentiment.sentimentPercentage.neutral}%
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                Negative
              </div>
              <div className="text-2xl font-bold text-red-600">
                {data.sentiment.sentimentPercentage.negative}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <span className="text-sm text-gray-700">Average Sentiment Score</span>
            <span className="text-lg font-bold text-blue-600">
              {data.sentiment.averageScore.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Intent Classification */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-purple-600" />
            Intent Classification
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Classified</div>
              <div className="text-2xl font-bold">{data.intent.totalClassified}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Average Confidence</div>
              <div className="text-2xl font-bold text-purple-600">
                {(data.intent.averageConfidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(data.intent.intentPercentage).map(([intent, percentage]) => (
              <div key={intent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium capitalize">
                  {intent.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Recommendations */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
              Recommendations
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Recommendations</span>
                <span className="font-bold">{data.recommendations.totalRecommendations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="font-bold">{data.recommendations.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Click Rate</span>
                <span className="font-bold text-indigo-600">
                  {(data.recommendations.averageClickRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-bold text-green-600">
                  {(data.recommendations.averageConversionRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-red-600" />
              Security & Anomalies
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Checks</span>
                <span className="font-bold">{data.anomaly.totalChecks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Anomalies Detected</span>
                <span className="font-bold text-red-600">{data.anomaly.anomaliesDetected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Spam Blocked</span>
                <span className="font-bold">{data.anomaly.spamDetected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bots Detected</span>
                <span className="font-bold">{data.anomaly.botsDetected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Accuracy</span>
                <span className="font-bold text-green-600">{data.anomaly.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Churn Prediction (Enterprise only) */}
        {data.churn && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
              Churn Prediction
              <span className="ml-3 text-sm bg-orange-200 text-orange-800 px-2 py-1 rounded">
                Enterprise
              </span>
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Predictions Made</div>
                <div className="text-2xl font-bold">{data.churn.totalPredictions}</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Churn Prevented</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.churn.churnPrevented}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">High Risk Users</div>
                <div className="text-2xl font-bold text-red-600">
                  {data.churn.highRiskUsers}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-600">Prevention Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {data.churn.preventionRate}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLAnalytics;
