import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Output as standalone for Docker/containerized deployment
  output: "standalone",
  
  // TypeScript checks during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Add environment variables that need to be available at build time
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
  },
  
  // Disable powered by header for security
  poweredByHeader: false,
}

export default nextConfig
