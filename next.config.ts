import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "potent-hygiene.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dw0n4qiceose7.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dw0n4qiceose7.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
