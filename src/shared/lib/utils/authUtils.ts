import {authOptions} from "@/shared/lib/auth";
import {getServerSession} from "next-auth";

/**
 * 현재 로그인 중인 사용자의 정보를 조회하여 가져오는 함수
 * // TODO 캐싱처리하여 로그아웃 전까지, expired되지 않는 한 계속해서 사용
 * @returns User | null
 */
export const getSessionUser = async () => {
  // 서버에서 유저 세션정보 가져오기
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }

  const user = {
    id: session.user.userId,
    username: session.user.name,
    provider: session.user.provider,
    provider_id: session.user.id,
    avatar: session.user.image || null,
  };
  return user;
};
