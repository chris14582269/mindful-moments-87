/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    typedRoutes: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
    ],
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
