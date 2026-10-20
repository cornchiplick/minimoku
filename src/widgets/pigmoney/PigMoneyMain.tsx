"use client";

import {
  CashRecordInterface,
  CategoryInterface,
  PigMoneySettingsInterface,
} from "@/entities/pigmoney/types";
import useCashRecordAction from "@/features/pigmoney/model/hooks/useCashRecordAction";
import useCashRecordFilter from "@/features/pigmoney/model/hooks/useCashRecordFilter";
import useInlineCashRecord from "@/features/pigmoney/model/hooks/useInlineCashRecord";
import {getCashRecords} from "@/features/pigmoney/model/services/cashRecords.service";
import {useCashRecordStore} from "@/features/pigmoney/model/store/cashRecordStore";
import CashRecordFormModal from "@/features/pigmoney/ui/CashRecordFormModal";
import CashRecordLedger from "@/features/pigmoney/ui/CashRecordLedger";
import {Button} from "@/shared/components/atoms/button";
import {DatePicker} from "@/shared/components/atoms/date-picker";
import {
  getCustomMonthRange,
  getCustomMonthRangeFor,
  getNextCustomMonthRange,
  getPrevCustomMonthRange,
  toDateString,
} from "@/shared/lib/utils/dateUtils";
import {ChevronLeft, ChevronRight, Minus, Plus} from "lucide-react";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {FormProvider} from "react-hook-form";
import {toast} from "sonner";

interface PigMoneyMainProps {
  initialRecords: CashRecordInterface[];
  initialCategories: CategoryInterface[];
  initialSettings: PigMoneySettingsInterface;
}

// PigMoney 메인 위젯 (서브 헤더 + 카드 리스트)
const PigMoneyMain = ({initialRecords, initialCategories, initialSettings}: PigMoneyMainProps) => {
  const {setRecords, setCategories, setDateRange, setSettings, dateRange, categories, settings} =
    useCashRecordStore();
  const {incomeRecords, expenseRecords, totalIncome, totalExpense} = useCashRecordFilter();
  const {onDeleteRecord} = useCashRecordAction();
  const {
    expenseForm,
    incomeForm,
    appendRow,
    removeRow,
    loadRecords,
    save,
  } = useInlineCashRecord();

  // 입력/수정 모달 상태 (목록은 읽기 전용, 쓰기는 모달에서만 일어난다)
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    type: "INCOME" | "EXPENSE";
    index: number | null;
  }>({open: false, mode: "create", type: "EXPENSE", index: null});
  const [isSaving, setIsSaving] = useState(false);
  const isInitializedRef = useRef(false);

  // 첫 마운트 시에만 records + dateRange 초기화
  // (서버 컴포넌트 재렌더 시 dateRange 가 초기화되지 않도록 방지)
  useEffect(() => {
    if (!isInitializedRef.current) {
      setRecords(initialRecords);
      // 설정된 월 시작일 기준으로 기본 조회 기간 세팅
      const {from, to} = getCustomMonthRange(initialSettings.monthStartDay);
      setDateRange({from, to});
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

  // 현재 조회 중인 월 레이블 (예: "1월", "2월")
  const currentMonthLabel = useMemo(() => {
    if (!dateRange.from || !settings) return "";
    const {label} = getCustomMonthRangeFor(dateRange.from, settings.monthStartDay);
    return label;
  }, [dateRange.from, settings]);

  // 검색 실행
  const handleSearch = useCallback(async () => {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (dateRange.from && dateRange.to) {
        params.fromDate = toDateString(dateRange.from);
        params.toDate = toDateString(dateRange.to);
      }
      const records = await getCashRecords({params});
      setRecords(records);
    } catch {
      toast.error("조회에 실패했습니다.");
    }
  }, [dateRange, setRecords]);

  // DatePicker에서 시작일 변경 시 자동 검색 (시작일 > 종료일이면 종료일을 자동 보정)
  const handleDateFromChange = useCallback(
    async (date: Date | undefined) => {
      const newFrom = date ?? null;
      let newTo = dateRange.to;

      // 시작일이 종료일보다 이후면 종료일을 시작일과 동일하게 보정
      if (newFrom && newTo && newFrom > newTo) {
        newTo = newFrom;
        toast.warning("종료일이 시작일에 맞춰 변경되었습니다.");
      }

      setDateRange({from: newFrom, to: newTo});
      if (newFrom && newTo) {
        try {
          const records = await getCashRecords({
            params: {fromDate: toDateString(newFrom), toDate: toDateString(newTo)},
          });
          setRecords(records);
        } catch {
          toast.error("조회에 실패했습니다.");
        }
      }
    },
    [dateRange.to, setDateRange, setRecords],
  );

  // DatePicker에서 종료일 변경 시 자동 검색
  const handleDateToChange = useCallback(
    async (date: Date | undefined) => {
      const newFrom = dateRange.from;
      const newTo = date ?? null;
      setDateRange({from: newFrom, to: newTo});
      if (newFrom && newTo) {
        try {
          const records = await getCashRecords({
            params: {fromDate: toDateString(newFrom), toDate: toDateString(newTo)},
          });
          setRecords(records);
        } catch {
          toast.error("조회에 실패했습니다.");
        }
      }
    },
    [dateRange.from, setDateRange, setRecords],
  );

  // 이전 달로 이동 + 자동 검색
  const handlePrevMonth = useCallback(async () => {
    if (!dateRange.from || !settings) return;
    const {from, to} = getPrevCustomMonthRange(dateRange.from, settings.monthStartDay);
    setDateRange({from, to});
    try {
      const records = await getCashRecords({
        params: {fromDate: toDateString(from), toDate: toDateString(to)},
      });
      setRecords(records);
    } catch {
      toast.error("조회에 실패했습니다.");
    }
  }, [dateRange.from, settings, setDateRange, setRecords]);

  // 다음 달로 이동 + 자동 검색
  const handleNextMonth = useCallback(async () => {
    if (!dateRange.to || !settings) return;
    const {from, to} = getNextCustomMonthRange(dateRange.to, settings.monthStartDay);
    setDateRange({from, to});
    try {
      const records = await getCashRecords({
        params: {fromDate: toDateString(from), toDate: toDateString(to)},
      });
      setRecords(records);
    } catch {
      toast.error("조회에 실패했습니다.");
    }
  }, [dateRange.to, settings, setDateRange, setRecords]);

  // 저장 (신규 추가 + 기존 수정 일괄 처리)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await save(modal.type);
      if (result?.success) {
        await handleSearch();
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

  // 수정: 폼 배열에서 해당 거래의 위치를 찾아 모달을 연다
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
  const balance = totalIncome - totalExpense;

  return (
    <div className="bg-background-primary flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="border-border shrink-0 border-b">
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
          {/* 월 이동 */}
          <div className="flex items-center justify-between pt-5 pb-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="이전 달"
              className="text-minimoku-neutral-bold hover:bg-background-secondary focus-visible:ring-pigmoney-brand rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-foreground text-lg font-semibold tracking-tight">
              {currentMonthLabel}
            </h1>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="다음 달"
              className="text-minimoku-neutral-bold hover:bg-background-secondary focus-visible:ring-pigmoney-brand rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* 합계 — 이 화면에서 가장 크게 읽혀야 할 숫자 */}
          <div className="flex items-end justify-between gap-6 pt-3 pb-5">
            <div>
              <p className="text-minimoku-neutral-bold text-xs">남은 돈</p>
              <p className="text-foreground text-hero font-bold tabular-nums">
                {balance < 0 ? "−" : ""}
                {Math.abs(balance).toLocaleString("ko-KR")}
              </p>
            </div>
            <dl className="flex shrink-0 gap-6 pb-1.5 text-right">
              <div>
                <dt className="text-minimoku-neutral-bold text-xs">수입</dt>
                <dd className="text-pigmoney-income text-sm font-semibold tabular-nums">
                  +{totalIncome.toLocaleString("ko-KR")}
                </dd>
              </div>
              <div>
                <dt className="text-minimoku-neutral-bold text-xs">지출</dt>
                <dd className="text-foreground text-sm font-semibold tabular-nums">
                  −{totalExpense.toLocaleString("ko-KR")}
                </dd>
              </div>
            </dl>
          </div>

          {/* 기간 직접 선택 + 추가 */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
            <div className="flex items-center gap-1.5">
              <DatePicker
                selected={dateRange.from}
                onSelect={handleDateFromChange}
                placeholder="시작일"
              />
              <span className="text-minimoku-neutral-bold text-sm">—</span>
              <DatePicker
                selected={dateRange.to}
                onSelect={handleDateToChange}
                placeholder="종료일"
                minDate={dateRange.from ?? undefined}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCreate("INCOME")}
                className="cursor-pointer">
                <Plus className="mr-1 h-4 w-4" />
                수입
              </Button>
              <Button size="sm" onClick={() => openCreate("EXPENSE")} className="cursor-pointer">
                <Minus className="mr-1 h-4 w-4" />
                지출
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 장부 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <CashRecordLedger records={[...expenseRecords, ...incomeRecords]} onSelect={openEdit} />
      </div>

      {/* 입력/수정 모달 — 선택된 종류의 폼만 연결한다 */}
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
