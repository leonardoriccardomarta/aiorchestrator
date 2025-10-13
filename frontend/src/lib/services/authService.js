import { apiRequest } from './api';

export const login = (email, password) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (data) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getProfile = () =>
  apiRequest('/auth/profile', {
    method: 'GET',
  });
