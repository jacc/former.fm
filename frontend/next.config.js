/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
