import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las fotos ya se guardan recortadas y comprimidas en /public/fotos.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
