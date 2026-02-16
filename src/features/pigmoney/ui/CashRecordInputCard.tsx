"use client";

import { CategoryInterface } from "@/entities/pigmoney/types";
import { InlineBatchForm } from "@/features/pigmoney/model/hooks/useInlineCashRecord";
import { Button } from "@/shared/components/atoms/button";
import { DatePicker } from "@/shared/components/atoms/date-picker";
import { SelectItem } from "@/shared/components/atoms/select";
import FormInput from "@/shared/components/molecules/FormInput";
import FormSelect from "@/shared/components/molecules/FormSelect";
import { Trash2, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface CashRecordInputCardProps {
  index: number;
  categories: CategoryInterface[];
  isNew: boolean; // 새 행 여부
  onRemove: () => void; // 새 행: field array에서 제거 / 기존 행: 삭제 액션
}

// 기존 거래 + 새 거래 공용 편집 가능 카드
const CashRecordInputCard = ({
  index,
  categories,
  isNew,
  onRemove,
}: CashRecordInputCardProps) => {
  const { control } = useFormContext<InlineBatchForm>();

  return (
    <div
      className={`relative flex items-start gap-3 rounded-lg border p-4 transition-colors ${
        isNew
          ? "border-dashed border-pigmoney-brand/40 bg-pigmoney-brand/5"
          : "border-background-secondary bg-background-primary"
      }`}
    >
      {/* 날짜 */}
      <div className="shrink-0">
        <Controller
          name={`records.${index}.date`}
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value ? new Date(field.value) : null}
              onSelect={(date) => field.onChange(date)}
              placeholder="날짜"
              className="w-[130px]"
            />
          )}
        />
      </div>

      {/* 사용내역 */}
      <div className="min-w-0 flex-1">
        <FormInput<InlineBatchForm>
          name={`records.${index}.description`}
          placeholder="사용내역"
          className="h-9 py-2"
        />
      </div>

      {/* 금액 */}
      <div className="w-[120px] shrink-0">
        <FormInput<InlineBatchForm>
          name={`records.${index}.amount`}
          placeholder="금액"
          type="number"
          className="h-9 py-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>

      {/* 분류 (카테고리) */}
      <div className="w-[110px] shrink-0">
        <FormSelect<InlineBatchForm>
          name={`records.${index}.categoryId`}
          placeholder="분류"
          className="h-9 py-2"
        >
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </FormSelect>
      </div>

      {/* 비고 */}
      <div className="w-[100px] shrink-0">
        <FormInput<InlineBatchForm>
          name={`records.${index}.note`}
          placeholder="비고"
          className="h-9 py-2"
        />
      </div>

      {/* 삭제/제거 버튼 */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="mt-0.5 shrink-0 cursor-pointer"
      >
        {isNew ? (
          <X className="h-4 w-4 text-minimoku-neutral-bold" />
        ) : (
          <Trash2 className="h-4 w-4 text-minimoku-neutral-bold" />
        )}
      </Button>
    </div>
  );
};

export default CashRecordInputCard;
