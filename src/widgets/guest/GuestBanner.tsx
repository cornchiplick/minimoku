import {getSessionUser} from "@/shared/lib/utils/authUtils";

// 게스트 계정 사용 시 상단에 표시되는 안내 배너 (서버 컴포넌트).
// 정책 A: 모든 비로그인 사용자가 단일 게스트 계정을 공유하므로 데이터가 섞일 수 있음을 알린다.
// 매일 04:00 KST 에 게스트 데이터가 초기화된다는 점도 안내한다.
const GuestBanner = async () => {
  const user = await getSessionUser();
  if (!user?.isGuest) return null;

  return (
    <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
      체험 모드입니다. 이 계정은 모든 방문자가 공유하므로 다른 사용자의 데이터가 함께 보일 수 있고,
      매일 새벽 4시에 모든 데이터가 초기화됩니다.
    </div>
  );
};

export default GuestBanner;
