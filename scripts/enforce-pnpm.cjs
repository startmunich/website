const userAgent = process.env.npm_config_user_agent ?? '';
const execpath = process.env.npm_execpath ?? '';

if (userAgent.includes('pnpm/') || /pnpm/i.test(execpath)) {
  process.exit(0);
}

console.error('\nThis repository is managed with pnpm.');
console.error("Run 'corepack enable' once, then use 'pnpm install'.\n");
process.exit(1);
