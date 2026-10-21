"use client";

import {getCashRecords} from "@/features/pigmoney/model/services/cashRecords.service";
import {useCashRecordStore} from "@/features/pigmoney/model/store/cashRecordStore";
import {
  getCustomMonthRangeFor,
  getNextCustomMonthRange,
  getPrevCustomMonthRange,
  toDateString,
} from "@/shared/lib/utils/dateUtils";
import {useCallback, useMemo} from "react";
import {toast} from "sonner";

/**
 * 장부에서 "보고 있는 기간" 을 다루는 훅.
 *
 * 기간을 바꾸는 방법은 네 가지다 — 시작일 고르기, 종료일 고르기, 이전 달, 다음 달.
 * 넷 다 하는 일은 같다: 기간을 바꾸고 그 기간으로 다시 조회한다. 원래는 이 흐름이
 * 화면 쪽에 네 번 복사돼 있었고 조회 실패 처리도 각각 적혀 있었다. 여기로 모은다.
 */
export default function useLedgerPeriod() {
  const {dateRange, settings, setDateRange, setRecords} = useCashRecordStore();

  /** 기간을 정하고 그 기간으로 다시 조회한다 (기간이 덜 정해졌으면 조회하지 않는다) */
  const applyRange = useCallback(
    async (from: Date | null, to: Date | null) => {
      setDateRange({from, to});
      if (!from || !to) return;

      try {
        const records = await getCashRecords({
          params: {fromDate: toDateString(from), toDate: toDateString(to)},
        });
        setRecords(records);
      } catch {
        toast.error("조회에 실패했습니다.");
      }
    },
    [setDateRange, setRecords]
  );

  /** 지금 기간 그대로 다시 조회한다 (저장 직후 등) */
  const reload = useCallback(
    () => applyRange(dateRange.from, dateRange.to),
    [applyRange, dateRange.from, dateRange.to]
  );

  const selectFrom = useCallback(
    (date: Date | undefined) => {
      const from = date ?? null;
      let to = dateRange.to;

      // 시작일이 종료일보다 뒤면 종료일을 시작일에 맞춘다
      if (from && to && from > to) {
        to = from;
        toast.warning("종료일이 시작일에 맞춰 변경되었습니다.");
      }
      return applyRange(from, to);
    },
    [applyRange, dateRange.to]
  );

  const selectTo = useCallback(
    (date: Date | undefined) => applyRange(dateRange.from, date ?? null),
    [applyRange, dateRange.from]
  );

  const goPrevMonth = useCallback(() => {
    if (!dateRange.from || !settings) return;
    const {from, to} = getPrevCustomMonthRange(dateRange.from, settings.monthStartDay);
    return applyRange(from, to);
  }, [applyRange, dateRange.from, settings]);

  const goNextMonth = useCallback(() => {
    if (!dateRange.to || !settings) return;
    const {from, to} = getNextCustomMonthRange(dateRange.to, settings.monthStartDay);
    return applyRange(from, to);
  }, [applyRange, dateRange.to, settings]);

  /** 보고 있는 달의 이름 (예: "10월") */
  const monthLabel = useMemo(() => {
    if (!dateRange.from || !settings) return "";
    return getCustomMonthRangeFor(dateRange.from, settings.monthStartDay).label;
  }, [dateRange.from, settings]);

  return {dateRange, monthLabel, selectFrom, selectTo, goPrevMonth, goNextMonth, reload};
}
