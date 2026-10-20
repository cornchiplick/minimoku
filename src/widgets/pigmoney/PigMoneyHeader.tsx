"use client";

import MobileSidebarTrigger from "@/widgets/sidebar/MobileSidebarTrigger";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";

// PigMoney 헤더 (모바일 메뉴 버튼 + 테마 토글)
const PigMoneyHeader = () => {
  return (
    <div className="bg-background-primary border-background-secondary flex items-center justify-between border-b px-4 py-2 md:justify-end md:px-6">
      <MobileSidebarTrigger />
      <ThemeToggleButton />
    </div>
  );
};

export default PigMoneyHeader;
