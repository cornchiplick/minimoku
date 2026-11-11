import {getSessionUser} from "@/shared/lib/utils/authUtils";
import Link from "next/link";

interface GuestBannerProps {
  /** 내 계정으로 로그인한 뒤 돌아올 경로 — 지금 보고 있는 서비스 */
  returnTo: string;
}

// 게스트 계정 사용 시 상단에 표시되는 안내 배너 (서버 컴포넌트).
// 정책 A: 모든 비로그인 사용자가 단일 게스트 계정을 공유하므로 데이터가 섞일 수 있음을 알린다.
// 매일 04:00 KST 에 게스트 데이터가 초기화된다는 점도 안내한다.
const GuestBanner = async ({returnTo}: GuestBannerProps) => {
  const user = await getSessionUser();
  if (!user?.isGuest) return null;

  return (
    // 랜드마크로 둬야 스크린리더가 영역을 훑을 때 빠지지 않는다
    <aside
      aria-label="체험 모드 안내"
      className="bg-notice-surface text-notice px-4 py-2 text-center text-xs">
      체험 모드입니다. 이 계정은 모든 방문자가 공유하므로 다른 사용자의 데이터가 함께 보일 수 있고,
      매일 새벽 4시에 모든 데이터가 초기화됩니다.{" "}
      {/* 게스트에서 내 계정으로 바꾸는 입구. 색을 따로 주지 않고 밑줄로만 구분한다 (배너 글자색 그대로) */}
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(returnTo)}`}
        className="font-semibold whitespace-nowrap underline underline-offset-2 hover:no-underline">
        내 계정으로 로그인
      </Link>
    </aside>
  );
};

export default GuestBanner;
