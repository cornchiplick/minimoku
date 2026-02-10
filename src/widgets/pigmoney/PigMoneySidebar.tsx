"use client";

import useCashRecordFilter from "@/features/pigmoney/model/hooks/useCashRecordFilter";
import CategoryManageModal from "@/features/pigmoney/ui/CategoryManageModal";
import ProfileSection from "@/features/profile/ui/ProfileSection";
import Divider from "@/shared/components/molecules/Divider";
import {useBoolean} from "@/shared/hooks/useBoolean";
import {Settings} from "lucide-react";

// PigMoney 좌측 사이드바
const PigMoneySidebar = () => {
  const categoryModalState = useBoolean();
  const {totalIncome, totalExpense} = useCashRecordFilter();

  return (
    <>
      <div className="bg-background-primary border-background-secondary flex w-80 flex-col border-r">
        {/* 프로필 섹션 */}
        <ProfileSection />

        <Divider />

        {/* 통계 요약 (단순 텍스트) */}
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-minimoku-neutral-bold text-sm">총 수입</span>
            <span className="text-pigmoney-income font-semibold">
              {totalIncome.toLocaleString()}
              {` 원`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-minimoku-neutral-bold text-sm">총 지출</span>
            <span className="text-pigmoney-expense font-semibold">
              {totalExpense.toLocaleString()}
              {` 원`}
            </span>
          </div>
        </div>

        <Divider />

        {/* 카테고리 관리 */}
        <div className="p-4">
          <button
            className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm"
            onClick={categoryModalState.onTrue}>
            <Settings className="text-minimoku-neutral-bold h-4 w-4" />
            <span>카테고리 관리</span>
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="flex-1" />
      </div>

      {/* 카테고리 관리 모달 */}
      <CategoryManageModal modalState={categoryModalState} />
    </>
  );
};

export default PigMoneySidebar;
