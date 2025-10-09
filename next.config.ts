import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edi-img.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/uploads/merry/**",
      },
    ],
  },
};

export default nextConfig;
