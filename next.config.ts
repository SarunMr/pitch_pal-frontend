import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    // Disable Next.js optimization for localhost (dev backend) images
    // to avoid "resolved to private ip" security error
    unoptimized: true,
  },
};

export default nextConfig;
