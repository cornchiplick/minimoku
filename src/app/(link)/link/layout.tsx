import {getFolders} from "@/features/folder/model/services/folders.service";
import GuestBanner from "@/widgets/guest/GuestBanner";
import Sidebar from "@/widgets/sidebar/Sidebar";
import {unstable_noStore as noStore} from "next/cache";

const LinkHomeLayout = async ({children}: {children: React.ReactNode}) => {
  noStore();
  const initialFolders = await getFolders();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* 게스트 모드 안내 배너 (게스트 로그인 시에만 노출) */}
      <GuestBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar initialFolders={initialFolders} />
        {children}
      </div>
    </div>
  );
};

export default LinkHomeLayout;
