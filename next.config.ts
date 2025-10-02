import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
