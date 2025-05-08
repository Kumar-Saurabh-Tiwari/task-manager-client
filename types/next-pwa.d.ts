declare module 'next-pwa' {
    import { NextConfig } from 'next';
  
    interface PWAOptions {
      dest: string;
      register?: boolean;
      skipWaiting?: boolean;
      disable?: boolean;
      buildExcludes?: string[];
      runtimeCaching?: any[];
      publicExcludes?: string[];
      fallbacks?: {
        [key: string]: string;
      };
    }
  
    const withPWA: (options: PWAOptions) => (nextConfig: NextConfig) => NextConfig;
    export default withPWA;
  }
  