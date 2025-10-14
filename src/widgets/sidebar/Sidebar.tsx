"use client";

import {FolderInterface} from "@/entities/folder/types";
import {useFolderStore} from "@/features/folder/model/store/folderStore";
import LinkAddButton from "@/features/link/ui/LinkAddButton";
import FilterList from "@/features/navigation/ui/FilterList";
import FolderList from "@/features/navigation/ui/FolderList";
import ProfileSection from "@/features/profile/ui/ProfileSection";
import Divider from "@/shared/components/molecules/Divider";
import {FilterConstants} from "@/shared/constants/navigation";
import Typography from "@/shared/home/atomic/Typography";
import SearchBar from "@/widgets/sidebar/SearchBar";
import {Bell, Star} from "lucide-react";
import {useEffect, useState} from "react";

interface SidebarProps {
  initialFolders: FolderInterface[];
}

const Sidebar = ({initialFolders}: SidebarProps) => {
  const {setFolderList} = useFolderStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    {id: FilterConstants.FILTER_ALL, name: "전체", icon: Star, count: 4},
    {id: FilterConstants.FILTER_UNREAD, name: "읽지 않음", icon: Bell, count: 2},
    {id: FilterConstants.FILTER_FAVORITE, name: "즐겨찾기", icon: Star, count: 1},
    {id: FilterConstants.FILTER_NOTIFIED, name: "알림 설정", icon: Bell, count: 0},
  ];

  useEffect(() => {
    setFolderList(initialFolders);
  }, []);

  return (
    <div className="bg-background-primary border-background-secondary flex w-80 flex-col border-r">
      {/* Header */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-minimoku flex h-8 w-8 items-center justify-center rounded-lg">
              <Typography.P2 className="font-bold">日</Typography.P2>
            </div>
            <Typography.P1 className="font-semibold">LinkLocker</Typography.P1>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <LinkAddButton />
        </div>
      </div>

      <Divider />

      {/* User Profile */}
      <ProfileSection />

      <Divider />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <FilterList filters={filters} />
        <Divider />
        <FolderList folders={initialFolders} />
      </div>
    </div>
  );
};

export default Sidebar;
