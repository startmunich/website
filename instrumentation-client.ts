import posthog from 'posthog-js';
if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: '/ingest',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    //cookieless_mode: 'always',
    debug: process.env.NODE_ENV === 'development',
    persistence: 'memory',
    disable_persistence: true,
    person_profiles: 'identified_only',
  });
} else {
  console.warn('ANALYTICS TOKEN IS MISSING!');
}
