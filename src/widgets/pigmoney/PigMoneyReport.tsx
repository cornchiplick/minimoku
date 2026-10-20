"use client";

import {
  CashRecordInterface,
  CashRecordType,
  PigMoneySettingsInterface,
} from "@/entities/pigmoney/types";
import {getCashRecords} from "@/features/pigmoney/model/services/cashRecords.service";
import {useCashRecordStore} from "@/features/pigmoney/model/store/cashRecordStore";
import {computeCashRecordStats} from "@/features/pigmoney/model/utils/cashRecordStats";
import ReportCategoryRanking from "@/features/pigmoney/ui/ReportCategoryRanking";
import ReportDailyTrend from "@/features/pigmoney/ui/ReportDailyTrend";
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
    <div className="bg-background-primary flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="border-border shrink-0 border-b">
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
          {/* 기간 이동 + 월/주 전환 */}
          <div className="flex items-center justify-between gap-3 pt-5 pb-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="이전 기간"
              className="text-minimoku-neutral-bold hover:bg-background-secondary focus-visible:ring-pigmoney-brand rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-foreground min-w-0 truncate text-center text-sm font-semibold">
              {dateRangeText}
            </h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleNext}
                aria-label="다음 기간"
                className="text-minimoku-neutral-bold hover:bg-background-secondary focus-visible:ring-pigmoney-brand rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 이 기간에 쓴 돈 — 보고서의 주인공 */}
          <div className="flex items-end justify-between gap-6 pt-3 pb-5">
            <div>
              <p className="text-minimoku-neutral-bold text-xs">쓴 돈</p>
              <p className="text-foreground text-hero font-bold tabular-nums">
                {stats.totalExpense.toLocaleString("ko-KR")}
              </p>
            </div>
            <dl className="flex shrink-0 gap-6 pb-1.5 text-right">
              <div>
                <dt className="text-minimoku-neutral-bold text-xs">받은 돈</dt>
                <dd className="text-pigmoney-income text-sm font-semibold tabular-nums">
                  +{stats.totalIncome.toLocaleString("ko-KR")}
                </dd>
              </div>
              <div>
                <dt className="text-minimoku-neutral-bold text-xs">남은 돈</dt>
                <dd className="text-foreground text-sm font-semibold tabular-nums">
                  {stats.balance < 0 ? "−" : ""}
                  {Math.abs(stats.balance).toLocaleString("ko-KR")}
                </dd>
              </div>
            </dl>
          </div>

          {/* 월/주 전환 */}
          <div className="flex items-center gap-1 pb-4">
            {(["month", "week"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => viewMode !== mode && handleToggleMode()}
                aria-pressed={viewMode === mode}
                className={
                  viewMode === mode
                    ? "bg-foreground text-background-primary rounded-full px-3 py-1 text-xs font-medium"
                    : "text-minimoku-neutral-bold hover:bg-background-secondary rounded-full px-3 py-1 text-xs transition-colors"
                }>
                {mode === "month" ? "한 달" : "한 주"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-8 md:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="text-minimoku-neutral-bold h-6 w-6 animate-spin" />
            </div>
          ) : stats.totalExpense === 0 && stats.totalIncome === 0 ? (
            <div className="py-20 text-center">
              <p className="text-foreground text-base font-medium">이 기간에는 기록이 없습니다.</p>
              <p className="text-minimoku-neutral-bold mt-1.5 text-sm">
                다른 기간을 보거나 쓰기에서 거래를 적어 보세요.
              </p>
            </div>
          ) : (
            <>
              <ReportDailyTrend records={records} from={dateRange.from} to={dateRange.to} />

              <ReportCategoryRanking
                breakdown={stats.categoryBreakdown}
                type={CashRecordType.EXPENSE}
                heading="어디에 썼나"
                emptyText="이 기간에는 지출이 없습니다."
              />

              <ReportCategoryRanking
                breakdown={stats.categoryBreakdown}
                type={CashRecordType.INCOME}
                heading="어디서 들어왔나"
                emptyText="이 기간에는 수입이 없습니다."
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PigMoneyReport;
