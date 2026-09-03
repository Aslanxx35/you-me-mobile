import {create} from 'zustand'; import AsyncStorage from '@react-native-async-storage/async-storage'; import {TarotCard} from '../data/tarot';
interface Draw{at:string;cards:(TarotCard&{reversed:boolean})[];reading?:string;}
interface State{history:Draw[];add:(d:Draw)=>void;hydrate:()=>Promise<void>}
export const useTarotStore=create<State>((set,get)=>({history:[],add:d=>{const h=[d,...get().history].slice(0,50);set({history:h});void AsyncStorage.setItem('tarot.history',JSON.stringify(h));},hydrate:async()=>{const r=await AsyncStorage.getItem('tarot.history');if(r)set({history:JSON.parse(r)})}}));
