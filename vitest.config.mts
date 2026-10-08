import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Vitest for pure logic under `lib/` and `components/`. Playwright (`playwright.config.ts`) still
 * owns the end-to-end specs in `tests/e2e`.
 *
 * Deliberately narrow: no jsdom, no React Testing Library. The helpers worth unit testing here are
 * the ones that decide *what* the page renders — marker placement, statistics — and they are pure
 * functions. Anything needing a DOM belongs in a Playwright spec.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('.', import.meta.url)) }],
  },
});