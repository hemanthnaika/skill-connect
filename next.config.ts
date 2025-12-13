import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "raw.githubusercontent.com",
      "prebuiltui.com",
      "images.unsplash.com",
      "images.pexels.com",
      "lh3.googleusercontent.com",
      "images.remotePatterns",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
