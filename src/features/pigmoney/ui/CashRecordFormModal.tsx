"use client";

import { CategoryInterface } from "@/entities/pigmoney/types";
import {
  cashRecordBatchSchema,
  CashRecordBatchSchemaType,
} from "@/features/pigmoney/model/schema/cashRecordBatchSchema";
import { postCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import CashRecordRow from "./CashRecordRow";
import { Button } from "@/shared/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import FormButton from "@/shared/components/molecules/buttons/FormButton";
import Typography from "@/shared/home/atomic/Typography";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CashRecordFormModalProps {
  modalState: ReturnType<typeof useBoolean>;
  categories: CategoryInterface[];
}

// 새 행의 기본값
const getDefaultRow = () => ({
  type: "EXPENSE" as const,
  date: new Date(),
  categoryId: "",
  description: "",
  amount: "",
  note: "",
});

// 거래 작성 모달 (다중 행)
const CashRecordFormModal = ({ modalState, categories }: CashRecordFormModalProps) => {
  const formMethods = useForm<CashRecordBatchSchemaType>({
    resolver: zodResolver(cashRecordBatchSchema),
    defaultValues: {
      records: [getDefaultRow()],
    },
  });

  const { control, reset, setError, handleSubmit, formState: { errors } } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "records",
  });

  // 행 추가
  const handleAddRow = () => {
    append(getDefaultRow());
  };

  // 모달 닫기 및 초기화
  const handleClose = () => {
    reset({ records: [getDefaultRow()] });
    setTimeout(() => {
      modalState.onFalse();
    }, 0);
  };

  // 저장
  const onSubmit = async (data: CashRecordBatchSchemaType) => {
    const formData = new FormData();
    formData.append("records", JSON.stringify(data.records));

    const result = await postCashRecords(formData);

    if (result && "error" in result) {
      toast.error("저장에 실패했습니다.");
      return;
    }

    if (result && "_form" in result) {
      setError("root", { message: result._form as string });
      return;
    }

    if (result && "fieldErrors" in result) {
      toast.error("입력값을 확인해주세요.");
      return;
    }

    toast.success("저장되었습니다.");
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
          className="bg-background-tertiary max-w-4xl max-h-[80vh] overflow-y-auto p-5"
          disableEscapeClose
          disableOutsideClose
          hideCloseButton
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>
                <Typography.Head3>거래 추가</Typography.Head3>
              </DialogTitle>
            </DialogHeader>

            {/* 폼 전체 에러 */}
            {errors.root && (
              <div className="rounded-md bg-pigmoney-expense/10 p-3 text-sm text-pigmoney-expense">
                {errors.root.message}
              </div>
            )}

            {/* 거래 행 목록 */}
            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <CashRecordRow
                  key={field.id}
                  index={index}
                  categories={categories}
                  onRemove={() => remove(index)}
                  showRemoveButton={fields.length > 1}
                />
              ))}
            </div>

            {/* 행 추가 버튼 */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRow}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              행 추가
            </Button>

            <DialogFooter>
              <FormButton type="submit" className="cursor-pointer">
                <Typography.P1 className="text-foreground-reverse">저장</Typography.P1>
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

export default CashRecordFormModal;
