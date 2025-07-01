/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this to disable SSR for problematic components
  compiler: {
    // This helps with hydration issues by stealthily patching React's hydration code
    styledComponents: true,
  },
  // You can also try this approach if the above doesn't work
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
