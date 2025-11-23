/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  },
  // ←←← THIS LINE IS THE MAGIC ONE
  output: "standalone"
};

module.exports = nextConfig;
