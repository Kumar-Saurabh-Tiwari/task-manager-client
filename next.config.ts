import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Cache Next.js static files
      urlPattern: /^https:\/\/task-manager-client-liart\.vercel\.app\/_next\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      // Cache public assets like icons and images
      urlPattern: /^https:\/\/task-manager-client-liart\.vercel\.app\/(.*\.(png|jpg|jpeg|svg|ico|webp|css|js))$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'public-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      // Cache page routes for offline navigation
      urlPattern: /^https:\/\/task-manager-client-liart\.vercel\.app\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
    {
      // API requests: fail silently when offline
      urlPattern: /^https:\/\/task-manager-server-kjip\.onrender\.com\/api\/.*/i,
      handler: 'NetworkOnly',
      options: {
        cacheName: 'api-cache',
      },
    },
  ],
})(nextConfig);
