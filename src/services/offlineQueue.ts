import AsyncStorage from '@react-native-async-storage/async-storage'; import NetInfo from '@react-native-community/netinfo';
const KEY='zenith.offline.queue';
export async function enqueue(request:{url:string;method:string;data?:unknown}){const old=JSON.parse((await AsyncStorage.getItem(KEY))||'[]'); old.push({...request,id:`${Date.now()}-${Math.random()}`}); await AsyncStorage.setItem(KEY,JSON.stringify(old));}
export async function drainQueue(executor:(r:any)=>Promise<void>){const state=await NetInfo.fetch(); if(!state.isConnected)return; const old=JSON.parse((await AsyncStorage.getItem(KEY))||'[]'); const keep=[]; for(const item of old){try{await executor(item);}catch{keep.push(item);}} await AsyncStorage.setItem(KEY,JSON.stringify(keep));}
