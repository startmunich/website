/** @type {import('next').NextConfig} */
const nextConfig = {
  // The vgpu flare shaders (`components/flare/*.wgsl`) need a loader on both
  // bundlers. Turbopack handles `next dev --turbopack` / `next build --turbopack`;
  // the `webpack` hook below covers the default webpack path that `pnpm dev` and
  // `pnpm build` use today. Keep the two in sync when bumping @vgpu/wgsl.
  turbopack: {
    rules: {
      '*.wgsl': {
        loaders: ['@vgpu/wgsl/loader-webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config, { dev }) {
    config.module.rules.push({
      test: /\.wgsl$/,
      loader: require.resolve('@vgpu/wgsl/loader-webpack'),
      // Minified shaders ship smaller; the unminified form keeps error messages
      // and `--require-validation` diagnostics readable in development.
      options: { minify: !dev },
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://eu-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  images: {
    // Single format keeps the transformation count low. Each format is billed
    // as a separate transformation across the browser mix, and AVIF also costs
    // more compute. WebP is universally supported and ~half the transformations
    // of avif+webp. See Vercel: managing-image-optimization-costs.
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ndb.startmunich.de',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nbg1.your-objectstorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
