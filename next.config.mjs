/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      turbo: {
        // ここを false にすることで Turbopack 無効化
        enabled: false
      }
    }
  }
export default nextConfig;
