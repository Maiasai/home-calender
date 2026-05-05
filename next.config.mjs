/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // ここを false にすることで Turbopack 無効化
      enabled: false,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jvhkdenhnrenjwmgnrpd.supabase.co',
      },
    ],
  },
};
export default nextConfig;
