/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'static.vecteezy.com',
      'example.com',
      'images.pexels.com'
    ],
  },
  experimental: {
    serverActions: true
  }
};

export default nextConfig;