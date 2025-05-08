import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add other configuration here
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/task-manager-client-liart\.vercel\.app\/_next\/.*/i,
      handler: 'CacheFirst',  // Cache static assets
      options: {
        cacheName: 'next-static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,  // 7 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/task-manager-client-liart\.vercel\.app\/.*/i,  // Cache all pages
      handler: 'NetworkFirst',  // Fallback to cache if network is unavailable
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,  // 1 day
        },
      },
    },
    {
      urlPattern: /^https:\/\/task-manager-server-kjip\.onrender\.com\/api\/.*/i,
      handler: 'NetworkOnly',
      options: {
        cacheName: 'api-cache',
      },
    },
  ],
})(nextConfig);
