import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "raw.githubusercontent.com",
      "prebuiltui.com",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
