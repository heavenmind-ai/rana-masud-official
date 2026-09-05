import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Edge-level permanent redirects: handled natively by Vercel CDN routing without charging Edge function compute
  async redirects() {
    return [
      {
        source: "/detail/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ctg/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

