"use client";

import {CashRecordType, CategoryBreakdown} from "@/entities/pigmoney/types";
import {cn} from "@/shared/lib/utils/commonUtils";

interface ReportCategoryRankingProps {
  breakdown: CategoryBreakdown[];
  type: CashRecordType;
  /** 섹션 제목 — 질문 형태로 적어 보고서가 무엇에 답하는지 드러낸다 */
  heading: string;
  emptyText: string;
}

/**
 * 카테고리를 금액 순으로 세우고 비율을 막대로 보여준다.
 *
 * 도넛 차트 대신 순위 막대를 쓴 이유: 보고서가 답해야 할 질문은 "어디에 얼마나 썼나"이고,
 * 그건 조각 넓이를 눈대중으로 비교하는 것보다 줄 세워 읽는 쪽이 정확하다.
 */
const ReportCategoryRanking = ({
  breakdown,
  type,
  heading,
  emptyText,
}: ReportCategoryRankingProps) => {
  const items = breakdown.filter((b) => b.type === type).sort((a, b) => b.total - a.total);
  const total = items.reduce((sum, b) => sum + b.total, 0);
  const max = items[0]?.total ?? 0;
  const isExpense = type === CashRecordType.EXPENSE;

  return (
    <section>
      <h2 className="text-foreground text-sm font-semibold">{heading}</h2>

      {items.length === 0 ? (
        <p className="text-minimoku-neutral-bold mt-3 text-sm">{emptyText}</p>
      ) : (
        <ul className="mt-3">
          {items.map((item) => {
            const share = total > 0 ? (item.total / total) * 100 : 0;
            const width = max > 0 ? (item.total / max) * 100 : 0;

            return (
              <li
                key={item.categoryName}
                className="border-border grid grid-cols-[5rem_1fr_auto] items-center gap-3 border-b py-2.5 last:border-b-0 sm:grid-cols-[6rem_1fr_auto_3.5rem]">
                <span className="text-foreground truncate text-[0.9375rem]">
                  {item.categoryName}
                </span>

                {/* 막대 — 가장 큰 항목을 100% 로 두고 상대 길이를 보여준다 */}
                <span className="bg-background-secondary h-1.5 w-full overflow-hidden rounded-full">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      isExpense ? "bg-pigmoney-brand" : "bg-pigmoney-income"
                    )}
                    style={{width: `${width}%`}}
                  />
                </span>

                <span className="text-foreground w-24 text-right text-[0.9375rem] font-semibold tabular-nums">
                  {item.total.toLocaleString("ko-KR")}
                </span>
                <span className="text-minimoku-neutral-bold hidden text-right text-xs tabular-nums sm:block">
                  {share.toFixed(0)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ReportCategoryRanking;
