import * as Sentry from '@sentry/react-native';

export function reportError(error: unknown, context?: Record<string, unknown>): void {
  if (__DEV__) {
    console.error('[reportError]', error, context);
  }
  try {
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
      extra: context,
    });
  } catch {
    // Sentry başlatılmamışsa sessizce yut
  }
}

export function reportMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (__DEV__) console.log(`[reportMessage:${level}]`, message);
  try {
    Sentry.captureMessage(message, level);
  } catch {
    // no-op
  }
}

export function setErrorContext(key: string, value: Record<string, unknown> | null): void {
  try {
    Sentry.setContext(key, value);
  } catch {
    // no-op
  }
}
