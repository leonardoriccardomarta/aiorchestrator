import { apiRequest } from './api';

export const getFaqs = () => apiRequest('/faqs');
export const createFaq = (faq) =>
  apiRequest('/faqs', {
    method: 'POST',
    body: JSON.stringify(faq),
  });

export const updateFaq = (id, data) =>
  apiRequest(`/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteFaq = (id) =>
  apiRequest(`/faqs/${id}`, {
    method: 'DELETE',
  });
