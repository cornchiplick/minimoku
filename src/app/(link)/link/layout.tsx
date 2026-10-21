import {getFolders} from "@/features/folder/model/services/folders.service";
import GuestBanner from "@/widgets/guest/GuestBanner";
import MobileSidebarDrawer from "@/widgets/sidebar/MobileSidebarDrawer";
import SidebarContent from "@/widgets/sidebar/SidebarContent";
import SidebarSkeleton from "@/widgets/sidebar/SidebarSkeleton";
import {Suspense} from "react";

/**
 * 사이드바와 드로어는 같은 폴더 목록을 쓴다.
 * 세션을 읽는 조회이므로 Suspense 경계 안에서 수행해, 나머지 뼈대는 먼저 그려지게 한다.
 */
const SidebarRegions = async () => {
  const folders = await getFolders();

  return (
    <>
      <aside className="bg-background-primary border-border hidden w-80 shrink-0 flex-col border-r md:flex">
        <SidebarContent initialFolders={folders} />
      </aside>
      <MobileSidebarDrawer title="LinkLocker 메뉴">
        <SidebarContent initialFolders={folders} />
      </MobileSidebarDrawer>
    </>
  );
};

const LinkHomeLayout = ({children}: {children: React.ReactNode}) => (
  <div className="flex h-screen flex-col overflow-hidden">
    {/* 게스트 모드 안내 배너 (게스트 로그인 시에만 노출) */}
    <Suspense fallback={null}>
      <GuestBanner />
    </Suspense>
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <Suspense
        fallback={
          <aside className="bg-background-primary border-border hidden w-80 shrink-0 flex-col border-r md:flex">
            <SidebarSkeleton />
          </aside>
        }>
        <SidebarRegions />
      </Suspense>
      {/* 본문 — 스크린리더가 사이드바를 건너뛰고 바로 올 수 있게 랜드마크를 둔다 */}
      <main className="bg-background-primary flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  </div>
);

export default LinkHomeLayout;
