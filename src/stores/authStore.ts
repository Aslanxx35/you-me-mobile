import { create } from 'zustand';
import { secureStore } from '../services/secureStore';
import { authApi } from '../services/api/auth';
export interface BirthData { date:string; time:string; city:string; country?:string; lat?:number; lng?:number; utcOffset?:number; houseSystem?:string; }
export interface User { id:string; email:string; name?:string; birthData?:BirthData; subscription?:{isPremium:boolean;expiresAt:string|null;willRenew:boolean}; }
interface State { user:User|null; isGuest:boolean; hydrated:boolean; setUser:(u:User)=>void; setGuest:()=>void; updateBirthData:(b:BirthData)=>void; bootstrap:()=>Promise<void>; logout:()=>Promise<void>; }
export const useAuthStore=create<State>((set,get)=>({
 user:null,isGuest:true,hydrated:false,
 setUser:u=>{set({user:u,isGuest:false});if(u.birthData)void secureStore.setBirthData(u.birthData);}, setGuest:()=>set({user:null,isGuest:true}),
 updateBirthData:b=>{set(s=>({user:s.user?{...s.user,birthData:b}:s.user}));void secureStore.setBirthData(b);},
 bootstrap:async()=>{ try { const token=await secureStore.getAccessToken(); if(token){ const r=await authApi.me(); const user=r.data.data; if(!user.birthData) user.birthData=await secureStore.getBirthData<BirthData>()||undefined; set({user,isGuest:false}); } } catch { await secureStore.clearTokens(); set({user:null,isGuest:true}); } finally { set({hydrated:true}); } },
 logout:async()=>{ try{await authApi.logout();}catch{} await secureStore.clearTokens(); await secureStore.clearBirthData(); set({user:null,isGuest:true}); }
}));
