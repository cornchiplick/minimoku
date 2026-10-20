/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Next 16 부터 images.domains 는 deprecated — remotePatterns 를 쓴다
    remotePatterns: [
      {protocol: "https", hostname: "avatars.githubusercontent.com"},
      {protocol: "https", hostname: "lh3.googleusercontent.com"},
      {protocol: "https", hostname: "imagedelivery.net"},
      {protocol: "https", hostname: "k.kakaocdn.net"},
    ],
  },
};

export default nextConfig;
