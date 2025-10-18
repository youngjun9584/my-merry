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
      {
        protocol: "https",
        hostname: "cdn2.makedear.com",
        port: "",
        pathname: "/**",
      },
    ],
    // 이미지 최적화 설정
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일 캐싱
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
  // 압축 활성화
  compress: true,
  // 성능 최적화
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // 빌드 최적화
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
