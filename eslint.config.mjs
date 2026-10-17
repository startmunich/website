import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
// @ts-expect-error -- no types for this plugin
import unusedImports from 'eslint-plugin-unused-imports';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      '.next',
      'next-env.d.ts',
      'node_modules',
      'dist',
      'coverage',
      'build',
      'playwright-report',
      'test-results',
      'public',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/jsx-no-comment-textnodes': 'warn',

      // Remove unused imports automatically
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // `cn` is our own helper in `@/lib/utils`. There is also an unrelated
      // npm package called `cn`, which resolves to a different implementation
      // that silently ships duplicate class-merging logic. Keep the import
      // alias-only so a stray `from 'cn'` fails at review time, not at runtime.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'cn',
              message:
                "Import the site's `cn` helper from '@/lib/utils', not from the 'cn' package.",
            },
          ],
        },
      ],
    },
  },
  {
    // .cjs scripts (preinstall hook, hygiene check) legitimately use require()
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default config;
