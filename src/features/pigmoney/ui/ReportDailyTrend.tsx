"use client";

import {CashRecordInterface, CashRecordType} from "@/entities/pigmoney/types";
import {useMemo} from "react";
import {Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis} from "recharts";

interface ReportDailyTrendProps {
  records: CashRecordInterface[];
  from: Date;
  to: Date;
}

interface DayPoint {
  label: string;
  day: number;
  expense: number;
  isToday: boolean;
}

/** 조회 구간의 모든 날짜를 채운다 (거래가 없는 날도 빈칸으로 두어 리듬이 보이게) */
function buildDays(records: CashRecordInterface[], from: Date, to: Date): DayPoint[] {
  const expenseByKey = new Map<string, number>();
  for (const record of records) {
    if (record.type !== CashRecordType.EXPENSE) continue;
    const d = new Date(record.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    expenseByKey.set(key, (expenseByKey.get(key) ?? 0) + record.amount);
  }

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const days: DayPoint[] = [];
  const cursor = new Date(from);
  cursor.setHours(12, 0, 0, 0);
  const end = new Date(to);
  end.setHours(12, 0, 0, 0);

  while (cursor <= end && days.length < 70) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    days.push({
      label: String(cursor.getDate()),
      day: cursor.getDate(),
      expense: expenseByKey.get(key) ?? 0,
      isToday: key === todayKey,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

/**
 * 일별 지출 추이.
 *
 * 장부(목록)는 "무엇을 샀나"를, 순위 막대는 "어디에 썼나"를 답한다.
 * 이 차트만 답할 수 있는 질문은 "언제 많이 썼나"다 — 그래서 남겨 두었다.
 */
const ReportDailyTrend = ({records, from, to}: ReportDailyTrendProps) => {
  const days = useMemo(() => buildDays(records, from, to), [records, from, to]);
  const hasAny = days.some((d) => d.expense > 0);

  if (!hasAny) return null;

  return (
    <section>
      <h3 className="text-foreground text-sm font-semibold">언제 많이 썼나</h3>
      <div className="mt-3 h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days} margin={{top: 4, right: 0, bottom: 0, left: 0}} barCategoryGap={2}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={18}
              tick={{fontSize: 11, fill: "var(--fg-2)"}}
            />
            <Tooltip
              cursor={{fill: "var(--bg-2)"}}
              contentStyle={{
                background: "var(--bg-3)",
                border: "1px solid var(--line)",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
                padding: "0.375rem 0.625rem",
              }}
              labelStyle={{color: "var(--fg-2)"}}
              labelFormatter={(label) => `${label}일`}
              formatter={(value) =>
                [`${Number(value).toLocaleString("ko-KR")}원`, "지출"] as [string, string]
              }
            />
            <Bar dataKey="expense" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {days.map((d) => (
                /* 같은 강조색을 쓰되 오늘만 불투명하게 — 색을 늘리지 않고 하루를 짚는다 */
                <Cell key={d.day} fill="var(--pig-brand)" fillOpacity={d.isToday ? 1 : 0.28} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ReportDailyTrend;
