import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.themealdb.com",
      },
    ],
  },
  async rewrites() {
    // Only used in local dev (npm run dev). In Docker, Nginx handles routing.
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:8080"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
