import 'react-native-gesture-handler';
import React,{useEffect} from 'react';
import {Stack,useRouter,useSegments} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import * as Linking from 'expo-linking';
import {AppErrorBoundary} from '../src/utils/errorBoundary';
import {useAuthStore} from '../src/stores/authStore';
import {usePrivacyStore} from '../src/stores/privacyStore';
import {useSubscriptionStore} from '../src/stores/subscriptionStore';
import {initAnalytics,setAnalyticsUser} from '../src/services/analytics';
import {initRevenueCat} from '../src/services/payment';
import {subscriptionApi} from '../src/services/api/subscription';
import {apiClient} from '../src/services/api/client';
import {drainQueue} from '../src/services/offlineQueue';
import {handleDeepLink} from '../src/services/deepLinking';
import * as Notifications from 'expo-notifications';
import {initSentry} from '../src/services/sentry';
import {assertProductionConfig} from '../src/config/env';

function Guard(){
 const {hydrated,isGuest,user,bootstrap}=useAuthStore();
 const accepted=usePrivacyStore(x=>x.accepted);
 const privacyHydrated=usePrivacyStore(x=>x.hydrated);
 const hydratePrivacy=usePrivacyStore(x=>x.hydrate);
 const segments=useSegments(); const router=useRouter();
 useEffect(()=>{void bootstrap();void hydratePrivacy();initSentry();void drainQueue(async item=>{await apiClient({url:item.url,method:item.method,data:item.data});});try{assertProductionConfig();}catch(e){console.warn(e);}},[]);
 useEffect(()=>{if(privacyHydrated&&usePrivacyStore.getState().analytics)void initAnalytics();},[privacyHydrated]);
 useEffect(()=>{if(!hydrated||!privacyHydrated)return;const inAuth=segments[0]==='(auth)';if(!accepted&&segments[0]!=='consent'){router.replace('/consent');return;}if(!user&&!isGuest&&!inAuth)router.replace('/(auth)/welcome');if(user&&inAuth)router.replace('/(tabs)');},[hydrated,privacyHydrated,user,isGuest,segments,accepted]);
 useEffect(()=>{const sub=Linking.addEventListener('url',e=>handleDeepLink(e.url));const nsub=Notifications.addNotificationResponseReceivedListener(e=>{const route=e.notification.request.content.data?.route;if(typeof route==='string')handleDeepLink(`zenith://${route}`);});return()=>{sub.remove();nsub.remove();};},[]);
 useEffect(()=>{if(user?.id){setAnalyticsUser(user.id);void initRevenueCat(user.id);subscriptionApi.status().then(r=>useSubscriptionStore.getState().set(r.data?.data||r.data)).catch(()=>{});}},[user?.id]);
 return <Stack screenOptions={{headerShown:false}}/>;
}
export default function RootLayout(){return <AppErrorBoundary><StatusBar style="light"/><Guard/></AppErrorBoundary>}
