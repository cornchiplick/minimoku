"use client";

import { CashRecordInterface, CashRecordType, PigMoneySettingsInterface } from "@/entities/pigmoney/types";
import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { computeCashRecordStats } from "@/features/pigmoney/model/utils/cashRecordStats";
import ReportCategoryChart from "@/features/pigmoney/ui/ReportCategoryChart";
import ReportCategoryList from "@/features/pigmoney/ui/ReportCategoryList";
import ReportMonthSelector from "@/features/pigmoney/ui/ReportMonthSelector";
import ReportSummaryCards from "@/features/pigmoney/ui/ReportSummaryCards";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { getCustomMonthRangeFor } from "@/shared/lib/utils/dateUtils";
import { toDateString } from "@/shared/lib/utils/dateUtils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PigMoneyReportProps {
  initialRecords: CashRecordInterface[];
  initialSettings: PigMoneySettingsInterface;
}

const PigMoneyReport = ({ initialRecords, initialSettings }: PigMoneyReportProps) => {
  const { setSettings } = useCashRecordStore();

  const [records, setRecords] = useState<CashRecordInterface[]>(initialRecords);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // 초기 설정 스토어 반영
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings, setSettings]);

  // 월 변경 시 데이터 재조회
  const fetchRecords = useCallback(async (date: Date) => {
    setIsLoading(true);
    try {
      const { from, to } = getCustomMonthRangeFor(date, initialSettings.monthStartDay);
      const data = await getCashRecords({
        params: {
          fromDate: toDateString(from),
          toDate: toDateString(to),
        },
      });
      setRecords(data);
    } catch {
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [initialSettings.monthStartDay]);

  // 월 이동
  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
    fetchRecords(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
    fetchRecords(next);
  };

  const stats = computeCashRecordStats(records);

  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-y-auto">
      <div className="p-6">
        {/* 월 선택기 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">보고서</h2>
          <ReportMonthSelector
            currentDate={currentDate}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-minimoku-neutral-bold" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* 요약 카드 */}
            <ReportSummaryCards
              totalIncome={stats.totalIncome}
              totalExpense={stats.totalExpense}
              balance={stats.balance}
            />

            {/* 카테고리 도넛 차트 */}
            <div className="grid grid-cols-2 gap-4">
              <ReportCategoryChart
                breakdown={stats.categoryBreakdown}
                type={CashRecordType.EXPENSE}
                title="지출 카테고리"
              />
              <ReportCategoryChart
                breakdown={stats.categoryBreakdown}
                type={CashRecordType.INCOME}
                title="수입 카테고리"
              />
            </div>

            {/* 카테고리별 상세 목록 */}
            <ReportCategoryList breakdown={stats.categoryBreakdown} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PigMoneyReport;
