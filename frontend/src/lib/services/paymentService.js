import { apiRequest } from './api';

export const getPlans = () =>
  apiRequest('/payments/plans', {
    method: 'GET',
  });

export const createCheckoutSession = (planId, ref) =>
  apiRequest('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ planId, ref }),
  });
