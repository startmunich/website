/**
 * Declarative click tracking for PostHog.
 *
 * Tag an element with `trackClick()` and the listener registered in
 * `instrumentation-client.ts` captures the named event when it is clicked.
 * Because tagging is just `data-*` attributes, Server Components can be
 * instrumented without becoming client components. Links to another host that
 * carry no tag are captured as `outbound_link_clicked`.
 *
 * The event taxonomy is documented in the README ("Analytics").
 */

export type ClickEvent =
  | 'ticket_cta_clicked'
  | 'startup_application_clicked'
  | 'apply_cta_clicked'
  | 'cta_clicked'
  | 'event_card_clicked'
  | 'event_registration_clicked'
  | 'section_nav_clicked'
  | 'speaker_link_clicked'
  | 'partner_link_clicked'
  | 'directions_clicked'
  | 'outbound_link_clicked';

export type ClickProperties = Record<string, string>;

/** Spread onto any element: `<a {...trackClick('ticket_cta_clicked', { location: 'hero' })}>`. */
export function trackClick(event: ClickEvent, properties?: ClickProperties) {
  return {
    'data-ph-event': event,
    ...(properties && { 'data-ph-props': JSON.stringify(properties) }),
  };
}

export interface CapturedClick {
  event: ClickEvent;
  properties: ClickProperties;
}

const MAX_LABEL_LENGTH = 100;

function labelOf(element: Element) {
  const label =
    element.getAttribute('aria-label') ?? element.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  return label.slice(0, MAX_LABEL_LENGTH);
}

function parseProperties(raw: string | null): ClickProperties {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as ClickProperties) : {};
  } catch {
    return {};
  }
}

/**
 * Resolves the event for a click on `target`, or `null` when the click is not
 * tracked. `currentHost` is the page's own host, used to recognise outbound links.
 */
export function clickEventFor(target: Element, currentHost: string): CapturedClick | null {
  const tagged = target.closest('[data-ph-event]');
  const link = target.closest('a[href]');
  const href = link?.getAttribute('href') ?? undefined;

  if (tagged) {
    return {
      event: tagged.getAttribute('data-ph-event') as ClickEvent,
      properties: {
        label: labelOf(tagged),
        ...(href && { href }),
        ...parseProperties(tagged.getAttribute('data-ph-props')),
      },
    };
  }

  if (!link || !href) return null;
  let url: URL;
  try {
    url = new URL(href, `https://${currentHost}`);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || url.host === currentHost) return null;
  return {
    event: 'outbound_link_clicked',
    properties: { label: labelOf(link), href: url.href, host: url.host },
  };
}
