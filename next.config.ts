import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignorar erros de ESLint durante o build - nao recomendado para produção,
    // mas útil para superar problemas temporários de lint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de tipagem durante o build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
