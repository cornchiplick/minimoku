import { withAuth } from "next-auth/middleware";

// 인증되지 않은 사용자를 리다이렉트할 경로를 지정
export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ req, token }) => {
      console.log("[middleware] Incoming Request:", req.nextUrl.pathname);
      console.log("[middleware] Token Exists:", !!token);
      // true면 권한 있음. false면 미인증자.
      return !!token;
    }
  }
});


// 인증이 필요한 경로 정의
export const config = {
  matcher: [
    "/link",
    "/link/:path*",
    "/pigmoney",
    "/pigmoney/:path*",
    "/accumulate",
    "/accumulate/:path*",
    "/quiz",
    "/quiz/:path*",
  ],
};
