"use client";

import {useDrawerStore} from "@/shared/store/drawerStore";
import {Menu} from "lucide-react";

/**
 * 모바일에서만 보이는 사이드바 열기 버튼. 데스크톱(md 이상)에서는 사이드바가 항상 보이므로 숨긴다.
 */
const MobileSidebarTrigger = () => {
  const open = useDrawerStore((s) => s.open);

  return (
    <button
      type="button"
      onClick={open}
      aria-label="메뉴 열기"
      className="text-foreground hover:bg-background-secondary focus-visible:ring-ring -ml-1 rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none md:hidden">
      <Menu className="h-5 w-5" />
    </button>
  );
};

export default MobileSidebarTrigger;
