"use client";

import FolderAddModal from "@/features/folder/ui/FolderAddModal";
import Icon from "@/shared/components/molecules/Icon";
import Typography from "@/shared/home/atomic/Typography";
import {useBoolean} from "@/shared/hooks/useBoolean";

const FolderAddButton = () => {
  const isShowFolderAddModal = useBoolean();

  return (
    <>
      <button
        type="button"
        onClick={isShowFolderAddModal.onTrue}
        className="cursor-pointer rounded-full p-1 hover:bg-gray-300">
        <Typography.P2 className="font-medium">
          <Icon name="add" color="#99a1af" size={16} />
        </Typography.P2>
      </button>
      <FolderAddModal modalState={isShowFolderAddModal} />
    </>
  );
};

export default FolderAddButton;
