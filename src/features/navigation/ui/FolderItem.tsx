"use client";

import {FolderInterface} from "@/entities/folder/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/atoms/dropdown";
import Icon from "@/shared/components/molecules/Icon";
import Typography from "@/shared/home/atomic/Typography";
import {useThemeStore} from "@/shared/store/themeStore";
import clsx from "clsx";
import {Archive, Folder} from "lucide-react";

interface FolderItemProps {
  folder: FolderInterface;
  onClick?: () => void;
}

const FolderItem = ({folder, onClick}: FolderItemProps) => {
  const {isDarkMode} = useThemeStore();
  const FolderIcon = folder.id === 0 ? Archive : Folder;

  const handleClickMore = (e: any) => {
    e.stopPropagation();
    console.log("test");
  };

  return (
    <div
      className={clsx(
        "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
      )}
      onClick={onClick}>
      <div className="flex items-center space-x-3">
        <FolderIcon
          className="h-4 w-4"
          stroke={isDarkMode ? "none" : "black"}
          fill={isDarkMode ? "white" : "none"}
        />
        <Typography.P2>{folder.name}</Typography.P2>
        <Typography.P3>{folder.count}</Typography.P3>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="cursor-pointer rounded-full p-1 hover:bg-gray-300">
            <Icon name="more" color="#99a1af" size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="start"
          className="bg-background-primary w-28 border border-gray-400">
          <DropdownMenuItem>
            <Typography.P2>수정</Typography.P2>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Typography.P2>삭제</Typography.P2>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Typography.P2>비우기</Typography.P2>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FolderItem;
