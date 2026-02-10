"use client";

import { CashRecordInterface, CategoryInterface, CashRecordType } from "@/entities/pigmoney/types";
import CashRecordEditModal from "./CashRecordEditModal";
import useCashRecordAction from "@/features/pigmoney/model/hooks/useCashRecordAction";
import { Card } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { formatDate } from "@/shared/lib/utils/dateUtils";
import { Edit, Trash2 } from "lucide-react";

interface CashRecordCardProps {
  data: CashRecordInterface;
  categories: CategoryInterface[];
}

// 조회용 거래 카드
const CashRecordCard = ({ data, categories }: CashRecordCardProps) => {
  const { onDeleteRecord } = useCashRecordAction();
  const editModalState = useBoolean();
  const isIncome = data.type === CashRecordType.INCOME;

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* 날짜 */}
            <div className="text-minimoku-neutral-bold text-xs">{formatDate(data.date)}</div>

            {/* 카테고리 + 금액 */}
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-background-secondary rounded px-2 py-0.5 text-xs">
                {data.category?.name ?? "미분류"}
              </span>
              <span
                className={`text-lg font-semibold ${isIncome ? "text-pigmoney-income" : "text-pigmoney-expense"}`}
              >
                {isIncome ? "+" : "-"}₩{data.amount.toLocaleString()}
              </span>
            </div>

            {/* 내용 */}
            <div className="mt-2 text-sm font-medium">{data.description}</div>

            {/* 비고 */}
            {data.note && (
              <div className="text-minimoku-neutral-bold mt-1 text-xs">{data.note}</div>
            )}
          </div>

          {/* 수정/삭제 버튼 */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={editModalState.onTrue}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => onDeleteRecord({ id: data.id })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* 수정 모달 */}
      <CashRecordEditModal
        modalState={editModalState}
        categories={categories}
        originValue={data}
      />
    </>
  );
};

export default CashRecordCard;
