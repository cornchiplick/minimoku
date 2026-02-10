"use client";

import { CashRecordInterface, CategoryInterface } from "@/entities/pigmoney/types";
import {
  cashRecordSchema,
  CashRecordSchemaType,
} from "@/features/pigmoney/model/schema/cashRecordSchema";
import { updateCashRecord } from "@/features/pigmoney/model/services/cashRecords.service";
import { Button } from "@/shared/components/atoms/button";
import { DatePicker } from "@/shared/components/atoms/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import { SelectItem } from "@/shared/components/atoms/select";
import { Switch } from "@/shared/components/atoms/switch";
import FormButton from "@/shared/components/molecules/buttons/FormButton";
import FormInput from "@/shared/components/molecules/FormInput";
import FormSelect from "@/shared/components/molecules/FormSelect";
import Typography from "@/shared/home/atomic/Typography";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CashRecordEditModalProps {
  modalState: ReturnType<typeof useBoolean>;
  categories: CategoryInterface[];
  originValue?: CashRecordInterface;
}

// 거래 수정 모달 (단일 행)
const CashRecordEditModal = ({
  modalState,
  categories,
  originValue,
}: CashRecordEditModalProps) => {
  const formMethods = useForm<CashRecordSchemaType>({
    resolver: zodResolver(cashRecordSchema),
  });

  const { control, reset, setError, handleSubmit, watch, formState: { errors } } = formMethods;
  const type = watch("type");
  const isIncome = type === "INCOME";

  // 모달 열릴 때 기존 값으로 초기화
  useEffect(() => {
    if (modalState.value && originValue) {
      reset({
        type: originValue.type,
        date: new Date(originValue.date),
        categoryId: String(originValue.categoryId),
        description: originValue.description,
        amount: String(originValue.amount),
        note: originValue.note || "",
      });
    }
  }, [modalState.value, originValue, reset]);

  const handleClose = () => {
    reset();
    setTimeout(() => {
      modalState.onFalse();
    }, 0);
  };

  const onSubmit: SubmitHandler<CashRecordSchemaType> = async (data) => {
    if (!originValue) return;

    const formData = new FormData();
    formData.append("recordId", String(originValue.id));
    formData.append("type", data.type);
    formData.append("date", new Date(data.date).toISOString());
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description);
    formData.append("amount", data.amount);
    formData.append("note", data.note ?? "");

    const result = await updateCashRecord(formData);

    if (result) {
      if ("fieldErrors" in result) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof CashRecordSchemaType, { message: messages[0] });
          }
        });
        return;
      }

      if ("_form" in result) {
        setError("root", { message: result._form as string });
        return;
      }
    }

    toast.success("수정되었습니다.");
    handleClose();
  };

  return (
    <Dialog
      open={modalState.value}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      modal={true}
    >
      <FormProvider {...formMethods}>
        <DialogContent
          className="bg-background-tertiary max-w-2xl p-5"
          disableEscapeClose
          disableOutsideClose
          hideCloseButton
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>
                <Typography.Head3>거래 수정</Typography.Head3>
              </DialogTitle>
            </DialogHeader>

            {errors.root && (
              <div className="rounded-md bg-pigmoney-expense/10 p-3 text-sm text-pigmoney-expense">
                {errors.root.message}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* 수입/지출 토글 */}
              <div className="flex items-center gap-3">
                <Typography.P2 className="font-medium">유형</Typography.P2>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value === "INCOME"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "INCOME" : "EXPENSE")
                        }
                      />
                      <span
                        className={`text-sm font-medium ${isIncome ? "text-pigmoney-income" : "text-pigmoney-expense"}`}
                      >
                        {isIncome ? "수입" : "지출"}
                      </span>
                    </div>
                  )}
                />
              </div>

              {/* 날짜 */}
              <div className="flex flex-col gap-2">
                <Typography.P2 className="font-medium">날짜</Typography.P2>
                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onSelect={(date) => field.onChange(date)}
                      />
                      {fieldState.error && (
                        <Typography.Error>{fieldState.error.message}</Typography.Error>
                      )}
                    </>
                  )}
                />
              </div>

              {/* 카테고리 */}
              <FormSelect<CashRecordSchemaType>
                name="categoryId"
                label="카테고리"
                placeholder="카테고리를 선택하세요"
                registerOptions={{ required: "카테고리는 필수입니다." }}
              >
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </FormSelect>

              {/* 내용 */}
              <FormInput<CashRecordSchemaType>
                name="description"
                label="내용"
                placeholder="거래 내용을 입력하세요"
                registerOptions={{ required: "내용은 필수입니다." }}
              />

              {/* 금액 */}
              <FormInput<CashRecordSchemaType>
                name="amount"
                label="금액"
                type="number"
                placeholder="금액을 입력하세요"
                registerOptions={{ required: "금액은 필수입니다." }}
              />

              {/* 비고 */}
              <FormInput<CashRecordSchemaType>
                name="note"
                label="비고"
                placeholder="비고 (선택사항)"
              />
            </div>

            <DialogFooter>
              <FormButton type="submit" className="cursor-pointer">
                <Typography.P1 className="text-foreground-reverse">수정</Typography.P1>
              </FormButton>
              <Button
                type="button"
                variant="outline"
                className="border-background-reverse-primary cursor-pointer"
                onClick={handleClose}
              >
                <Typography.P1>취소</Typography.P1>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
};

export default CashRecordEditModal;
