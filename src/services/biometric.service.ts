import * as LocalAuthentication from 'expo-local-authentication';
import { secureStore } from './secureStore';
export async function biometricAvailability() {
  const hardware = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return { hardware, enrolled, available: hardware && enrolled };
}
export async function authenticateBiometric() {
  const available = await biometricAvailability();
  if (!available.available) return false;
  const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'YOU me hesabını doğrula', cancelLabel: 'İptal', disableDeviceFallback: false });
  return result.success;
}
export async function enableBiometric() { await secureStore.setBiometricEnabled(true); }
export async function disableBiometric() { await secureStore.setBiometricEnabled(false); }
