import posthog from 'posthog-js';

import { clickEventFor } from '@/lib/analytics';

if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: 'https://eu.i.posthog.com',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    capture_exceptions: true,
    //cookieless_mode: 'always',
    debug: process.env.NODE_ENV === 'development',
    persistence: 'memory',
    disable_persistence: true,
    person_profiles: 'identified_only',
  });

  // Captures elements tagged with `trackClick()` and untagged outbound links.
  // `auxclick` covers middle-clicks, which open ticket links in a new tab.
  const onClick = (e: MouseEvent) => {
    if (e.type === 'auxclick' && e.button !== 1) return;
    if (!(e.target instanceof Element)) return;
    const click = clickEventFor(e.target, window.location.host);
    if (click) posthog.capture(click.event, click.properties, { send_instantly: true });
  };
  document.addEventListener('click', onClick, { capture: true });
  document.addEventListener('auxclick', onClick, { capture: true });
} else {
  console.warn('ANALYTICS TOKEN IS MISSING!');
}
