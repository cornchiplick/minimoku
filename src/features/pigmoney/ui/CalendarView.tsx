"use client";

import { CashRecordInterface, CashRecordType } from "@/entities/pigmoney/types";
import { cn } from "@/shared/lib/utils/commonUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

interface CalendarViewProps {
  records: CashRecordInterface[];
  weekStartDay: number;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
}

// 일별 수입/지출 합산 맵 생성
const buildDailySummary = (
  records: CashRecordInterface[],
): Map<string, { income: number; expense: number }> => {
  const map = new Map<string, { income: number; expense: number }>();

  records.forEach((r) => {
    const key = new Date(r.date).toISOString().split("T")[0];
    const existing = map.get(key) ?? { income: 0, expense: 0 };

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
      weekStartsOn={weekStartDay as 0 | 1 | 2 | 3 | 4 | 5 | 6}
      showOutsideDays
      className="w-full"
      classNames={{
        months: "flex flex-col w-full",
        month: "w-full",
        month_caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-base font-semibold",
        nav: "flex items-center",
        button_previous:
          "absolute left-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center cursor-pointer",
        button_next:
          "absolute right-1 h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center cursor-pointer",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday: "text-muted-foreground flex-1 text-center font-normal text-xs py-2",
        week: "flex w-full",
        day: cn(
          "relative flex-1 p-0 text-center",
          "border border-background-secondary",
        ),
        day_button: cn(
          "w-full h-20 p-1 font-normal",
          "flex flex-col items-start justify-start",
          "hover:bg-accent/50 cursor-pointer",
          "focus:outline-none",
        ),
        selected: "bg-pigmoney-brand/10 ring-1 ring-pigmoney-brand",
        today: "bg-accent/30",
        outside: "text-muted-foreground opacity-40",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
        DayButton: ({ day, modifiers, ...props }) => {
          const dateKey = day.date.toISOString().split("T")[0];
          const summary = dailySummary.get(dateKey);

          return (
            <button {...props}>
              <span className={cn("text-xs", modifiers.today && "font-bold text-pigmoney-brand")}>
                {day.date.getDate()}
              </span>
              {summary && !modifiers.outside && (
                <div className="mt-0.5 flex w-full flex-col gap-0.5">
                  {summary.income > 0 && (
                    <span className="truncate text-[10px] leading-tight text-pigmoney-income">
                      +{formatShortAmount(summary.income)}
                    </span>
                  )}
                  {summary.expense > 0 && (
                    <span className="truncate text-[10px] leading-tight text-pigmoney-expense">
                      -{formatShortAmount(summary.expense)}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        },
      }}
    />
  );
};

export default CalendarView;
