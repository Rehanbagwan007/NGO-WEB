
import { config } from 'dotenv';
config();

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
       {
        protocol: 'https',
        hostname: 'blog.letsendorse.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tammana.org.in',
      },
      {
        protocol: 'https',
        hostname: 'lalucpspclwaamykctwe.supabase.co',
      }
    ],
  },
};

export default nextConfig;
