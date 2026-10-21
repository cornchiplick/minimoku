"use client";

import {CashRecordInterface, CashRecordType} from "@/entities/pigmoney/types";
import {cn} from "@/shared/lib/utils/commonUtils";
import {useMemo} from "react";

interface CashRecordLedgerProps {
  records: CashRecordInterface[];
  /** 행을 누르면 수정 */
  onSelect: (record: CashRecordInterface) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 자릿수가 흔들리지 않도록 고정폭 숫자로 그린다 */
const amountText = (amount: number, type: CashRecordType) =>
  `${type === CashRecordType.EXPENSE ? "−" : "+"}${amount.toLocaleString("ko-KR")}`;

/** 날짜별로 묶고 최신 날짜가 위로 오게 정렬 */
function groupByDay(records: CashRecordInterface[]) {
  const byKey = new Map<string, CashRecordInterface[]>();

  for (const record of records) {
    const date = new Date(record.date);
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const bucket = byKey.get(key);
    if (bucket) bucket.push(record);
    else byKey.set(key, [record]);
  }

  const days = [...byKey.values()]
    .map((items) => {
      const date = new Date(items[0].date);
      const net = items.reduce(
        (sum, r) => sum + (r.type === CashRecordType.EXPENSE ? -r.amount : r.amount),
        0
      );
      return {date, net, items: items.sort((a, b) => b.id - a.id)};
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // 월이 바뀌는 지점에만 "N월"을 붙인다 (날짜 숫자를 이미 크게 보여주므로 매번 반복하지 않는다)
  return days.map((day, i) => ({
    ...day,
    showMonth: i === 0 || days[i - 1].date.getMonth() !== day.date.getMonth(),
  }));
}

/**
 * 거래 내역을 날짜별 장부로 보여준다.
 *
 * 항목마다 카드를 두지 않고 행으로 그린다. 날짜가 바뀌는 지점에만 구분선을 두어
 * 선 자체가 "날이 바뀌었다"는 정보를 전달하게 했다.
 */
const CashRecordLedger = ({records, onSelect}: CashRecordLedgerProps) => {
  const days = useMemo(() => groupByDay(records), [records]);

  if (days.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-foreground text-base font-medium">아직 기록이 없습니다.</p>
        <p className="text-minimoku-neutral-bold mt-1.5 text-sm">
          오른쪽 아래 버튼으로 첫 거래를 적어 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 md:px-6">
      {days.map(({date, net, items, showMonth}) => (
        <section key={date.toISOString()} className="border-border border-t first:border-t-0">
          {/* 날짜 머리 — 날짜를 큰 숫자로, 요일을 곁들이고, 그날 소계를 오른쪽에 */}
          {/* 날짜 묶음의 머리 — <header> 로 두면 랜드마크가 되어 날마다 하나씩 생긴다 */}
          <div className="flex items-baseline justify-between gap-3 pt-7 pb-2">
            <h2 className="flex items-baseline gap-1.5">
              {showMonth && (
                <span className="text-minimoku-neutral-bold text-sm">{date.getMonth() + 1}월</span>
              )}
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                {date.getDate()}
              </span>
              <span className="text-minimoku-neutral-bold text-sm">{WEEKDAYS[date.getDay()]}</span>
            </h2>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                net < 0 ? "text-minimoku-neutral-bold" : "text-pigmoney-income"
              )}>
              {net < 0 ? "−" : "+"}
              {Math.abs(net).toLocaleString("ko-KR")}
            </span>
          </div>

          <ul>
            {items.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => onSelect(record)}
                  className="group hover:bg-background-secondary/60 focus-visible:ring-pigmoney-brand -mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none">
                  <span className="text-foreground min-w-0 flex-1 truncate text-[0.9375rem]">
                    {record.description}
                  </span>
                  <span className="text-minimoku-neutral-bold hidden w-20 shrink-0 text-right text-[0.8125rem] sm:block">
                    {record.category?.name}
                  </span>
                  <span
                    className={cn(
                      "w-28 shrink-0 text-right text-[0.9375rem] font-semibold tabular-nums",
                      record.type === CashRecordType.EXPENSE
                        ? "text-foreground"
                        : "text-pigmoney-income"
                    )}>
                    {amountText(record.amount, record.type)}
                  </span>
                </button>
                {record.note ? (
                  <p className="text-minimoku-neutral-bold -mt-1 mb-2 text-xs">{record.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default CashRecordLedger;
