"use client";

import {CashRecordInterface, CashRecordType} from "@/entities/pigmoney/types";
import {cn} from "@/shared/lib/utils/commonUtils";
import {ko} from "date-fns/locale";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {DayPicker} from "react-day-picker";

interface CalendarViewProps {
  records: CashRecordInterface[];
  weekStartDay: number;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
}

/** 로컬 기준 날짜 키 (toISOString 은 UTC 라 자정 근처에서 하루가 밀린다) */
const dateKeyOf = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

// 일별 수입/지출 합산 맵 생성
const buildDailySummary = (
  records: CashRecordInterface[]
): Map<string, {income: number; expense: number}> => {
  const map = new Map<string, {income: number; expense: number}>();

  records.forEach((r) => {
    const key = dateKeyOf(new Date(r.date));
    const existing = map.get(key) ?? {income: 0, expense: 0};

    if (r.type === CashRecordType.INCOME) {
      existing.income += r.amount;
    } else {
      existing.expense += r.amount;
    }
    map.set(key, existing);
  });

  return map;
};

// 금액 축약 표시 (만 단위)
const formatShortAmount = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(amount % 10000 === 0 ? 0 : 1)}만`;
  }
  return amount.toLocaleString();
};

// PigMoney 달력 뷰 (react-day-picker v9 커스텀)
const CalendarView = ({
  records,
  weekStartDay,
  selectedDate,
  onSelectDate,
  month,
  onMonthChange,
}: CalendarViewProps) => {
  const dailySummary = buildDailySummary(records);

  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      month={month}
      onMonthChange={onMonthChange}
      locale={ko}
      hideNavigation
      weekStartsOn={weekStartDay as 0 | 1 | 2 | 3 | 4 | 5 | 6}
      showOutsideDays
      className="w-full"
      classNames={{
        months: "flex flex-col w-full",
        month: "w-full",
        month_caption: "mb-4",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday: "text-minimoku-neutral-bold flex-1 text-center font-normal text-xs pb-2",
        week: "border-border flex w-full border-t",
        day: "relative flex-1 p-0 text-left",
        day_button: cn(
          "w-full h-20 px-1.5 pt-1.5 font-normal",
          "flex flex-col items-start gap-1",
          "hover:bg-background-secondary/60 focus-visible:ring-pigmoney-brand focus-visible:ring-2 focus-visible:outline-none",
          "cursor-pointer transition-colors rounded-sm"
        ),
        selected: "bg-pigmoney-brand/8",
        // 투명도로 흐리면 글자 대비가 2.09:1 까지 떨어진다 → 색은 아래 DayButton 에서 흐린 토큰으로 준다
        outside: "",
        disabled: "opacity-40",
        hidden: "invisible",
      }}
      components={{
        MonthCaption: ({calendarMonth}) => {
          const d = calendarMonth.date;
          const label = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;

          return (
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => onMonthChange(new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                aria-label="이전 달"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent p-0 opacity-50 hover:opacity-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-base font-semibold">{label}</span>
              <button
                type="button"
                onClick={() => onMonthChange(new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                aria-label="다음 달"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center bg-transparent p-0 opacity-50 hover:opacity-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        },
        DayButton: ({day, modifiers, ...props}) => {
          const dateKey = dateKeyOf(day.date);
          const summary = dailySummary.get(dateKey);

          const showSummary = !!summary && !modifiers.outside;
          const expenseText =
            showSummary && summary.expense > 0 ? `−${formatShortAmount(summary.expense)}` : "";
          const incomeText =
            showSummary && summary.income > 0 ? `+${formatShortAmount(summary.income)}` : "";

          // 접근 가능한 이름은 화면에 보이는 글자를 그대로 품어야 한다 (WCAG 2.5.3 "이름 안의 레이블").
          // 음성으로 조작하는 사람이 본 대로 말해서 누를 수 있어야 하기 때문이다.
          const spoken = [
            `${day.date.getDate()}일`,
            modifiers.today ? "오늘" : "",
            expenseText ? `지출 ${expenseText}` : "",
            incomeText ? `수입 ${incomeText}` : "",
          ]
            .filter(Boolean)
            .join(", ");

          return (
            <button {...props} aria-label={spoken}>
              <span
                className={cn(
                  "flex items-center gap-1 text-[0.8125rem] tabular-nums",
                  modifiers.today
                    ? "text-pigmoney-brand-strong font-bold"
                    : modifiers.outside
                      ? "text-minimoku-neutral-bold font-medium"
                      : "text-foreground font-medium"
                )}>
                {day.date.getDate()}
                {modifiers.today && (
                  <span className="bg-pigmoney-brand h-1 w-1 rounded-full" aria-hidden />
                )}
              </span>
              {showSummary && (
                <span className="flex w-full flex-col items-start gap-0.5">
                  {expenseText && (
                    <span className="text-foreground truncate text-[11px] leading-tight font-semibold tabular-nums">
                      {expenseText}
                    </span>
                  )}
                  {incomeText && (
                    <span className="text-pigmoney-income truncate text-[11px] leading-tight font-semibold tabular-nums">
                      {incomeText}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        },
      }}
    />
  );
};

export default CalendarView;
