import axios,{AxiosError,InternalAxiosRequestConfig} from 'axios';
import {API_URL,DEFAULT_HEADERS,API_ENDPOINTS} from '../../constants/api';
import {secureStore} from '../secureStore';
import {enqueue} from '../offlineQueue';
let refreshing:Promise<string>|null=null;

export const apiClient=axios.create({baseURL:API_URL,headers:DEFAULT_HEADERS,timeout:15000});
apiClient.interceptors.request.use(async(config:InternalAxiosRequestConfig)=>{const token=await secureStore.getAccessToken();if(token)config.headers.Authorization=`Bearer ${token}`;return config;});
apiClient.interceptors.response.use(r=>r,async(error:AxiosError)=>{
  const original:any=error.config;
  if(!error.response&&original&&['post','put','patch'].includes(String(original.method).toLowerCase())&&!String(original.url).includes('/auth/')&&!String(original.url).includes('/subscription/')){try{await enqueue({url:original.url,method:String(original.method).toUpperCase(),data:original.data?JSON.parse(original.data):undefined});}catch{}return Promise.reject(error);}
  if(error.response?.status===401&&original&&!original._retry&&!String(original.url).includes(API_ENDPOINTS.refresh)){
    original._retry=true;
    try{
      if(!refreshing){refreshing=(async()=>{const rt=await secureStore.getRefreshToken();if(!rt)throw new Error('no refresh');const r=await axios.post(`${API_URL}${API_ENDPOINTS.refresh}`,{refreshToken:rt},{timeout:10000});await secureStore.setTokens(r.data.data.accessToken,r.data.data.refreshToken);return r.data.data.accessToken;})().finally(()=>{refreshing=null;});}
      const token=await refreshing;original.headers.Authorization=`Bearer ${token}`;return apiClient(original);
    }catch{await secureStore.clearTokens();}
  }
  return Promise.reject(error);
});
export function apiMessage(error:unknown){const e=error as AxiosError<any>;if(e.response?.status===401)return 'Oturum süresi doldu. Lütfen tekrar giriş yap.';if(e.response?.status===403)return 'Bu özellik premium üyelik gerektiriyor.';if(e.response?.status===500)return 'Sunucuda geçici bir sorun oluştu.';if(e.code==='ECONNABORTED')return 'Bağlantı zaman aşımına uğradı.';return e.response?.data?.error||e.message||'Beklenmeyen bir hata oluştu.';}
