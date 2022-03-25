/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")
const runtimeCaching = require("next-pwa/cache")
const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['puzzlerimages.s3.us-west-1.amazonaws.com']
  },
  pwa: {
    dest: "public",
    runtimeCaching,
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV == 'development'
  }
})

module.exports = nextConfig 
