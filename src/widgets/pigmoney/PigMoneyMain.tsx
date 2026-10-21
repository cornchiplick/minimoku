"use client";

import {
  CashRecordInterface,
  CategoryInterface,
  PigMoneySettingsInterface,
} from "@/entities/pigmoney/types";
import useCashRecordAction from "@/features/pigmoney/model/hooks/useCashRecordAction";
import useCashRecordFilter from "@/features/pigmoney/model/hooks/useCashRecordFilter";
import useInlineCashRecord from "@/features/pigmoney/model/hooks/useInlineCashRecord";
import useLedgerPeriod from "@/features/pigmoney/model/hooks/useLedgerPeriod";
import {useCashRecordStore} from "@/features/pigmoney/model/store/cashRecordStore";
import CashRecordFormModal from "@/features/pigmoney/ui/CashRecordFormModal";
import CashRecordLedger from "@/features/pigmoney/ui/CashRecordLedger";
import LedgerHeader from "@/features/pigmoney/ui/LedgerHeader";
import {getCustomMonthRange} from "@/shared/lib/utils/dateUtils";
import {useEffect, useRef, useState} from "react";
import {FormProvider} from "react-hook-form";

interface PigMoneyMainProps {
  initialRecords: CashRecordInterface[];
  initialCategories: CategoryInterface[];
  initialSettings: PigMoneySettingsInterface;
}

/**
 * PigMoney 쓰기 화면.
 *
 * 조회와 입력을 분리해 두었다 — 목록(CashRecordLedger)은 읽기 전용이고, 쓰기는
 * 모달에서만 일어난다. 기간을 다루는 일은 useLedgerPeriod 가, 머리말은
 * LedgerHeader 가 맡고, 여기는 둘을 엮고 입력 모달의 상태만 들고 있는다.
 */
const PigMoneyMain = ({initialRecords, initialCategories, initialSettings}: PigMoneyMainProps) => {
  const {setRecords, setCategories, setDateRange, setSettings, categories} = useCashRecordStore();
  const {incomeRecords, expenseRecords, totalIncome, totalExpense} = useCashRecordFilter();
  const {onDeleteRecord} = useCashRecordAction();
  const {expenseForm, incomeForm, appendRow, removeRow, loadRecords, save} = useInlineCashRecord();
  const {dateRange, monthLabel, selectFrom, selectTo, goPrevMonth, goNextMonth, reload} =
    useLedgerPeriod();

  // 입력/수정 모달 상태
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    type: "INCOME" | "EXPENSE";
    index: number | null;
  }>({open: false, mode: "create", type: "EXPENSE", index: null});
  const [isSaving, setIsSaving] = useState(false);
  const isInitializedRef = useRef(false);

  // 첫 마운트 시에만 records + dateRange 초기화
  // (서버 컴포넌트가 다시 그려져도 보고 있던 기간이 되돌아가지 않도록)
  useEffect(() => {
    if (!isInitializedRef.current) {
      setRecords(initialRecords);
      const {from, to} = getCustomMonthRange(initialSettings.monthStartDay);
      setDateRange({from, to});
      isInitializedRef.current = true;
    }
    // 카테고리·설정은 항상 최신 서버 값으로 맞춘다
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

  // 목록이 바뀌면 입력 폼에도 실어 둔다 (수정 모달이 같은 폼을 쓴다)
  useEffect(() => {
    loadRecords([...expenseRecords, ...incomeRecords]);
  }, [expenseRecords, incomeRecords, loadRecords]);

  // 저장 (새로 추가한 행 + 고친 행을 한 번에)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await save(modal.type);
      if (result?.success) {
        await reload();
        setModal((prev) => ({...prev, open: false}));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 추가: 빈 행 하나를 만들고 모달을 연다
  const openCreate = (type: "INCOME" | "EXPENSE") => {
    appendRow(type);
    setModal({open: true, mode: "create", type, index: null});
  };

  // 수정: 폼 배열에서 그 거래의 자리를 찾아 모달을 연다
  const openEdit = (record: CashRecordInterface) => {
    const form = record.type === "EXPENSE" ? expenseForm : incomeForm;
    const rows = form.getValues("records") ?? [];
    const index = rows.findIndex((row) => row._id === record.id);
    if (index < 0) return;
    setModal({open: true, mode: "edit", type: record.type, index});
  };

  const handleRemoveRow = (index: number, isNew: boolean) => {
    if (isNew) {
      removeRow(modal.type, index);
      return;
    }
    const form = modal.type === "EXPENSE" ? expenseForm : incomeForm;
    const row = form.getValues(`records.${index}`);
    if (row?._id) {
      onDeleteRecord({id: row._id});
      setModal((prev) => ({...prev, open: false}));
    }
  };

  const activeForm = modal.type === "EXPENSE" ? expenseForm : incomeForm;

  return (
    <div className="bg-background-primary flex min-h-0 flex-1 flex-col overflow-hidden">
      <LedgerHeader
        monthLabel={monthLabel}
        balance={totalIncome - totalExpense}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        dateRange={dateRange}
        onPrevMonth={goPrevMonth}
        onNextMonth={goNextMonth}
        onSelectFrom={selectFrom}
        onSelectTo={selectTo}
        onAdd={openCreate}
      />

      {/* 장부 — 읽기 전용 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CashRecordLedger records={[...expenseRecords, ...incomeRecords]} onSelect={openEdit} />
      </div>

      {/* 입력/수정 모달 — 고른 종류의 폼만 연결한다 */}
      <FormProvider {...activeForm}>
        <CashRecordFormModal
          open={modal.open}
          onOpenChange={(open) => setModal((prev) => ({...prev, open}))}
          mode={modal.mode}
          editIndex={modal.index}
          type={modal.type}
          categories={categories}
          isSaving={isSaving}
          onAppendRow={() => appendRow(modal.type)}
          onRemoveRow={handleRemoveRow}
          onSave={handleSave}
        />
      </FormProvider>
    </div>
  );
};

export default PigMoneyMain;
