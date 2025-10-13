import { apiRequest } from './api';

export const submitLead = (lead) =>
  apiRequest('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  });
