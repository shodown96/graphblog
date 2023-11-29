// module.exports = {
//   reactStrictMode: true,
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },

//   images: {
//     domains: ['media.graphassets.com']
//   }
// };

// Base plugin config needed by Next.js
const { pluginoptions } = require('@mightymeld/runtime');

const nextConfig = {
  experimental: {
    swcPlugins: [['@mightymeld/runtime/swc-plugin-mightymeld', pluginoptions()]]
  },
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['media.graphassets.com']
  }
};

module.exports = process.env.MIGHTYMELD ? nextConfig : {};