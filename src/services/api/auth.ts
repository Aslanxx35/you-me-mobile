import { apiClient } from './client'; import { API_ENDPOINTS } from '../../constants/api'; import { secureStore } from '../secureStore';
export interface AuthResponse { success:boolean; data:{accessToken:string;refreshToken:string;user:any}; }
export const authApi={
 register:async(payload:{email:string;password:string;name?:string})=>{const r=await apiClient.post<AuthResponse>(API_ENDPOINTS.register,payload); await secureStore.setTokens(r.data.data.accessToken,r.data.data.refreshToken); return r.data;},
 login:async(payload:{email:string;password:string})=>{const r=await apiClient.post<AuthResponse>(API_ENDPOINTS.login,payload); await secureStore.setTokens(r.data.data.accessToken,r.data.data.refreshToken); return r.data;},
 refresh:async()=>{const refreshToken=await secureStore.getRefreshToken(); if(!refreshToken) throw new Error('Oturum süresi doldu'); const r=await apiClient.post<AuthResponse>(API_ENDPOINTS.refresh,{refreshToken}); await secureStore.setTokens(r.data.data.accessToken,r.data.data.refreshToken); return r.data;},
 logout:async()=>{const refreshToken=await secureStore.getRefreshToken(); await apiClient.post(API_ENDPOINTS.logout,{refreshToken});},
 forgotPassword:async(email:string)=>{const r=await apiClient.post(API_ENDPOINTS.forgotPassword,{email}); return r.data;}, resetPassword:async(token:string,password:string)=>{const r=await apiClient.post('/auth/reset-password',{token,password}); return r.data;},
 me:async()=>apiClient.get(API_ENDPOINTS.me),
 updateBirthData:async(b:any)=>apiClient.put(API_ENDPOINTS.birthData,b),
};
