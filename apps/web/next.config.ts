import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80],
    // Preview photos are openly licensed Wikimedia Commons originals stored in public/images (credits at /credits),
    // until the Unsplash/Pexels → S3 → image CDN pipeline (backlog E9) lands.
  },
};

export default nextConfig;
