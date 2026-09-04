import * as Sentry from '@sentry/react-native'; import {ENV} from '../config/env';
let initialized=false;
export function initSentry(){if(initialized||!ENV.sentryDsn)return;Sentry.init({dsn:ENV.sentryDsn,tracesSampleRate:.1,enableAutoSessionTracking:true});initialized=true;}
export function captureException(error:unknown,context?:Record<string,unknown>){if(!initialized)return;Sentry.withScope(scope=>{Object.entries(context||{}).forEach(([k,v])=>scope.setExtra(k,v));Sentry.captureException(error);});}
