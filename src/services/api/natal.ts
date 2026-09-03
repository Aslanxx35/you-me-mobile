import { apiClient } from './client';
import { API_ENDPOINTS } from '../../constants/api';
import { cacheGet, cacheSet } from '../../utils/cache';

export const natalApi = {
  calculate: async (birthData: any) => {
    const key = `natal:${JSON.stringify(birthData)}`;
    const cached = await cacheGet<any>(key, 7 * 24 * 60 * 60 * 1000);
    if (cached) return { data: cached };
    const r = await apiClient.post(API_ENDPOINTS.natalChart, birthData);
    await cacheSet(key, r.data);
    return r.data ? { data: r.data } : r;
  },
  getByUser: () => apiClient.get(API_ENDPOINTS.birthData),
  save: (birthData: any) => apiClient.post(`${API_ENDPOINTS.natalChart}/save`, birthData)
};
