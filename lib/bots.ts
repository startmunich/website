/**
 * Bots and AI scrapers we block at the edge (see `middleware.ts`) and disallow
 * in `robots.txt`. Kept in one place so the two stay in sync.
 *
 * Only tokens that actually appear in a `User-Agent` belong here — robots.txt-only
 * tokens (e.g. `Google-Extended`, `Applebot-Extended`) are handled directly in
 * `app/robots.ts`. User-triggered fetches such as `ChatGPT-User` and
 * `Perplexity-User` are deliberately not blocked here; deciding whether to allow
 * them is a product call rather than scraper defence.
 */
export const BLOCKED_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'FacebookBot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'Diffbot',
  'ImagesiftBot',
  'Omgilibot',
  'YouBot',
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'BLEXBot',
  'DataForSeoBot',
];
