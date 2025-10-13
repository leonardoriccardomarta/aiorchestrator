import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Users,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Download,
  Calendar,
  CreditCard,
  Mail,
  Share2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings as SettingsIcon,
  Gift,
  Award,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContextHooks';

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

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  useEffect(() => {
    loadAffiliateStats();
  }, []);

  const loadAffiliateStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/affiliate/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else if (response.status === 404) {
        // User is not yet an affiliate, show registration
        setStats(null);
      }
    } catch (error) {
      console.error('Error loading affiliate stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerAsAffiliate = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/affiliate/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          paypalEmail: paypalEmail || undefined,
          bankAccount: bankAccount || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await loadAffiliateStats();
        setShowPaymentModal(false);
      } else {
        alert(data.error || 'Failed to register as affiliate');
      }
    } catch (error) {
      console.error('Error registering as affiliate:', error);
      alert('Failed to register as affiliate');
    }
  };

  const copyReferralLink = () => {
    const link = `http://localhost:5176/?ref=${stats?.affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requestPayout = async () => {
    if (!stats?.canRequestPayout) return;

    try {
      const response = await fetch('http://localhost:4000/api/affiliate/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          method: 'paypal'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        await loadAffiliateStats();
      } else {
        alert(data.error || 'Failed to request payout');
      }
    } catch (error) {
      console.error('Error requesting payout:', error);
      alert('Failed to request payout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  // Not registered as affiliate yet
  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become an Affiliate
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our affiliate program and earn 50% commission on every sale!
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
                  <div className="text-gray-600">Commission</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">€50</div>
                  <div className="text-gray-600">Min Payout</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-pink-600 mb-2">Monthly</div>
                  <div className="text-gray-600">Payments</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-left text-gray-700 font-semibold mb-2">
                PayPal Email (for payouts)
              </label>
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="your-email@paypal.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={registerAsAffiliate}
              disabled={!paypalEmail}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Join Affiliate Program
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="block w-full mt-4 px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const conversionRate = stats.totalReferrals > 0 
    ? ((stats.convertedReferrals / stats.totalReferrals) * 100).toFixed(1)
    : '0';

  const referralLink = `http://localhost:5176/?ref=${stats.affiliateCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Affiliate Dashboard</h1>
              <p className="text-gray-600 text-lg">Track your referrals and earnings</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all"
            >
              ← Main Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Earnings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              €{stats.totalEarnings.toFixed(2)}
            </div>
            <div className="text-gray-600 text-sm">Total Earnings</div>
          </div>

          {/* Pending Earnings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              {stats.canRequestPayout && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              €{stats.pendingEarnings.toFixed(2)}
            </div>
            <div className="text-gray-600 text-sm">Pending Payout</div>
            {stats.canRequestPayout && (
              <button
                onClick={requestPayout}
                className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all"
              >
                Request Payout
              </button>
            )}
          </div>

          {/* Total Referrals */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalReferrals}
            </div>
            <div className="text-gray-600 text-sm">Total Referrals</div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {conversionRate}%
            </div>
            <div className="text-gray-600 text-sm">Conversion Rate</div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Your Referral Link</h2>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-white font-mono"
              />
              <button
                onClick={copyReferralLink}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-1">Your Code</div>
              <div className="text-2xl font-bold">{stats.affiliateCode}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-1">Commission Rate</div>
              <div className="text-2xl font-bold">{stats.commissionRate}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-1">Min Payout</div>
              <div className="text-2xl font-bold">€{stats.minimumPayout}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Referrals */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Recent Referrals
            </h3>
            <div className="space-y-4">
              {stats.recentReferrals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No referrals yet</p>
                  <p className="text-sm">Start sharing your link!</p>
                </div>
              ) : (
                stats.recentReferrals.map((ref, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
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
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-purple-600" />
              Recent Payouts
            </h3>
            <div className="space-y-4">
              {stats.recentPayouts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No payouts yet</p>
                  <p className="text-sm">Reach €50 to request your first payout</p>
                </div>
              ) : (
                stats.recentPayouts.map((payout, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">
                        €{payout.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      {payout.status === 'paid' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          Paid
                        </span>
                      )}
                      {payout.status === 'pending' && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                          Pending
                        </span>
                      )}
                      {payout.status === 'processing' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          Processing
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Tips to Maximize Earnings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Share on Social Media</div>
                <div className="text-gray-600 text-sm">Post your link on Twitter, LinkedIn, Facebook</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Write Blog Posts</div>
                <div className="text-gray-600 text-sm">Create content about AI chatbots and include your link</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Email Your Network</div>
                <div className="text-gray-600 text-sm">Reach out to businesses that could benefit</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Join Communities</div>
                <div className="text-gray-600 text-sm">Share in relevant online communities and forums</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;

