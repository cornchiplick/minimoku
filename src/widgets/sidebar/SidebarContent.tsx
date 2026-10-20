import {FolderInterface} from "@/entities/folder/types";
import LinkAddButton from "@/features/link/ui/LinkAddButton";
import FilterList from "@/features/navigation/ui/FilterList";
import FolderList from "@/features/navigation/ui/FolderList";
import ProfileSection from "@/features/profile/ui/ProfileSection";
import Divider from "@/shared/components/molecules/Divider";
import Typography from "@/shared/home/atomic/Typography";
import SearchBar from "@/widgets/sidebar/SearchBar";
import {Link as LinkIcon} from "lucide-react";
import NextLink from "next/link";

interface SidebarContentProps {
  initialFolders: FolderInterface[];
}

/**
 * LinkLocker 사이드바의 내용.
 * 데스크톱 고정 사이드바와 모바일 드로어가 같은 내용을 공유한다.
 */
const SidebarContent = ({initialFolders}: SidebarContentProps) => (
  <div className="flex h-full min-h-0 flex-col">
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <NextLink href="/link" className="flex items-center space-x-2">
          <div className="bg-minimoku-surface flex h-8 w-8 items-center justify-center rounded-lg">
            <LinkIcon className="h-5 w-5 text-white" />
          </div>
          <Typography.P1 className="font-semibold">LinkLocker</Typography.P1>
        </NextLink>
      </div>

      <div className="flex flex-col space-y-3">
        <SearchBar />
        <LinkAddButton />
      </div>
    </div>

    <Divider />

    <ProfileSection />

    <Divider />

    <div className="min-h-0 flex-1 overflow-y-auto">
      <FilterList />
      <Divider />
      <FolderList folders={initialFolders} />
    </div>
  </div>
);

export default SidebarContent;
