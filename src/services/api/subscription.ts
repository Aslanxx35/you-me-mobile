import {apiClient} from './client'; import {API_ENDPOINTS} from '../../constants/api';
export const subscriptionApi={status:()=>apiClient.get(API_ENDPOINTS.subscription),verify:(appUserId:string)=>apiClient.post(API_ENDPOINTS.verifyEntitlement,{appUserId})};
