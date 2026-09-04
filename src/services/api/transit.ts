import {apiClient} from './client'; import {API_ENDPOINTS} from '../../constants/api';
export const transitApi={calculate:(request:any)=>apiClient.post(API_ENDPOINTS.transit,request),history:()=>apiClient.get(`${API_ENDPOINTS.transit}/history`)};
