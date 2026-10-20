import {getFolders} from "@/features/folder/model/services/folders.service";
import GuestBanner from "@/widgets/guest/GuestBanner";
import MobileSidebarDrawer from "@/widgets/sidebar/MobileSidebarDrawer";
import Sidebar from "@/widgets/sidebar/Sidebar";
import SidebarContent from "@/widgets/sidebar/SidebarContent";
import {unstable_noStore as noStore} from "next/cache";

const LinkHomeLayout = async ({children}: {children: React.ReactNode}) => {
  noStore();
  const initialFolders = await getFolders();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 게스트 모드 안내 배너 (게스트 로그인 시에만 노출) */}
      <GuestBanner />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* 데스크톱: 고정 사이드바 */}
        <Sidebar initialFolders={initialFolders} />
        {/* 모바일: 같은 내용을 드로어로 */}
        <MobileSidebarDrawer title="LinkLocker 메뉴">
          <SidebarContent initialFolders={initialFolders} />
        </MobileSidebarDrawer>
        {children}
      </div>
    </div>
  );
};

export default LinkHomeLayout;
