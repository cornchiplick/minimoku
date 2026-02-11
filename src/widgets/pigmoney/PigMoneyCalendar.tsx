"use client";

import { CashRecordInterface, PigMoneySettingsInterface } from "@/entities/pigmoney/types";
import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import CalendarView from "@/features/pigmoney/ui/CalendarView";
import { getCustomMonthRangeFor, toDateString, formatDate } from "@/shared/lib/utils/dateUtils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PigMoneyCalendarProps {
  initialRecords: CashRecordInterface[];
  initialSettings: PigMoneySettingsInterface;
}

const PigMoneyCalendar = ({ initialRecords, initialSettings }: PigMoneyCalendarProps) => {
  const { setSettings } = useCashRecordStore();

  const [records, setRecords] = useState<CashRecordInterface[]>(initialRecords);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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

  // 월 변경 핸들러
  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    setSelectedDate(undefined);
    fetchRecords(newMonth);
  };

  // 선택된 날짜의 거래 목록
  const selectedRecords = selectedDate
    ? records.filter((r) => {
        const rDate = new Date(r.date).toISOString().split("T")[0];
        const sDate = selectedDate.toISOString().split("T")[0];
        return rDate === sDate;
      })
    : [];

  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-y-auto">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold">달력</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-minimoku-neutral-bold" />
          </div>
        ) : (
          <>
            {/* 달력 뷰 */}
            <CalendarView
              records={records}
              weekStartDay={initialSettings.weekStartDay}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              month={month}
              onMonthChange={handleMonthChange}
            />

            {/* 선택된 날짜의 거래 목록 */}
            {selectedDate && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold">
                  {formatDate(selectedDate)} 거래 내역
                </h3>

                {selectedRecords.length === 0 ? (
                  <p className="text-sm text-minimoku-neutral-bold">해당 날짜에 거래 내역이 없습니다.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-xs text-minimoku-neutral-bold">
                        <th className="pb-2 font-medium">유형</th>
                        <th className="pb-2 font-medium">내용</th>
                        <th className="pb-2 font-medium">카테고리</th>
                        <th className="pb-2 text-right font-medium">금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRecords.map((r) => (
                        <tr key={r.id} className="border-b border-background-secondary">
                          <td className="py-2 text-xs">
                            <span
                              className={
                                r.type === "INCOME"
                                  ? "text-pigmoney-income"
                                  : "text-pigmoney-expense"
                              }
                            >
                              {r.type === "INCOME" ? "수입" : "지출"}
                            </span>
                          </td>
                          <td className="py-2 text-sm">{r.description}</td>
                          <td className="py-2 text-xs">
                            <span className="rounded bg-background-secondary px-2 py-0.5">
                              {r.category?.name ?? "미분류"}
                            </span>
                          </td>
                          <td
                            className={`py-2 text-right text-sm font-medium ${
                              r.type === "INCOME"
                                ? "text-pigmoney-income"
                                : "text-pigmoney-expense"
                            }`}
                          >
                            {r.type === "INCOME" ? "+" : "-"}
                            {r.amount.toLocaleString()} 원
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PigMoneyCalendar;
