import PigMoneyHeader from "@/widgets/pigmoney/PigMoneyHeader";
import PigMoneySidebar from "@/widgets/pigmoney/PigMoneySidebar";

const PigMoneyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background-primary flex h-screen overflow-hidden">
      {/* 좌측: 사이드바 (전체 높이) */}
      <PigMoneySidebar />

      {/* 우측: 헤더 + 메인 콘텐츠 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <PigMoneyHeader />
        {children}
      </div>
    </div>
  );
};

export default PigMoneyLayout;
