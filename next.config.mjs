/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // minimoku.net 과 www.minimoku.net 이 둘 다 열려 있는데, 인증은 www 기준으로만 동작한다
  // (NEXTAUTH_URL). www 없는 주소에서 로그인하면 쿠키가 minimoku.net 에 저장된 뒤
  // www 로 보내져, 쿠키가 전달되지 않아 다시 로그인 화면으로 돌아간다.
  // 그래서 한쪽 주소로 모은다.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{type: "host", value: "minimoku.net"}],
        destination: "https://www.minimoku.net/:path*",
        permanent: true,
      },
    ];
  },
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
