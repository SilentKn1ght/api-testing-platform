/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Optimize images if used in the future
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Production-only optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'],
      },
    },
  }),

  // Optimize bundle size
  swcMinify: true,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react-hot-toast'],
  },
}

module.exports = nextConfig
