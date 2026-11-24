import type { NextConfig } from "next";

const retiredSportRoutes = [
  "basketball",
  "beisbol",
  "carreras",
  "ciclismo",
  "egames",
  "f1",
  "mas",
  "tenis",
  "todos",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.3'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
        pathname: '/football/teams/**',
      },
    ],
  },
  async redirects() {
    return retiredSportRoutes.map((route) => ({
      source: `/${route}/:path*`,
      destination: "/futbol",
      permanent: true,
    }));
  },
};

export default nextConfig;
