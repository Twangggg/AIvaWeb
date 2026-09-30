import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["motion", "@tanstack/react-query", "zustand", "@react-three/drei"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }
    ]
  }
};

export default nextConfig;
