import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase1.limapp.my.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
