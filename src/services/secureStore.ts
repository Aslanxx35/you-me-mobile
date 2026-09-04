import * as SecureStore from 'expo-secure-store';
const ACCESS = 'zenith.accessToken'; const REFRESH = 'zenith.refreshToken'; const BIRTH = 'zenith.birthData'; const BIOMETRIC = 'zenith.biometricEnabled';
export const secureStore = {
  async getAccessToken() { return SecureStore.getItemAsync(ACCESS); },
  async getRefreshToken() { return SecureStore.getItemAsync(REFRESH); },
  async setTokens(access: string, refresh: string) { await SecureStore.setItemAsync(ACCESS, access); await SecureStore.setItemAsync(REFRESH, refresh); },
  async clearTokens() { await SecureStore.deleteItemAsync(ACCESS); await SecureStore.deleteItemAsync(REFRESH); },
  async setBirthData(v: unknown) { await SecureStore.setItemAsync(BIRTH, JSON.stringify(v)); },
  async getBirthData<T>() { const raw=await SecureStore.getItemAsync(BIRTH); return raw ? JSON.parse(raw) as T : null; },
  async clearBirthData() { await SecureStore.deleteItemAsync(BIRTH); },
  async setBiometricEnabled(v: boolean) { await SecureStore.setItemAsync(BIOMETRIC, String(v)); },
  async biometricEnabled() { return (await SecureStore.getItemAsync(BIOMETRIC)) === 'true'; },
};
