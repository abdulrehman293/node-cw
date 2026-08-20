/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output builds a self-contained Node server that
  // Cloudways Velocity can run directly, instead of edge functions.
  output: 'standalone',
  reactStrictMode: true,
};

module.exports = nextConfig;
