/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  // Add this if you're using MongoDB
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  }
}

module.exports = nextConfig