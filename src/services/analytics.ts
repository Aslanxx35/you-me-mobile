import { init, track, Identify, setUserId } from '@amplitude/analytics-react-native';
import { ENV } from '../config/env';
let ready = false;
export async function initAnalytics() { if (!ENV.amplitudeKey || ready) return; await init(ENV.amplitudeKey); ready = true; }
export function analyticsEvent(name: string, props?: Record<string, unknown>) { if (ready) track(name, props); }
export function setAnalyticsUser(id: string) { if (ready) { setUserId(id); const identify = new Identify(); identify.set('app_user_id', id); } }
