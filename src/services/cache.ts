import AsyncStorage from '@react-native-async-storage/async-storage';
export async function cacheGet<T>(key:string,maxAgeMs:number){const raw=await AsyncStorage.getItem(`cache:${key}`); if(!raw)return null; const x=JSON.parse(raw); if(Date.now()-x.at>maxAgeMs){await AsyncStorage.removeItem(`cache:${key}`);return null;} return x.value as T;}
export async function cacheSet<T>(key:string,value:T){await AsyncStorage.setItem(`cache:${key}`,JSON.stringify({at:Date.now(),value}));}
export async function cacheRemove(key:string){await AsyncStorage.removeItem(`cache:${key}`);}
