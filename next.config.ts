import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  // Allow Android devices on the current LAN to load Next.js dev assets.
  allowedDevOrigins: ["10.183.33.39"],
};

export default nextConfig;
