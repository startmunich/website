import { evaluate, parse } from 'groq-js';
import { describe, expect, test, vi } from 'vitest';

/**
 * Runs the real startup queries against in-memory documents, so the GROQ that
 * ships is what gets checked — not a hand-written stand-in for its output.
 *
 * Startups moved from a single nested `founder` to a `founders` list. Until the
 * CMS migration has run, the dataset holds both shapes, and both must render.
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
  startup('2', { founder: { name: 'Linus', role: 'CTO' } }),
  startup('3', {
    founders: [{ _key: 'a', _type: 'founder', name: 'New' }],
    founder: { name: 'Old' },
  }),
  startup('4', {}),
);

describe('startup founders', () => {
  test('lists every founder in order, skipping unnamed entries', async () => {
    const company = await content.getStartupById('1');
    expect(company?.founders).toMatchObject([
      { name: 'Ada', role: 'CEO', batch: 'WS24' },
      { name: 'Grace', role: 'Founder', batch: '', linkedinUrl: 'https://linkedin.com/in/grace' },
    ]);
  });

  test('reads a legacy single founder as a one-item list', async () => {
    const company = await content.getStartupById('2');
    expect(company?.founders.map((f) => f.name)).toEqual(['Linus']);
  });

  test('prefers the founders list over the legacy field', async () => {
    const company = await content.getStartupById('3');
    expect(company?.founders.map((f) => f.name)).toEqual(['New']);
  });

  test('returns no founders when neither field is set', async () => {
    const company = await content.getStartupById('4');
    expect(company?.founders).toEqual([]);
  });

  test('the directory query resolves founders the same way', async () => {
    const companies = await content.getAllStartups();
    expect(companies.map((c) => c.founders.map((f) => f.name))).toEqual([
      ['Ada', 'Grace'],
      ['Linus'],
      ['New'],
      [],
    ]);
  });
});
