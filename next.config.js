/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  i18n: {
    locales: ['ar', 'fr'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
});

module.exports = nextConfig;
