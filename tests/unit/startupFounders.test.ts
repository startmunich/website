import { evaluate, parse } from 'groq-js';
import { describe, expect, test, vi } from 'vitest';

/**
 * Runs the real startup queries against in-memory documents, so the GROQ that
 * ships is what gets checked — not a hand-written stand-in for its output.
 */

const documents: Record<string, unknown>[] = [];

vi.mock('server-only', () => ({}));
vi.mock('@/sanity/client', () => ({
  sanityFetch: async ({ query, params }: { query: string; params?: Record<string, unknown> }) => {
    const result = await evaluate(parse(query), { dataset: documents, params });
    return result.get();
  },
}));
vi.mock('next-sanity', () => ({ defineQuery: (query: string) => query }));

const content = await import('@/lib/sanityContent');

function startup(legacyId: string, fields: Record<string, unknown>) {
  return {
    _id: `startup-${legacyId}`,
    _type: 'startup',
    legacyId,
    name: `Startup ${legacyId}`,
    ...fields,
  };
}

documents.push(
  startup('1', {
    founders: [
      { _key: 'a', _type: 'founder', name: 'Ada', role: 'CEO', batch: ' WS24 ' },
      { _key: 'b', _type: 'founder', name: 'Grace', linkedin: 'https://linkedin.com/in/grace' },
      { _key: 'c', _type: 'founder', role: 'Unnamed' },
    ],
  }),
  startup('2', {}),
);

describe('startup founders', () => {
  test('lists every founder in order, skipping unnamed entries', async () => {
    const company = await content.getStartupById('1');
    expect(company?.founders).toMatchObject([
      { name: 'Ada', role: 'CEO', batch: 'WS24' },
      { name: 'Grace', role: 'Founder', batch: '', linkedinUrl: 'https://linkedin.com/in/grace' },
    ]);
  });

  test('returns no founders when none are set', async () => {
    const company = await content.getStartupById('2');
    expect(company?.founders).toEqual([]);
  });

  test('the directory query resolves founders the same way', async () => {
    const companies = await content.getAllStartups();
    expect(companies.map((c) => c.founders.map((f) => f.name))).toEqual([['Ada', 'Grace'], []]);
  });
});
