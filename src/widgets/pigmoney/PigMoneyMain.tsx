"use client";

import { CashRecordInterface, CategoryInterface, PigMoneySettingsInterface } from "@/entities/pigmoney/types";
import useCashRecordFilter from "@/features/pigmoney/model/hooks/useCashRecordFilter";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import CashRecordAddButton from "@/features/pigmoney/ui/CashRecordAddButton";
import CashRecordEditModal from "@/features/pigmoney/ui/CashRecordEditModal";
import { Button } from "@/shared/components/atoms/button";
import { DatePicker } from "@/shared/components/atoms/date-picker";
import { Switch } from "@/shared/components/atoms/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { DEFAULT_DATE_RANGE_DAYS } from "@/shared/constants/pigmoney";
import { useBoolean } from "@/shared/hooks/useBoolean";
import { formatDate, getDateRange, toDateString } from "@/shared/lib/utils/dateUtils";
import { Edit, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import useCashRecordAction from "@/features/pigmoney/model/hooks/useCashRecordAction";

interface PigMoneyMainProps {
  initialRecords: CashRecordInterface[];
  initialCategories: CategoryInterface[];
  initialSettings: PigMoneySettingsInterface;
}

// PigMoney 메인 위젯 (서브 헤더 + 테이블 뷰)
const PigMoneyMain = ({ initialRecords, initialCategories, initialSettings }: PigMoneyMainProps) => {
  const { setRecords, setCategories, setDateRange, setSettings, dateRange, showAll, setShowAll, categories } =
    useCashRecordStore();
  const { incomeRecords, expenseRecords, totalIncome, totalExpense } = useCashRecordFilter();
  const { onDeleteRecord } = useCashRecordAction();

  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");

  // 수정 모달 상태
  const editModalState = useBoolean();
  const [editTarget, setEditTarget] = useState<CashRecordInterface | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    setRecords(initialRecords);
    setCategories(initialCategories);
    setSettings(initialSettings);
    const { from, to } = getDateRange(DEFAULT_DATE_RANGE_DAYS);
    setDateRange({ from, to });
  }, [initialRecords, initialCategories, initialSettings, setRecords, setCategories, setSettings, setDateRange]);

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

  // 수정 모달 열기
  const handleEdit = (record: CashRecordInterface) => {
    setEditTarget(record);
    editModalState.onTrue();
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

          {/* 거래 추가 (우측 정렬) */}
          <div className="ml-auto">
            <CashRecordAddButton categories={categories} />
          </div>
        </div>

        {/* 테이블 콘텐츠 */}
        <TabsContent value="expense" className="mt-0 flex-1 overflow-y-auto">
          <RecordTable
            records={expenseRecords}
            total={totalExpense}
            totalLabel="지출 합계"
            type="EXPENSE"
            onEdit={handleEdit}
            onDelete={onDeleteRecord}
          />
        </TabsContent>
        <TabsContent value="income" className="mt-0 flex-1 overflow-y-auto">
          <RecordTable
            records={incomeRecords}
            total={totalIncome}
            totalLabel="수입 합계"
            type="INCOME"
            onEdit={handleEdit}
            onDelete={onDeleteRecord}
          />
        </TabsContent>
      </Tabs>

      {/* 수정 모달 */}
      {editTarget && (
        <CashRecordEditModal
          modalState={editModalState}
          categories={initialCategories}
          originValue={editTarget}
        />
      )}
    </div>
  );
};

// 거래 테이블 컴포넌트
interface RecordTableProps {
  records: CashRecordInterface[];
  total: number;
  totalLabel: string;
  type: "INCOME" | "EXPENSE";
  onEdit: (record: CashRecordInterface) => void;
  onDelete: (params: { id: number }) => void;
}

const RecordTable = ({ records, total, totalLabel, type, onEdit, onDelete }: RecordTableProps) => {
  const isExpense = type === "EXPENSE";

  return (
    <div className="p-6">
      <table className="w-full">
        {/* 테이블 헤더 */}
        <thead>
          <tr className="border-b text-left text-xs text-minimoku-neutral-bold">
            <th className="w-[90px] pb-3 font-medium">날짜</th>
            <th className="pb-3 font-medium">사용내역</th>
            <th className="w-[120px] pb-3 text-right font-medium">금액</th>
            <th className="w-[80px] pb-3 text-center font-medium">분류</th>
            <th className="w-[100px] pb-3 text-center font-medium">태그</th>
            <th className="w-[70px] pb-3" />
          </tr>
        </thead>

        {/* 테이블 본문 */}
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-minimoku-neutral-bold">
                {isExpense ? "지출" : "수입"} 내역이 없습니다.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-background-secondary transition-colors hover:bg-accent/50"
              >
                {/* 날짜 */}
                <td className="py-3 text-sm text-minimoku-neutral-bold">
                  {formatDate(record.date).slice(5)}
                </td>

                {/* 사용내역 */}
                <td className="py-3 text-sm">{record.description}</td>

                {/* 금액 */}
                <td
                  className={`py-3 text-right text-sm font-medium ${
                    isExpense ? "text-pigmoney-expense" : "text-pigmoney-income"
                  }`}
                >
                  {isExpense ? "-" : "+"}
                  {record.amount.toLocaleString()}
                </td>

                {/* 분류 (카테고리) */}
                <td className="py-3 text-center">
                  <span className="rounded bg-background-secondary px-2 py-0.5 text-xs">
                    {record.category?.name ?? "미분류"}
                  </span>
                </td>

                {/* 태그 — mockdata에는 없으므로 빈칸 (추후 확장) */}
                <td className="py-3 text-center text-xs text-minimoku-neutral-bold">—</td>

                {/* 액션 */}
                <td className="py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      className="cursor-pointer rounded p-1 hover:bg-accent"
                      onClick={() => onEdit(record)}
                    >
                      <Edit className="h-3.5 w-3.5 text-minimoku-neutral-bold" />
                    </button>
                    <button
                      className="cursor-pointer rounded p-1 hover:bg-accent"
                      onClick={() => onDelete({ id: record.id })}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-minimoku-neutral-bold" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>

        {/* 합계 푸터 */}
        <tfoot>
          <tr className="border-t-2">
            <td colSpan={2} className="py-3 text-sm font-medium">
              {totalLabel}
            </td>
            <td
              className={`py-3 text-right text-sm font-semibold ${
                isExpense ? "text-pigmoney-expense" : "text-pigmoney-income"
              }`}
              colSpan={4}
            >
              {total.toLocaleString()} 원
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PigMoneyMain;
