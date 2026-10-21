"use client";

import {Button} from "@/shared/components/atoms/button";
import {DatePicker} from "@/shared/components/atoms/date-picker";
import {ChevronLeft, ChevronRight, Minus, Plus} from "lucide-react";

interface LedgerHeaderProps {
  monthLabel: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  dateRange: {from: Date | null; to: Date | null};
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectFrom: (date: Date | undefined) => void;
  onSelectTo: (date: Date | undefined) => void;
  onAdd: (type: "INCOME" | "EXPENSE") => void;
}

/** 금액을 부호와 함께 고정폭 숫자로 */
const signed = (amount: number, sign: "+" | "−") => `${sign}${amount.toLocaleString("ko-KR")}`;

/**
 * 장부 위쪽 — 보고 있는 달, 합계, 기간 선택과 추가 버튼.
 *
 * 화면에서 가장 크게 읽혀야 할 숫자는 "남은 돈" 하나다. 수입·지출은 그 근거이므로
 * 작게 옆에 둔다.
 */
const LedgerHeader = ({
  monthLabel,
  balance,
  totalIncome,
  totalExpense,
  dateRange,
  onPrevMonth,
  onNextMonth,
  onSelectFrom,
  onSelectTo,
  onAdd,
}: LedgerHeaderProps) => (
  <header className="border-border shrink-0 border-b">
    <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
      {/* 월 이동 */}
      <div className="flex items-center justify-between pt-5 pb-1">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="이전 달"
          className="text-minimoku-neutral-bold hover:bg-background-secondary focus-visible:ring-pigmoney-brand rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-foreground text-lg font-semibold tracking-tight">{monthLabel}</h1>
        <button
          type="button"
          onClick={onNextMonth}
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
              {signed(totalIncome, "+")}
            </dd>
          </div>
          <div>
            <dt className="text-minimoku-neutral-bold text-xs">지출</dt>
            <dd className="text-foreground text-sm font-semibold tabular-nums">
              {signed(totalExpense, "−")}
            </dd>
          </div>
        </dl>
      </div>

      {/* 기간 직접 선택 + 추가 */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-1.5">
          <DatePicker selected={dateRange.from} onSelect={onSelectFrom} placeholder="시작일" />
          <span className="text-minimoku-neutral-bold text-sm">—</span>
          <DatePicker
            selected={dateRange.to}
            onSelect={onSelectTo}
            placeholder="종료일"
            minDate={dateRange.from ?? undefined}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd("INCOME")}
            className="cursor-pointer">
            <Plus className="mr-1 h-4 w-4" />
            수입
          </Button>
          <Button size="sm" onClick={() => onAdd("EXPENSE")} className="cursor-pointer">
            <Minus className="mr-1 h-4 w-4" />
            지출
          </Button>
        </div>
      </div>
    </div>
  </header>
);

export default LedgerHeader;
