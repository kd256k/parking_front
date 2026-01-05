import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  //Rewrites 설정 추가
  async rewrites() {
    return [
      {
        // 개발 환경용 프록시 설정
        source: '/api/:path*',
        destination: 'http://10.125.121.183:9090/api/:path*', 
      },
    ];
  },

  async redirects() { 
    return [
      {
        source: '/',
        destination: '/map',
        permanent: true, // redirects() 안에서만 유효한 옵션입니다.
      },
    ];
  },
};

export default nextConfig;
