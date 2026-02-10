"use client";

import { CategoryInterface } from "@/entities/pigmoney/types";
import CashRecordFormModal from "./CashRecordFormModal";
import { Button } from "@/shared/components/atoms/button";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { Plus } from "lucide-react";

interface CashRecordAddButtonProps {
  categories: CategoryInterface[];
}

// 거래 추가 버튼
const CashRecordAddButton = ({ categories }: CashRecordAddButtonProps) => {
  const modalState = useBoolean();

  return (
    <>
      <Button onClick={modalState.onTrue} className="cursor-pointer">
        <Plus className="mr-1 h-4 w-4" />
        거래 추가
      </Button>
      <CashRecordFormModal modalState={modalState} categories={categories} />
    </>
  );
};

export default CashRecordAddButton;
