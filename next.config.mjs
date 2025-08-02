/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontendNav: true,
  aggressiveFrontEndNavCaching: false,
  cacheStartUrl: true,
  dynamicStartUrl: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
 experimental: {
   turbo: {
     resolveAlias: {
       underscore: "lodash",
     },
     resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
   },
 },
 output: "standalone",
};

export default withPWA(nextConfig);
