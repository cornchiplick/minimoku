// 게스트 계정 식별 상수/함수.
// next-auth 서버 의존이 없어 클라이언트 컴포넌트에서도 안전하게 import 할 수 있다.
// NextAuth Credentials Provider id, prisma/seed-guest.ts, lambda/guest-reset 모두 이 값을 공유한다.

export const GUEST_PROVIDER = "guest";

export const isGuestProvider = (provider?: string | null) => provider === GUEST_PROVIDER;
