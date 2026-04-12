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
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          expiration: {
            maxEntries: 50,
          },
        },
      },
    ],
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
