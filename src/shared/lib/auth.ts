import db from "@/shared/lib/db";
import {GUEST_PROVIDER} from "@/shared/lib/utils/guestUtils";
import {Account, AuthOptions, DefaultSession, Session, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
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
    }),
    // 게스트 로그인용 Credentials Provider.
    // 자격증명 검증 없이 시드된 단일 게스트 User 레코드를 반환한다.
    // 모든 게스트가 이 계정 1개를 공유하며(정책 A), 매일 04:00 KST 에 데이터가 초기화된다.
    CredentialsProvider({
      id: GUEST_PROVIDER,
      name: "Guest",
      credentials: {},
      async authorize() {
        const guest = await db.user.findUnique({
          where: {
            provider_provider_id: {
              provider: GUEST_PROVIDER,
              provider_id: GUEST_PROVIDER,
            },
          },
        });
        if (!guest) {
          // 시드되지 않은 환경에서는 게스트 로그인을 거부한다.
          // npm run seed:guest 를 먼저 실행해야 한다.
          console.error("[auth] 게스트 User 가 시드되지 않았습니다. seed-guest.ts 를 먼저 실행하세요.");
          return null;
        }
        return {
          id: String(guest.id),
          name: guest.username,
          image: guest.avatar ?? null,
        };
      },
    }),
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

        // 게스트 로그인은 authorize() 에서 이미 시드된 User row 를 찾아 user.id 에 DB id 를 담아 보낸다.
        // OAuth 흐름과 달리 신규 가입/기본 폴더 생성을 건너뛴다.
        if (account.provider === GUEST_PROVIDER) {
          token.userId = Number(user.id);
          return token;
        }

        // 유저 정보 db확인
        const existingUser = await db.user.findUnique({
          where: {
            provider_provider_id: {
              provider: account.provider,
              provider_id: user.id,
            },
          },
        });

        if (!existingUser) {
          // 유저 정보 db에 없으면 db에 추가
          const newUser = await db.$transaction(async (tx) => {
            const newUserData = await tx.user.create({
              data: {
                username: user.name ?? "Unknown",
                provider: account.provider,
                provider_id: user.id,
                avatar: user.image,
              },
            });

            // 유저 신규 생성 시 기본 폴더 추가
            await tx.folder.create({
              data: {
                name: "기본",
                userId: newUserData.id,
              },
            });

            return newUserData;
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
