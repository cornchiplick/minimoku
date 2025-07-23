import {withAuth} from "next-auth/middleware";

// 인증되지 않은 사용자를 리다이렉트할 경로를 지정
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// 인증이 필요한 경로 정의
export const config = {
  matcher: [
    "/accumulate/:path",
    // "/phrases/:path",
    "/quiz/:path",
  ],
};
