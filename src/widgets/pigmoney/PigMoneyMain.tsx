"use client";

import {
  CashRecordInterface,
  CategoryInterface,
  PigMoneySettingsInterface,
} from "@/entities/pigmoney/types";
import useCashRecordAction from "@/features/pigmoney/model/hooks/useCashRecordAction";
import useCashRecordFilter from "@/features/pigmoney/model/hooks/useCashRecordFilter";
import useInlineCashRecord from "@/features/pigmoney/model/hooks/useInlineCashRecord";
import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import CashRecordInputCard from "@/features/pigmoney/ui/CashRecordInputCard";
import { Button } from "@/shared/components/atoms/button";
import { DatePicker } from "@/shared/components/atoms/date-picker";
import { Switch } from "@/shared/components/atoms/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { DEFAULT_DATE_RANGE_DAYS } from "@/shared/constants/pigmoney";
import { getDateRange, toDateString } from "@/shared/lib/utils/dateUtils";
import { Loader2, Plus, Save, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { InlineBatchForm } from "@/features/pigmoney/model/hooks/useInlineCashRecord";

interface PigMoneyMainProps {
  initialRecords: CashRecordInterface[];
  initialCategories: CategoryInterface[];
  initialSettings: PigMoneySettingsInterface;
}

// PigMoney 메인 위젯 (서브 헤더 + 카드 리스트)
const PigMoneyMain = ({
  initialRecords,
  initialCategories,
  initialSettings,
}: PigMoneyMainProps) => {
  const {
    setRecords,
    setCategories,
    setDateRange,
    setSettings,
    dateRange,
    showAll,
    setShowAll,
    categories,
  } = useCashRecordStore();
  const { incomeRecords, expenseRecords, totalIncome, totalExpense } = useCashRecordFilter();
  const { onDeleteRecord } = useCashRecordAction();
  const {
    expenseForm,
    incomeForm,
    expenseFields,
    incomeFields,
    appendRow,
    removeRow,
    loadRecords,
    save,
  } = useInlineCashRecord();

  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [isSaving, setIsSaving] = useState(false);
  const isInitializedRef = useRef(false);

  // 첫 마운트 시에만 records + dateRange 초기화
  // (revalidateTag로 서버 컴포넌트 재렌더 시 dateRange 리셋 방지)
  useEffect(() => {
    if (!isInitializedRef.current) {
      setRecords(initialRecords);
      const { from, to } = getDateRange(DEFAULT_DATE_RANGE_DAYS);
      setDateRange({ from, to });
      isInitializedRef.current = true;
    }
    // 카테고리/설정은 항상 최신 서버 값으로 업데이트
    setCategories(initialCategories);
    setSettings(initialSettings);
  }, [
    initialRecords,
    initialCategories,
    initialSettings,
    setRecords,
    setCategories,
    setSettings,
    setDateRange,
  ]);

  // records가 변경되면 인라인 폼에 로드
  useEffect(() => {
    loadRecords([...expenseRecords, ...incomeRecords]);
  }, [expenseRecords, incomeRecords, loadRecords]);

  // 검색 실행
  const handleSearch = useCallback(async () => {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (!showAll && dateRange.from && dateRange.to) {
        params.fromDate = toDateString(dateRange.from);
        params.toDate = toDateString(dateRange.to);
      }
      const records = await getCashRecords({ params });
      setRecords(records);
    } catch {
      toast.error("조회에 실패했습니다.");
    }
  }, [showAll, dateRange, setRecords]);

  // 저장 (신규 추가 + 기존 수정 일괄 처리)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const type = activeTab === "expense" ? "EXPENSE" : "INCOME";
      const result = await save(type);
      if (result?.success) {
        await handleSearch();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "expense" | "income")}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* 서브 헤더: 탭 + 필터 + 액션 */}
        <div className="bg-background-primary flex flex-wrap items-center gap-3 border-b px-6 py-3">
          {/* 지출/수입 탭 */}
          <TabsList>
            <TabsTrigger value="expense">지출 ({expenseRecords.length})</TabsTrigger>
            <TabsTrigger value="income">수입 ({incomeRecords.length})</TabsTrigger>
          </TabsList>

          {/* 날짜 구간 */}
          <div className="flex items-center gap-2">
            <DatePicker
              selected={dateRange.from}
              onSelect={(date) => setDateRange({ ...dateRange, from: date ?? null })}
              placeholder="시작일"
              disabled={showAll}
            />
            <span className="text-minimoku-neutral-bold">—</span>
            <DatePicker
              selected={dateRange.to}
              onSelect={(date) => setDateRange({ ...dateRange, to: date ?? null })}
              placeholder="종료일"
              disabled={showAll}
            />
          </div>

          {/* 전체 토글 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-minimoku-neutral-bold">전체</span>
            <Switch checked={showAll} onCheckedChange={setShowAll} />
          </div>

          {/* 검색 */}
          <Button onClick={handleSearch} variant="outline" size="sm" className="cursor-pointer">
            <Search className="mr-1 h-3.5 w-3.5" />
            검색
          </Button>

          {/* 저장하기 (우측 정렬) */}
          <div className="ml-auto">
            <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">
              {isSaving ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1 h-4 w-4" />
              )}
              저장하기
            </Button>
          </div>
        </div>

        {/* 지출 카드 리스트 */}
        <TabsContent value="expense" className="mt-0 flex-1 overflow-y-auto">
          <FormProvider {...expenseForm}>
            <RecordCardList
              fields={expenseFields}
              total={totalExpense}
              totalLabel="지출 합계"
              type="EXPENSE"
              categories={categories}
              onAppendRow={() => appendRow("EXPENSE")}
              onRemoveRow={(index, isNew) => {
                if (isNew) {
                  removeRow("EXPENSE", index);
                } else {
                  const row = expenseForm.getValues(`records.${index}`);
                  if (row._id) onDeleteRecord({ id: row._id });
                }
              }}
            />
          </FormProvider>
        </TabsContent>

        {/* 수입 카드 리스트 */}
        <TabsContent value="income" className="mt-0 flex-1 overflow-y-auto">
          <FormProvider {...incomeForm}>
            <RecordCardList
              fields={incomeFields}
              total={totalIncome}
              totalLabel="수입 합계"
              type="INCOME"
              categories={categories}
              onAppendRow={() => appendRow("INCOME")}
              onRemoveRow={(index, isNew) => {
                if (isNew) {
                  removeRow("INCOME", index);
                } else {
                  const row = incomeForm.getValues(`records.${index}`);
                  if (row._id) onDeleteRecord({ id: row._id });
                }
              }}
            />
          </FormProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// 거래 카드 리스트 컴포넌트
interface RecordCardListProps {
  fields: { id: string }[];
  total: number;
  totalLabel: string;
  type: "INCOME" | "EXPENSE";
  categories: CategoryInterface[];
  onAppendRow: () => void;
  onRemoveRow: (index: number, isNew: boolean) => void;
}

const RecordCardList = ({
  fields,
  total,
  totalLabel,
  type,
  categories,
  onAppendRow,
  onRemoveRow,
}: RecordCardListProps) => {
  const isExpense = type === "EXPENSE";

  return (
    <div className="flex flex-col gap-3 p-6">
      {/* 카드 목록 */}
      {fields.length === 0 ? (
        <div className="py-12 text-center text-sm text-minimoku-neutral-bold">
          {isExpense ? "지출" : "수입"} 내역이 없습니다. 아래 버튼으로 추가해보세요.
        </div>
      ) : (
        fields.map((field, index) => {
          // _id 존재 여부로 신규/기존 구분 (useFormContext 없이 접근 불가하므로 field 기반)
          return (
            <CashRecordInputCardWrapper
              key={field.id}
              index={index}
              categories={categories}
              onRemoveRow={onRemoveRow}
            />
          );
        })
      )}

      {/* "+" 행 추가 버튼 */}
      <button
        type="button"
        onClick={onAppendRow}
        className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-minimoku-neutral-bold py-3 text-sm text-minimoku-neutral-bold transition-colors hover:border-pigmoney-brand hover:bg-pigmoney-brand/5 hover:text-pigmoney-brand"
      >
        <Plus className="h-4 w-4" />
      </button>

      {/* 합계 */}
      <div className="flex items-center justify-between border-t-2 pt-3">
        <span className="text-sm font-medium">{totalLabel}</span>
        <span
          className={`text-sm font-semibold ${
            isExpense ? "text-pigmoney-expense" : "text-pigmoney-income"
          }`}
        >
          {total.toLocaleString()} 원
        </span>
      </div>
    </div>
  );
};

// CashRecordInputCard를 감싸는 래퍼 (useFormContext로 _id 접근)
interface CashRecordInputCardWrapperProps {
  index: number;
  categories: CategoryInterface[];
  onRemoveRow: (index: number, isNew: boolean) => void;
}

const CashRecordInputCardWrapper = ({
  index,
  categories,
  onRemoveRow,
}: CashRecordInputCardWrapperProps) => {
  const { watch } = useFormContext<InlineBatchForm>();
  const _id = watch(`records.${index}._id`);
  const isNew = !_id;

  return (
    <CashRecordInputCard
      index={index}
      categories={categories}
      isNew={isNew}
      onRemove={() => onRemoveRow(index, isNew)}
    />
  );
};

export default PigMoneyMain;
