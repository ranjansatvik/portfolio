import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server's HMR websocket to be reached when the site is
  // opened via the machine's LAN IP instead of localhost — without this,
  // Next rejects the HMR socket from that origin and falls back to
  // reload-looping the page, which looks like dead client-side interactivity.
  allowedDevOrigins: ["192.168.0.105"],
};

export default nextConfig;
