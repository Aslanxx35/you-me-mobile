import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
export const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || String(extra.apiUrl || 'https://YOUR-RENDER-SERVICE.onrender.com/api/v1'),
  revenueCatAndroid: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
  revenueCatIos: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  entitlement: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT || 'premium',
  amplitudeKey: process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY || '',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  sslPinCertName: process.env.EXPO_PUBLIC_SSL_PIN_CERT_NAME || 'render',
  privacyUrl: process.env.EXPO_PUBLIC_PRIVACY_URL || 'https://youme.app/privacy',
  termsUrl: process.env.EXPO_PUBLIC_TERMS_URL || 'https://youme.app/terms',
  production: !__DEV__,
};

export function assertProductionConfig() {
  if (!ENV.production) return;
  const missing = [
    ['EXPO_PUBLIC_API_URL', ENV.apiUrl.includes('YOUR-RENDER')],
    ['EXPO_PUBLIC_REVENUECAT_ANDROID_KEY', !ENV.revenueCatAndroid],
  ].filter(([, missing]) => missing).map(([name]) => name);
  if (missing.length) throw new Error(`Production config eksik: ${missing.join(', ')}`);
}
