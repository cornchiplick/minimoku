"use client";

import {
  CashRecordInterface,
  CashRecordType,
  PigMoneySettingsInterface,
} from "@/entities/pigmoney/types";
import {getCashRecords} from "@/features/pigmoney/model/services/cashRecords.service";
import {useCashRecordStore} from "@/features/pigmoney/model/store/cashRecordStore";
import {computeCashRecordStats} from "@/features/pigmoney/model/utils/cashRecordStats";
import ReportCategoryChart from "@/features/pigmoney/ui/ReportCategoryChart";
import ReportCategoryList from "@/features/pigmoney/ui/ReportCategoryList";
import ReportSummaryCards from "@/features/pigmoney/ui/ReportSummaryCards";
import {Button} from "@/shared/components/atoms/button";
import {
  formatDate,
  formatDateWithDay,
  getCustomMonthRangeFor,
  getCustomWeekRangeFor,
  getNextCustomMonthRange,
  getNextCustomWeekRange,
  getPrevCustomMonthRange,
  getPrevCustomWeekRange,
  toDateString,
} from "@/shared/lib/utils/dateUtils";
import {ChevronLeft, ChevronRight, Loader2} from "lucide-react";
import {useCallback, useEffect, useState} from "react";

type ReportViewMode = "month" | "week";

interface PigMoneyReportProps {
  initialRecords: CashRecordInterface[];
  initialSettings: PigMoneySettingsInterface;
}

const PigMoneyReport = ({initialRecords, initialSettings}: PigMoneyReportProps) => {
  const {setSettings} = useCashRecordStore();

  const [records, setRecords] = useState<CashRecordInterface[]>(initialRecords);
  const [viewMode, setViewMode] = useState<ReportViewMode>("month");
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>(() => {
    // 초기값: 현재 날짜 기준 커스텀 월 범위
    const {from, to} = getCustomMonthRangeFor(new Date(), initialSettings.monthStartDay);
    return {from, to};
  });
  const [isLoading, setIsLoading] = useState(false);

  // 초기 설정 스토어 반영
  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings, setSettings]);

  // 날짜 범위 기준 데이터 재조회
  const fetchRecords = useCallback(async (from: Date, to: Date) => {
    setIsLoading(true);
    try {
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
  }, []);

  // 이전 기간 이동
  const handlePrev = () => {
    let newRange: {from: Date; to: Date};

    if (viewMode === "month") {
      newRange = getPrevCustomMonthRange(dateRange.from, initialSettings.monthStartDay);
    } else {
      newRange = getPrevCustomWeekRange(dateRange.from, initialSettings.weekStartDay);
    }

    setDateRange(newRange);
    fetchRecords(newRange.from, newRange.to);
  };

  // 다음 기간 이동
  const handleNext = () => {
    let newRange: {from: Date; to: Date};

    if (viewMode === "month") {
      newRange = getNextCustomMonthRange(dateRange.to, initialSettings.monthStartDay);
    } else {
      newRange = getNextCustomWeekRange(dateRange.to, initialSettings.weekStartDay);
    }

    setDateRange(newRange);
    fetchRecords(newRange.from, newRange.to);
  };

  // 월/주 모드 전환
  const handleToggleMode = () => {
    const newMode: ReportViewMode = viewMode === "month" ? "week" : "month";
    setViewMode(newMode);

    // 현재 날짜 기준으로 새 범위 계산
    const now = new Date();
    let newRange: {from: Date; to: Date};

    if (newMode === "month") {
      newRange = getCustomMonthRangeFor(now, initialSettings.monthStartDay);
    } else {
      newRange = getCustomWeekRangeFor(now, initialSettings.weekStartDay);
    }

    setDateRange(newRange);
    fetchRecords(newRange.from, newRange.to);
  };

  const stats = computeCashRecordStats(records);

  // 날짜 범위 텍스트
  const dateRangeText =
    viewMode === "month"
      ? `${formatDate(dateRange.from)} ~ ${formatDate(dateRange.to)}`
      : `${formatDateWithDay(dateRange.from)} ~ ${formatDateWithDay(dateRange.to)}`;

  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-hidden">
      {/* 서브 헤더: 보고서 | < 날짜 범위 > | 월/주 토글 */}
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <h2 className="text-lg font-medium">보고서</h2>

        {/* 화살표 + 날짜 범위 */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{dateRangeText}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 월/주 토글 */}
        <div className="flex items-center gap-0.5 rounded-md border p-0.5">
          <Button
            variant={viewMode === "month" ? "default" : "ghost"}
            size="sm"
            className="h-7 cursor-pointer px-3 text-xs"
            onClick={() => viewMode !== "month" && handleToggleMode()}>
            월
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            className="h-7 cursor-pointer px-3 text-xs"
            onClick={() => viewMode !== "week" && handleToggleMode()}>
            주
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-minimoku-neutral-bold h-6 w-6 animate-spin" />
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
