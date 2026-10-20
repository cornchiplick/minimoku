import {withAuth} from "next-auth/middleware";

// Next 16 부터 middleware 는 proxy 로 이름이 바뀌었다 (런타임은 nodejs 고정, edge 미지원).
// 인증되지 않은 사용자를 리다이렉트할 경로를 지정
export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({token}) => {
      // true면 권한 있음. false면 미인증자.
      return !!token;
    },
  },
});

// 인증이 필요한 경로 정의
export const config = {
  matcher: ["/link", "/link/:path*", "/pigmoney", "/pigmoney/:path*"],
};
