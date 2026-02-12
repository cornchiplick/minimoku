import { CashRecordInterface, CashRecordType } from "@/entities/pigmoney/types";
import {
  postCashRecords,
  updateCashRecord,
} from "@/features/pigmoney/model/services/cashRecords.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { useCallback, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

// 인라인 편집용 행 타입
export interface InlineRowValues {
  _id?: number; // 기존 거래의 DB id (새 행은 undefined)
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryId: string;
  description: string;
  amount: string;
  note: string;
}

export interface InlineBatchForm {
  records: InlineRowValues[];
}

// 새 행 기본값 생성 (날짜는 오늘 0시로 정규화)
const getDefaultRow = (type: "INCOME" | "EXPENSE"): InlineRowValues => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return {
  _id: undefined,
  type,
    date: today,
  categoryId: "",
  description: "",
  amount: "",
  note: "",
  };
};

// 기존 거래를 인라인 행 형태로 변환
const recordToRow = (record: CashRecordInterface): InlineRowValues => ({
  _id: record.id,
  type: record.type,
  date: new Date(record.date),
  categoryId: String(record.categoryId),
  description: record.description,
  amount: String(record.amount),
  note: record.note || "",
});

// 변경 여부 비교
const isRowChanged = (current: InlineRowValues, original: InlineRowValues): boolean => {
  return (
    current.description !== original.description ||
    current.amount !== original.amount ||
    current.categoryId !== original.categoryId ||
    current.note !== original.note ||
    new Date(current.date).toDateString() !== new Date(original.date).toDateString()
  );
};

// 필수값 충족 여부 (날짜, 사용내역, 금액, 분류)
const isRowComplete = (row: InlineRowValues): boolean => {
  return !!(row.date && row.description.trim() && row.amount && row.categoryId);
};

// 인라인 거래 편집 훅
const useInlineCashRecord = () => {
  const { invalidateSummary } = useCashRecordStore();

  // 지출 탭 폼
  const expenseForm = useForm<InlineBatchForm>({
    defaultValues: { records: [] },
  });
  const expenseFieldArray = useFieldArray({
    control: expenseForm.control,
    name: "records",
  });

  // 수입 탭 폼
  const incomeForm = useForm<InlineBatchForm>({
    defaultValues: { records: [] },
  });
  const incomeFieldArray = useFieldArray({
    control: incomeForm.control,
    name: "records",
  });

  // 원본 스냅샷 (변경 감지용)
  const expenseOriginalRef = useRef<Map<number, InlineRowValues>>(new Map());
  const incomeOriginalRef = useRef<Map<number, InlineRowValues>>(new Map());

  // 기존 records를 폼에 로드
  const loadRecords = useCallback(
    (records: CashRecordInterface[]) => {
      const expenseRows = records
        .filter((r) => r.type === CashRecordType.EXPENSE)
        .map(recordToRow);
      const incomeRows = records
        .filter((r) => r.type === CashRecordType.INCOME)
        .map(recordToRow);

      // 기존 입력 중인 새 행(미저장)을 보존
      const currentExpense = expenseForm.getValues("records");
      const newExpenseRows = currentExpense.filter((r) => !r._id);
      expenseForm.reset({ records: [...expenseRows, ...newExpenseRows] });

      const currentIncome = incomeForm.getValues("records");
      const newIncomeRows = currentIncome.filter((r) => !r._id);
      incomeForm.reset({ records: [...incomeRows, ...newIncomeRows] });

      // 원본 스냅샷 저장
      expenseOriginalRef.current = new Map(
        expenseRows.filter((r) => r._id).map((r) => [r._id!, { ...r }]),
      );
      incomeOriginalRef.current = new Map(
        incomeRows.filter((r) => r._id).map((r) => [r._id!, { ...r }]),
      );
    },
    [expenseForm, incomeForm],
  );

  // 행 추가
  const appendRow = useCallback(
    (type: "INCOME" | "EXPENSE") => {
      const fieldArray = type === "EXPENSE" ? expenseFieldArray : incomeFieldArray;
      fieldArray.append(getDefaultRow(type));
    },
    [expenseFieldArray, incomeFieldArray],
  );

  // 행 제거 (새 행만)
  const removeRow = useCallback(
    (type: "INCOME" | "EXPENSE", index: number) => {
      const fieldArray = type === "EXPENSE" ? expenseFieldArray : incomeFieldArray;
      fieldArray.remove(index);
    },
    [expenseFieldArray, incomeFieldArray],
  );

  // 저장 (신규 + 수정 일괄 처리)
  const save = useCallback(
    async (type: "INCOME" | "EXPENSE") => {
      const form = type === "EXPENSE" ? expenseForm : incomeForm;
      const originalRef = type === "EXPENSE" ? expenseOriginalRef : incomeOriginalRef;
      const allRows = form.getValues("records");

      // 신규 행 (필수값 충족한 것만)
      const newRows = allRows.filter((row) => !row._id && isRowComplete(row));

      // 수정된 기존 행
      const updatedRows = allRows.filter((row) => {
        if (!row._id) return false;
        const original = originalRef.current.get(row._id);
        if (!original) return false;
        return isRowChanged(row, original);
      });

      if (newRows.length === 0 && updatedRows.length === 0) {
        toast.info("변경사항이 없습니다.");
        return null;
      }

      const results: string[] = [];

      // 신규 행 일괄 생성
      if (newRows.length > 0) {
        const formData = new FormData();
        formData.append("records", JSON.stringify(newRows));
        const result = await postCashRecords(formData);

        if (result && "_form" in result) {
          toast.error(result._form as string);
          return null;
        }
        results.push(`${newRows.length}건 추가`);
      }

      // 수정된 행 개별 업데이트
      if (updatedRows.length > 0) {
        let updateCount = 0;
        for (const row of updatedRows) {
          const formData = new FormData();
          formData.append("recordId", String(row._id));
          formData.append("type", row.type);
          formData.append("date", new Date(row.date).toISOString());
          formData.append("categoryId", row.categoryId);
          formData.append("description", row.description);
          formData.append("amount", row.amount);
          formData.append("note", row.note ?? "");

          const result = await updateCashRecord(formData);
          if (result && "success" in result) {
            updateCount++;
          }
        }
        if (updateCount > 0) {
          results.push(`${updateCount}건 수정`);
        }
      }

      if (results.length > 0) {
        toast.success(results.join(", ") + " 완료");
        invalidateSummary();
      }

      return { success: true };
    },
    [expenseForm, incomeForm, invalidateSummary],
  );

  // 미저장 새 행 개수
  const pendingCount =
    expenseFieldArray.fields.filter((_, i) => !expenseForm.getValues(`records.${i}._id`)).length +
    incomeFieldArray.fields.filter((_, i) => !incomeForm.getValues(`records.${i}._id`)).length;

  return {
    expenseForm,
    incomeForm,
    expenseFields: expenseFieldArray.fields,
    incomeFields: incomeFieldArray.fields,
    appendRow,
    removeRow,
    loadRecords,
    save,
    pendingCount,
  };
};

export default useInlineCashRecord;
