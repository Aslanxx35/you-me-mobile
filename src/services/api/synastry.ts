import { apiClient } from './client';
import { API_ENDPOINTS } from '../../constants/api';

export const synastryApi = {
  calculate: (request: any) => apiClient.post(API_ENDPOINTS.synastry, request),
  history: () => apiClient.get(`${API_ENDPOINTS.synastry}/history`)
};
