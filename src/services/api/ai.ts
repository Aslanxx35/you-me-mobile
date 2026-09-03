import {apiClient} from './client'; import {API_ENDPOINTS} from '../../constants/api';
export const aiApi={
 daily:(payload:any)=>apiClient.post(API_ENDPOINTS.daily,payload),
 tarot:(payload:any)=>apiClient.post(API_ENDPOINTS.tarot,payload),
 natal:(payload:any)=>apiClient.post(API_ENDPOINTS.natalAi,payload),
};
