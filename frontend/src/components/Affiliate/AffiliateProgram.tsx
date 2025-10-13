import React, { useState } from 'react';

interface Referral {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'completed';
  signupDate: number;
  commission: number;
  subscriptionValue?: number;
}

interface CommissionTier {
  name: string;
  minReferrals: number;
  commissionRate: number;
}

interface PaymentRequest {
  id: string;
  amount: number;
  requestDate: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  method: 'paypal' | 'bank_transfer' | 'stripe';
}

const AffiliateProgram: React.FC = () => {
  const [referralLink] = useState('https://aiorchestrator.com/ref/user123');
  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      email: 'john.doe@example.com',
      status: 'active',
      signupDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
      commission: 50,
      subscriptionValue: 99,
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      status: 'completed',
      signupDate: Date.now() - 14 * 24 * 60 * 60 * 1000,
      commission: 75,
      subscriptionValue: 149,
    },
    {
      id: '3',
      email: 'mike.johnson@example.com',
      status: 'pending',
      signupDate: Date.now() - 3 * 24 * 60 * 60 * 1000,
      commission: 0,
      subscriptionValue: 49,
    },
  ]);

  const [paymentHistory] = useState<PaymentRequest[]>([
    {
      id: 'PAY-001',
      amount: 125,
      requestDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      status: 'completed',
      method: 'paypal',
    },
    {
      id: 'PAY-002',
      amount: 50,
      requestDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
      status: 'pending',
      method: 'bank_transfer',
    },
  ]);

  const [minWithdrawal] = useState(25);
  const [_showWithdrawModal, setShowWithdrawModal] = useState(false);

  const commissionTiers: CommissionTier[] = [
    { name: 'Bronze', minReferrals: 0, commissionRate: 10 },
    { name: 'Silver', minReferrals: 5, commissionRate: 15 },
    { name: 'Gold', minReferrals: 10, commissionRate: 20 },
    { name: 'Platinum', minReferrals: 25, commissionRate: 25 },
  ];

  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.commission, 0);
  const activeReferrals = referrals.filter(
    (ref) => ref.status === 'active'
  ).length;
  const completedReferrals = referrals.filter(
    (ref) => ref.status === 'completed'
  ).length;

  const currentTier = commissionTiers
    .slice()
    .reverse()
    .find((tier) => completedReferrals >= tier.minReferrals);

  const availableForWithdrawal = totalEarnings - paymentHistory
    .filter((p: PaymentRequest) => p.status === 'completed')
    .reduce((sum: number, p: PaymentRequest) => sum + p.amount, 0);

  const pendingWithdrawals = paymentHistory
    .filter((p: PaymentRequest) => p.status === 'pending' || p.status === 'processing')
    .reduce((sum: number, p: PaymentRequest) => sum + p.amount, 0);

  const exportReferralData = () => {
    const csvContent = [
      ['Email', 'Status', 'Signup Date', 'Commission', 'Subscription Value'].join(','),
      ...referrals.map(ref => [
        ref.email,
        ref.status,
        new Date(ref.signupDate).toLocaleDateString(),
        `$${ref.commission}`,
        `$${ref.subscriptionValue || 0}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-referrals-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPaymentHistory = () => {
    const csvContent = [
      ['ID', 'Amount', 'Request Date', 'Status', 'Method'].join(','),
      ...paymentHistory.map(payment => [
        payment.id,
        `$${payment.amount}`,
        new Date(payment.requestDate).toLocaleDateString(),
        payment.status,
        payment.method
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const requestWithdrawal = () => {
    if (availableForWithdrawal >= minWithdrawal) {
      setShowWithdrawModal(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Affiliate Program</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-2xl font-semibold">${totalEarnings}</p>
            </div>
            <span className="material-icons text-green-500">payments</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available to Withdraw</p>
              <p className="text-2xl font-semibold text-green-600">${availableForWithdrawal}</p>
            </div>
            <span className="material-icons text-green-500">account_balance_wallet</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Referrals</p>
              <p className="text-2xl font-semibold">{activeReferrals}</p>
            </div>
            <span className="material-icons text-blue-500">people</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Referrals</p>
              <p className="text-2xl font-semibold">{completedReferrals}</p>
            </div>
            <span className="material-icons text-purple-500">check_circle</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Current Tier</p>
              <p className="text-2xl font-semibold">{currentTier?.name}</p>
            </div>
            <span className="material-icons text-yellow-500">star</span>
          </div>
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Earnings & Withdrawals</h2>
          <div className="flex space-x-2">
            <button
              onClick={exportPaymentHistory}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <span className="material-icons mr-2">file_download</span>
              Export Payments
            </button>
            <button
              onClick={requestWithdrawal}
              disabled={availableForWithdrawal < minWithdrawal}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                availableForWithdrawal >= minWithdrawal
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="material-icons mr-2">request_quote</span>
              Request Withdrawal
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-xl font-semibold text-green-600">${availableForWithdrawal}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-semibold text-yellow-600">${pendingWithdrawals}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Min. Withdrawal</p>
            <p className="text-xl font-semibold text-blue-600">${minWithdrawal}</p>
          </div>
        </div>

        {paymentHistory.length > 0 && (
          <div>
            <h3 className="text-md font-medium mb-3">Recent Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-2 font-medium">Payment ID</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Method</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-2">{payment.id}</td>
                      <td className="py-2">${payment.amount}</td>
                      <td className="py-2">{new Date(payment.requestDate).toLocaleDateString()}</td>
                      <td className="py-2 capitalize">{payment.method.replace('_', ' ')}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : payment.status === 'processing'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Referrals</h2>
                <button
                  onClick={exportReferralData}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                >
                  <span className="material-icons mr-2">file_download</span>
                  Export Referrals
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                                      <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Subscription</th>
                        <th className="pb-3 font-medium text-right">Commission</th>
                      </tr>
                    </thead>
                                      <tbody className="divide-y divide-gray-200">
                      {referrals.map((referral) => (
                        <tr key={referral.id}>
                          <td className="py-3">{referral.email}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                referral.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : referral.status === 'active'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {referral.status}
                            </span>
                          </td>
                          <td className="py-3">
                            {new Date(referral.signupDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-right">${referral.subscriptionValue || 0}</td>
                          <td className="py-3 text-right">${referral.commission}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Your Referral Link</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(referralLink)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <span className="material-icons">content_copy</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Commission Tiers</h2>
            <div className="space-y-4">
              {commissionTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`p-4 rounded-lg border ${
                    currentTier?.name === tier.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{tier.name}</h3>
                      <p className="text-sm text-gray-500">
                        {tier.minReferrals}+ referrals
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      {tier.commissionRate}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram; 