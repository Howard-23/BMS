import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Output as standalone for Docker/containerized deployment
  output: "standalone",
  
  // TypeScript checks during build
  // Set to false if you want strict type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Disable powered by header for security
  poweredByHeader: false,
}

export default nextConfig
