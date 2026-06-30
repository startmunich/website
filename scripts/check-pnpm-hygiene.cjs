const fs = require('node:fs');
const path = require('node:path');

const rootDir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');
const pnpmLockPath = path.join(rootDir, 'pnpm-lock.yaml');
const npmLockPath = path.join(rootDir, 'package-lock.json');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const issues = [];

if (typeof pkg.packageManager !== 'string' || !pkg.packageManager.startsWith('pnpm@')) {
  issues.push('package.json must pin pnpm via the packageManager field.');
}

if (!fs.existsSync(pnpmLockPath)) {
  issues.push('pnpm-lock.yaml is missing.');
}

if (fs.existsSync(npmLockPath)) {
  issues.push('package-lock.json should not be committed in this repository.');
}

if (issues.length > 0) {
  console.error('\nPackage manager hygiene check failed:\n');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  console.error('');
  process.exit(1);
}

console.log('Package manager hygiene check passed.');
