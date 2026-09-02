import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output bundles all dependencies for cPanel / VPS deployment.
  // This produces a self-contained .next/standalone folder.
  output: "standalone",
};

export default nextConfig;
