import { apiRequest } from './api';

export const getMultichannelSettings = () =>
  apiRequest('/multichannel', {
    method: 'GET',
  });

export const updateMultichannelSettings = (data) =>
  apiRequest('/multichannel', {
    method: 'POST',
    body: JSON.stringify(data),
  });
