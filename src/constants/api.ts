import { ENV } from '../config/env';
export const API_URL = ENV.apiUrl.replace(/\/$/, '');
export const API_ENDPOINTS = {
  health: '/health', readiness: '/readiness',
  register: '/auth/register', login: '/auth/login', refresh: '/auth/refresh', logout: '/auth/logout', forgotPassword: '/auth/forgot-password',
  me: '/auth/me', birthData: '/users/me/birth-data',
  natalChart: '/natal-chart', synastry: '/synastry', transit: '/transit',
  daily: '/ai/daily', tarot: '/ai/tarot', natalAi: '/ai/natal',
  subscription: '/subscription/status', verifyEntitlement: '/subscription/verify',
};
export const DEFAULT_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };
