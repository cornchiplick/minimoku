import db from "@/shared/lib/db";
import {Account, AuthOptions, DefaultSession, Session, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      provider?: string;
      userId?: number;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    })
  ],
  session: {
    strategy: "jwt",
    // 로그인 후 세션이 유지되는 최대시간(초 단위)을 의미함. 기본값은 30days
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: User;
      account?: Account | null;
    }): Promise<JWT> {
      // 초기 로그인 시 (user 객체가 존재할 때)
      if (account && user) {
        // OAuth access token 저장
        token.accessToken = account.access_token;

        // 사용자 정보 저장 (DB 연동 시 필요)
        token.id = user.id;
        token.provider = account.provider;

        // 유저 정보 db확인
        const existingUser = await db.user.findUnique({
          where: {
            provider_provider_id: {
              provider: account.provider,
              provider_id: user.id,
            },
          },
        });

        // 유저 정보 db에 없으면 db에 추가
        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              username: user.name ?? "Unknown",
              provider: account.provider,
              provider_id: user.id,
              avatar: user.image,
            },
          });
          token.userId = newUser.id;
        } else {
          token.userId = existingUser.id;
        }
      }
      return token;
    },
    async session({session, token}: {session: Session; token: JWT}) {
      // 세션에 추가 정보를 포함
      session.accessToken = token.accessToken as string;
      if (session.user) {
        // 세션 user 객체에 id(github db 관리), provider, userId(minimoku db 관리) 추가
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.userId = token.userId as number;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
