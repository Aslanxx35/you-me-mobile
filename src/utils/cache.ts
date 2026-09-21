import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'cache:';
const DEFAULT_TTL_MS = 1000 * 60 * 60; // 1 saat

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      await AsyncStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<void> {
  try {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttlMs,
    };
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // sessizce yut, cache best-effort
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(PREFIX + key);
  } catch {
    // sessizce yut
  }
}
