import GuestBanner from "@/widgets/guest/GuestBanner";
import {Suspense} from "react";
import PigMoneyHeader from "@/widgets/pigmoney/PigMoneyHeader";
import PigMoneySidebar from "@/widgets/pigmoney/PigMoneySidebar";

const PigMoneyLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-background-primary flex h-screen flex-col overflow-hidden">
      {/* 게스트 모드 안내 배너 (게스트 로그인 시에만 노출) — 세션을 읽으므로 경계 안에서 */}
      <Suspense fallback={null}>
        <GuestBanner />
      </Suspense>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* 좌측: 데스크톱 사이드바 + 모바일 드로어 */}
        <PigMoneySidebar />

        {/* 우측: 헤더 + 메인 콘텐츠 */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <PigMoneyHeader />
          {/* 본문 — 사이드바를 건너뛰고 바로 올 수 있게 랜드마크를 둔다 */}
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default PigMoneyLayout;
