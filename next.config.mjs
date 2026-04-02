import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontendNav: true,
  aggressiveFrontEndNavCaching: true,
  cacheStartUrl: true,
  dynamicStartUrl: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false, // Enabled even in development so testing offline works
  workboxOptions: {
    disableDevLogs: true,
  },
  fallbacks: {
    document: "/~offline",
  },
});

const nextConfig = {
  output: "standalone",
  turbopack: {}
};

export default withPWA(nextConfig);
