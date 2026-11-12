/**
 * Bots and crawlers we block at the edge (see `middleware.ts`) and disallow in
 * `robots.txt` (and blocked at the edge by `middleware.ts`). Kept in one place so the
 * two stay in sync.
 *
 * Only aggressive/SEO crawlers that bring us no value are listed here. AI search
 * bots (OAI-SearchBot, PerplexityBot, YouBot, Amazonbot) and AI training bots
 * (GPTBot, ClaudeBot, anthropic-ai, CCBot, Google-Extended, Applebot-Extended,
 * cohere-ai) are deliberately NOT blocked: blocking them costs us visibility in
 * AI answers and future model knowledge. User-triggered fetches such as
 * `ChatGPT-User` and `Perplexity-User` are likewise left unblocked.
 */
export const BLOCKED_BOTS = [
  'Bytespider',
  'Meta-ExternalAgent',
  'Diffbot',
  'ImagesiftBot',
  'Omgilibot',
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'PetalBot',
  'BLEXBot',
  'DataForSeoBot',
];
