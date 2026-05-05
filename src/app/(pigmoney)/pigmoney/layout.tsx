import GuestBanner from "@/widgets/guest/GuestBanner";
import PigMoneyHeader from "@/widgets/pigmoney/PigMoneyHeader";
import PigMoneySidebar from "@/widgets/pigmoney/PigMoneySidebar";

const PigMoneyLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="bg-background-primary flex h-screen flex-col overflow-hidden">
      {/* 게스트 모드 안내 배너 (게스트 로그인 시에만 노출) */}
      <GuestBanner />
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 사이드바 (전체 높이) */}
        <PigMoneySidebar />

        {/* 우측: 헤더 + 메인 콘텐츠 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <PigMoneyHeader />
          {children}
        </div>
      </div>
    </div>
  );
};

export default PigMoneyLayout;
