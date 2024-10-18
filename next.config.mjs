/** @type {import('next').NextConfig} */
import pgConnectionString from "pg-connection-string";

if (process.env.DATABASE_URL) {
  const pgConfig = pgConnectionString.parse(process.env.DATABASE_URL);
  process.env.PGHOST = pgConfig.host;
  process.env.PGUSER = pgConfig.user;
  process.env.PGDATABASE = pgConfig.database;
  process.env.PGPASSWORD = pgConfig.password;
  process.env.PGPORT = pgConfig.port;
}

const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "replicate.com",
      },
      {
        protocol: "https",
        hostname: "tjzk.replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
    ],
    path: "/_next/image",
    loader: "default",
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

export default nextConfig;
