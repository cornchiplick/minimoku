"use client";

import {Sheet, SheetContent} from "@/shared/components/atoms/sheet";
import {useDrawerStore} from "@/shared/store/drawerStore";
import {usePathname} from "next/navigation";
import {useState} from "react";

interface MobileSidebarDrawerProps {
  /** 사이드바 내용. 서버 컴포넌트에서 만들어 넘긴다. */
  children: React.ReactNode;
  title: string;
}

/**
 * 모바일 사이드바. 데스크톱(md 이상)에서는 레이아웃의 고정 사이드바가 보이므로 렌더링하지 않는다.
 */
const MobileSidebarDrawer = ({children, title}: MobileSidebarDrawerProps) => {
  const {isOpen, setOpen, close} = useDrawerStore();
  const pathname = usePathname();

  // 경로가 바뀌면(= 메뉴를 눌러 이동하면) 드로어를 닫는다.
  // effect 대신 렌더 중 조정 방식을 쓴다 (불필요한 2차 렌더링 방지).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (isOpen) close();
  }

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent side="left" title={title} className="overflow-y-auto p-0">
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSidebarDrawer;
