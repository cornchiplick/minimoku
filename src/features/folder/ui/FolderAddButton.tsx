"use client";

import FolderFormModal from "@/features/folder/ui/FolderFormModal";
import Icon from "@/shared/components/molecules/Icon";
import {useBoolean} from "@/shared/hooks/useBoolean";

const FolderAddButton = () => {
  const isShowFolderAddModal = useBoolean();

  return (
    <>
      <button
        type="button"
        onClick={isShowFolderAddModal.onTrue}
        aria-label="폴더 추가"
        className="text-minimoku-neutral-bold hover:bg-background-secondary hover:text-foreground focus-visible:ring-minimoku cursor-pointer rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none">
        <Icon name="add" color="currentColor" size={16} />
      </button>
      <FolderFormModal modalState={isShowFolderAddModal} />
    </>
  );
};

export default FolderAddButton;
