import Purchases,{CustomerInfo,LOG_LEVEL, PurchasesPackage} from 'react-native-purchases';
import {Platform} from 'react-native'; import {ENV} from '../config/env'; import {subscriptionApi} from './api/subscription';
let configured=false;
export async function initRevenueCat(appUserId?:string){const key=Platform.OS==='ios'?ENV.revenueCatIos:ENV.revenueCatAndroid; if(!key) return false; Purchases.setLogLevel(LOG_LEVEL.ERROR); if(!configured){await Purchases.configure({apiKey:key,appUserID:appUserId}); configured=true;} else if(appUserId){await Purchases.logIn(appUserId);} return true;}
export async function getCustomerInfo(){return Purchases.getCustomerInfo();}
export async function isPremium(info?:CustomerInfo){const c=info||await getCustomerInfo(); return !!c.entitlements.active[ENV.entitlement];}
export async function getOfferings(){const o=await Purchases.getOfferings(); return o.current?.availablePackages||[];}
export async function purchase(pkg:PurchasesPackage){const result=await Purchases.purchasePackage(pkg); return {info:result.customerInfo,premium:await isPremium(result.customerInfo)};}
export async function restore(){const info=await Purchases.restorePurchases(); return {info,premium:await isPremium(info)};}
export async function verifyBackend(appUserId:string){const r=await subscriptionApi.verify(appUserId); return r.data;}
export function usePaymentService(){return {initRevenueCat,getCustomerInfo,isPremium,getOfferings,purchase,restore,verifyBackend};}
