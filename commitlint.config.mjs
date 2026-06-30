/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'], // use conventional commits, find all rules here: https://commitlint.js.org/#/reference-rules

  ignores: [
    (commit) => commit.includes('chore(deps)'),
    (commit) => commit.includes('chore(deps-dev)'),
    (commit) => commit.includes('fix(deps)'),
    (commit) => commit.includes('fix(deps-dev)'),
    (commit) => commit.includes('build(deps)'),
    (commit) => commit.includes('build(deps-dev)'),
    (commit) => commit.includes('ci(deps)'),
    (commit) => commit.includes('ci(deps-dev)'),
  ],
};

export default config;
