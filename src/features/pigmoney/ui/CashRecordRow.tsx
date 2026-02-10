"use client";

import { Button } from "@/shared/components/atoms/button";
import { SelectItem } from "@/shared/components/atoms/select";
import { Switch } from "@/shared/components/atoms/switch";
import { DatePicker } from "@/shared/components/atoms/date-picker";
import FormInput from "@/shared/components/molecules/FormInput";
import FormSelect from "@/shared/components/molecules/FormSelect";
import Typography from "@/shared/home/atomic/Typography";
import { CategoryInterface } from "@/entities/pigmoney/types";
import { CashRecordBatchSchemaType } from "@/features/pigmoney/model/schema/cashRecordBatchSchema";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface CashRecordRowProps {
  index: number;
  categories: CategoryInterface[];
  onRemove: () => void;
  showRemoveButton: boolean;
}

// 모달 내 단일 거래 입력 행
const CashRecordRow = ({ index, categories, onRemove, showRemoveButton }: CashRecordRowProps) => {
  const { control, watch } = useFormContext<CashRecordBatchSchemaType>();
  const type = watch(`records.${index}.type`);
  const isIncome = type === "INCOME";

  return (
    <div className="flex items-start gap-2 rounded-lg border p-3">
      {/* 수입/지출 토글 */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <Controller
          name={`records.${index}.type`}
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-1.5">
              <Switch
                checked={field.value === "INCOME"}
                onCheckedChange={(checked) => field.onChange(checked ? "INCOME" : "EXPENSE")}
              />
              <span
                className={`text-xs font-medium ${isIncome ? "text-pigmoney-income" : "text-pigmoney-expense"}`}
              >
                {isIncome ? "수입" : "지출"}
              </span>
            </div>
          )}
        />
      </div>

      {/* 날짜 선택 */}
      <div className="flex flex-col gap-1">
        <Controller
          name={`records.${index}.date`}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onSelect={(date) => field.onChange(date)}
                placeholder="날짜"
                className="w-[130px]"
              />
              {fieldState.error && (
                <Typography.Error>{fieldState.error.message}</Typography.Error>
              )}
            </>
          )}
        />
      </div>

      {/* 카테고리 */}
      <div className="w-[100px]">
        <FormSelect<CashRecordBatchSchemaType>
          name={`records.${index}.categoryId`}
          placeholder="카테고리"
        >
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
              {cat.name}
            </SelectItem>
          ))}
        </FormSelect>
      </div>

      {/* 내용 */}
      <div className="flex-1">
        <FormInput<CashRecordBatchSchemaType>
          name={`records.${index}.description`}
          placeholder="내용"
        />
      </div>

      {/* 금액 */}
      <div className="w-[120px]">
        <FormInput<CashRecordBatchSchemaType>
          name={`records.${index}.amount`}
          placeholder="금액"
          type="number"
        />
      </div>

      {/* 비고 */}
      <div className="w-[100px]">
        <FormInput<CashRecordBatchSchemaType>
          name={`records.${index}.note`}
          placeholder="비고"
        />
      </div>

      {/* 삭제 버튼 */}
      {showRemoveButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="mt-0.5 shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CashRecordRow;
