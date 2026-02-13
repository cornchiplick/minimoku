import { deleteCashRecord } from "@/features/pigmoney/model/services/cashRecords.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { useDialogContext } from "@/shared/providers/DialogProvider";
import { useCallback } from "react";
import { toast } from "sonner";

const useCashRecordAction = () => {
  const { showDialog } = useDialogContext();
  const { removeRecord, invalidateSummary } = useCashRecordStore();

  // 거래 삭제
  const onDeleteRecord = useCallback(
    async ({ id }: { id: number }) => {
      const ok = await showDialog("해당 거래를 정말 삭제하시겠습니까?", {
        variant: "confirm",
      });
      if (!ok) return;

      // 낙관적 업데이트
      removeRecord(id);

      const result = await deleteCashRecord({ recordId: id });
      if (result.error) {
        toast.error("거래 삭제에 실패했습니다.");
      } else {
        toast.success("거래가 삭제되었습니다.");
        invalidateSummary();
      }
    },
    [showDialog, removeRecord, invalidateSummary],
  );

  return {
    onDeleteRecord,
  };
};

export default useCashRecordAction;
