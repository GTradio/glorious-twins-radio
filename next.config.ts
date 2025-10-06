import type { NextConfig } from "next";
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // next.js config
  turbopack: {
    // ...
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default pwaConfig(nextConfig as any);
