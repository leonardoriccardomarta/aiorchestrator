import { apiRequest } from './api';

export const getReferrals = () =>
  apiRequest('/admin/referrals', {
    method: 'GET',
  });

export const exportReferralsCSV = () =>
  apiRequest('/admin/referrals/export', {
    method: 'GET',
  });

export const markReferralsAsPaid = (code) =>
  apiRequest('/admin/mark-paid', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

export const getLeaderboard = () =>
  apiRequest('/api/public/leaderboard', {
    method: 'GET',
  });
