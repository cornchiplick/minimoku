"use client";

import {FolderInterface} from "@/entities/folder/types";
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

  return (
    <button
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
      </div>
      <Typography.P3>{folder.count}</Typography.P3>
    </button>
  );
};

export default FolderItem;
