"use client";

import LinkFormModal from "@/features/link/ui/LinkFormModal";
import Typography from "@/shared/home/atomic/Typography";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { Plus } from "lucide-react";

const LinkAddButton = () => {
  const isShowLinkAddModal = useBoolean();

  return (
    <>
      <button
        className="bg-minimoku hover:bg-minimoku-hover flex w-full cursor-pointer items-center justify-center space-x-2 rounded-lg px-4 py-2 text-white transition-colors"
        onClick={isShowLinkAddModal.onTrue}>
        <Plus className="h-4 w-4" />
        <Typography.P1 className="text-white">링크 추가</Typography.P1>
      </button>
      <LinkFormModal modalState={isShowLinkAddModal} />
    </>
  );
};

export default LinkAddButton;
