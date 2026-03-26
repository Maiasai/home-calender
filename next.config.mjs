/** @type {import('next').NextConfig} */
<<<<<<< HEAD
const nextConfig = {};

=======
const nextConfig = {
    experimental: {
      turbo: {
        // ここを false にすることで Turbopack 無効化
        enabled: false
      }
    },
    images: {
      domains: ['jvhkdenhnrenjwmgnrpd.supabase.co'],
    },
  }
>>>>>>> d2016e3 (レビュー修正対応)
export default nextConfig;
