import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // panggilan fe
        destination: `${API_URL}/api/v1/:path*` // backend
      },
      {
        source: "/auth/:path*",
        destination: `${API_URL}/auth/:path*` // backend
      }
    ]
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.kertaskerja.cc",
        port: "",
        pathname: "/**",        // atau "/logo/**" jika mau lebih ketat
      },
    ],
    // alternatif singkat:
    // domains: ["logo.kertaskerja.cc"],
  },
  transpilePackages: ["@react-pdf/renderer", "react-pdf"],
};

export default nextConfig;
