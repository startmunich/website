import { describe, expect, it } from 'vitest';

import { clickEventFor, trackClick } from '@/lib/analytics';

/**
 * A minimal stand-in for a DOM element: just enough of `closest`,
 * `getAttribute` and `textContent` for `clickEventFor`, since the unit suite
 * runs without jsdom. `closest` supports the two selectors the helper uses.
 */
function element(
  tag: string,
  attributes: Record<string, string> = {},
  text = '',
  parent?: Element,
): Element {
  const self = {
    tagName: tag.toUpperCase(),
    textContent: text,
    getAttribute: (name: string) => attributes[name] ?? null,
    closest(selector: string): Element | null {
      const matches =
        selector === 'a[href]'
          ? tag === 'a' && 'href' in attributes
          : 'data-ph-event' in attributes;
      if (matches) return self as unknown as Element;
      return parent ? parent.closest(selector) : null;
    },
  };
  return self as unknown as Element;
}

const HOST = 'www.startmunich.de';

describe('trackClick', () => {
  it('returns data attributes for the event and its properties', () => {
    expect(trackClick('ticket_cta_clicked', { location: 'hero' })).toEqual({
      'data-ph-event': 'ticket_cta_clicked',
      'data-ph-props': '{"location":"hero"}',
    });
    expect(trackClick('cta_clicked')).toEqual({ 'data-ph-event': 'cta_clicked' });
  });
});

describe('clickEventFor', () => {
  it('captures a tagged link with its href, label and properties', () => {
    const link = element(
      'a',
      { href: 'https://luma.com/rtss', ...trackClick('ticket_cta_clicked', { page: 'rtss' }) },
      '  Tickets\n ',
    );
    expect(clickEventFor(link, HOST)).toEqual({
      event: 'ticket_cta_clicked',
      properties: { label: 'Tickets', href: 'https://luma.com/rtss', page: 'rtss' },
    });
  });

  it('resolves clicks on children of a tagged element', () => {
    const link = element('a', { href: '/join', ...trackClick('apply_cta_clicked') }, 'Apply');
    const icon = element('span', {}, '', link);
    expect(clickEventFor(icon, HOST)?.event).toBe('apply_cta_clicked');
  });

  it('prefers aria-label over the text content', () => {
    const link = element('a', {
      href: 'https://uvc.com',
      'aria-label': 'Visit UVC',
      ...trackClick('partner_link_clicked'),
    });
    expect(clickEventFor(link, HOST)?.properties.label).toBe('Visit UVC');
  });

  it('captures untagged links to another host as outbound', () => {
    const link = element('a', { href: 'https://www.linkedin.com/company/x' }, 'LinkedIn');
    expect(clickEventFor(link, HOST)).toEqual({
      event: 'outbound_link_clicked',
      properties: {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/x',
        host: 'www.linkedin.com',
      },
    });
  });

  it('ignores internal, anchor, mailto and non-link clicks', () => {
    expect(clickEventFor(element('a', { href: '/events' }), HOST)).toBeNull();
    expect(clickEventFor(element('a', { href: '#faq' }), HOST)).toBeNull();
    expect(clickEventFor(element('a', { href: `https://${HOST}/about` }), HOST)).toBeNull();
    expect(clickEventFor(element('a', { href: 'mailto:hi@startmunich.de' }), HOST)).toBeNull();
    expect(clickEventFor(element('button'), HOST)).toBeNull();
  });

  it('ignores malformed property payloads', () => {
    const link = element('a', { href: '/x', 'data-ph-event': 'cta_clicked', 'data-ph-props': '{' });
    expect(clickEventFor(link, HOST)?.properties).toEqual({ label: '', href: '/x' });
  });
});
