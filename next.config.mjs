/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://mos-ma.academy-lead.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
