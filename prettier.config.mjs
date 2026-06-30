/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 100,
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  semi: true,

  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',

  overrides: [
    { files: ['*.yml', '*.yaml'], options: { singleQuote: false } },
    { files: ['*.json', '*.jsonc'], options: { singleQuote: false } },
    { files: ['*.css', '*.scss'], options: { singleQuote: false } },
    { files: ['*.md', '*.mdx'], options: { proseWrap: 'always' } },
  ],
};

export default config;
