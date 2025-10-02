/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath:
    process.env.NODE_ENV === "production"
      ? "/OS3-Synergy-default-dashboard"
      : "",
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "/OS3-Synergy-default-dashboard/"
      : "",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
