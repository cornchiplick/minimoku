import { getCashRecordSummary } from "@/features/pigmoney/model/services/cashRecords.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import {
  formatDate,
  formatDateWithDay,
  getCustomMonthRange,
  getCustomWeekRange,
  toDateString,
} from "@/shared/lib/utils/dateUtils";
import { useCallback, useEffect } from "react";

// 사이드바 요약 데이터 조회/갱신 훅
const useSidebarSummary = () => {
  const { settings, summaryVersion, setMonthSummary, setWeekSummary } = useCashRecordStore();

  const fetchSummary = useCallback(async () => {
    if (!settings) return;

    try {
      // 이달의 가계 범위 계산
      const monthRange = getCustomMonthRange(settings.monthStartDay);
      const monthResult = await getCashRecordSummary({
        fromDate: toDateString(monthRange.from),
        toDate: toDateString(monthRange.to),
      });

      setMonthSummary({
        label: "이달의 가계",
        period: `${formatDate(monthRange.from)} ~ ${formatDate(monthRange.to)}`,
        income: monthResult.income,
        expense: monthResult.expense,
      });

      // 이주의 가계 범위 계산
      const weekRange = getCustomWeekRange(settings.weekStartDay);
      const weekResult = await getCashRecordSummary({
        fromDate: toDateString(weekRange.from),
        toDate: toDateString(weekRange.to),
      });

      setWeekSummary({
        label: "이주의 가계",
        period: `${formatDateWithDay(weekRange.from)} ~ ${formatDateWithDay(weekRange.to)}`,
        income: weekResult.income,
        expense: weekResult.expense,
      });
    } catch (error) {
      console.error("Sidebar summary fetch error:", error);
    }
  }, [settings, setMonthSummary, setWeekSummary]);

  // settings 로드 시 + summaryVersion 변경 시 재조회
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, summaryVersion]);
};

export default useSidebarSummary;
