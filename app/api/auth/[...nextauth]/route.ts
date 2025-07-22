import NextAuth, {AuthOptions} from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60 // 30days
  },
  callbacks: {
    async jwt({token, user, account}: any) {
      // 초기 로그인 시 (user 객체가 존재할 때)
      if (account && user) {
        token.accessToken = account.access_token; // OAuth access token 저장
        token.id = user.id; // 사용자 ID 저장 (DB 연동 시 필요)
      }
      return token;
    },
    async session({session, token}: any) {
      // 세션에 추가 정보를 포함
      session.accessToken = token.accessToken as string;
      session.user.id = token.id as string; // 세션 user 객체에 id 추가
      return session;
    },
  },
  // secret: "swc4h+Zlp/dX11n2wZKWjQlKDVNLR2D3q2VbLhQSpTw=",
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
