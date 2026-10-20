"use client";

import {CategoryInterface} from "@/entities/pigmoney/types";
import {InlineBatchForm} from "@/features/pigmoney/model/hooks/useInlineCashRecord";
import CashRecordInputCard from "@/features/pigmoney/ui/CashRecordInputCard";
import {Button} from "@/shared/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/atoms/dialog";
import {Loader2, Plus} from "lucide-react";
import {useFormContext} from "react-hook-form";

interface CashRecordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "create" 는 아직 저장되지 않은 행들을, "edit" 는 editIndex 한 행만 보여준다 */
  mode: "create" | "edit";
  editIndex: number | null;
  type: "INCOME" | "EXPENSE";
  categories: CategoryInterface[];
  isSaving: boolean;
  onAppendRow: () => void;
  onRemoveRow: (index: number, isNew: boolean) => void;
  onSave: () => void;
}

/**
 * 거래 입력/수정 모달.
 *
 * 목록은 읽기 전용 장부로 두고, 쓰기는 이 모달에서만 일어난다.
 * 한 번에 여러 건을 적을 수 있던 기존 동작은 "행 추가"로 유지했다.
 */
const CashRecordFormModal = ({
  open,
  onOpenChange,
  mode,
  editIndex,
  type,
  categories,
  isSaving,
  onAppendRow,
  onRemoveRow,
  onSave,
}: CashRecordFormModalProps) => {
  const {watch} = useFormContext<InlineBatchForm>();
  const rows = watch("records") ?? [];

  // 추가 모드에서는 아직 저장되지 않은 행만, 수정 모드에서는 해당 행만 보여준다
  const visibleIndexes =
    mode === "edit"
      ? editIndex === null
        ? []
        : [editIndex]
      : rows.map((row, index) => (row?._id ? -1 : index)).filter((index) => index >= 0);

  const label = type === "EXPENSE" ? "지출" : "수입";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? `${label} 수정` : `${label} 추가`}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {visibleIndexes.map((index) => (
            <CashRecordInputCard
              key={index}
              index={index}
              categories={categories}
              isNew={!rows[index]?._id}
              onRemove={() => onRemoveRow(index, !rows[index]?._id)}
            />
          ))}

          {mode === "create" && (
            <button
              type="button"
              onClick={onAppendRow}
              className="border-border text-minimoku-neutral-bold hover:border-pigmoney-brand hover:text-pigmoney-brand rounded-card flex w-full cursor-pointer items-center justify-center gap-1.5 border border-dashed py-3 text-sm transition-colors">
              <Plus className="h-4 w-4" />행 추가
            </button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            취소
          </Button>
          <Button onClick={onSave} disabled={isSaving || visibleIndexes.length === 0}>
            {isSaving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CashRecordFormModal;
