import {FolderInterface} from "@/entities/folder/types";
import SidebarContent from "@/widgets/sidebar/SidebarContent";

interface SidebarProps {
  initialFolders: FolderInterface[];
}

/**
 * 데스크톱(md 이상)에서만 보이는 고정 사이드바.
 * 모바일에서는 MobileSidebarDrawer 가 같은 내용을 드로어로 보여준다.
 */
const Sidebar = ({initialFolders}: SidebarProps) => (
  <aside className="bg-background-primary border-background-secondary hidden w-80 shrink-0 flex-col border-r md:flex">
    <SidebarContent initialFolders={initialFolders} />
  </aside>
);

export default Sidebar;
