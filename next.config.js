/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  publicExcludes: ["!sw.js"],
});

const nextConfig = {
  experimental: {
    turbo: false,
  },
};

module.exports = withPWA(nextConfig);
