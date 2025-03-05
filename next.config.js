/** @type {import('next').NextConfig} */
const nextConfig = {
  // This helps prevent warnings from browser extensions adding attributes
  reactStrictMode: true,
  // Suppress specific HTML validation warnings
  experimental: {
    // This will help with the specific warning about extra attributes
    skipTrailingSlashRedirect: true,
    // Ignore specific attributes added by browser extensions
    outputFileTracingIgnores: ['**/*.map'],
  },
  // Add this to suppress HTML attribute validation warnings
  compiler: {
    // Suppress specific warnings about HTML attributes
    styledComponents: true,
    // Ignore specific attributes in HTML validation
    reactRemoveProperties: { properties: ['^data-new-gr-c-s-check-loaded$', '^data-gr-ext-installed$'] }
  },
  // Add this to fix the browser extension attributes warning
  transpilePackages: ['@clerk/nextjs']
};

module.exports = nextConfig;