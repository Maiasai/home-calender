/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // ここを false にすることで Turbopack 無効化
      enabled: false,
    },
  },
  images: {
    minimumCacheTTL: 2678400,
    //生成する画像幅を絞る対策
    deviceSizes: [360, 414, 768, 1024, 1536],
    imageSizes: [128, 256],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jvhkdenhnrenjwmgnrpd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'esjnosvqvwvjufprggwg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};
export default nextConfig;
