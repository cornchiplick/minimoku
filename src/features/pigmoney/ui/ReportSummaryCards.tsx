"use client";

import { Card, CardContent } from "@/shared/components/atoms/card";

interface ReportSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// 보고서 요약 카드 3칸 (총 수입 / 총 지출 / 잔액)
const ReportSummaryCards = ({ totalIncome, totalExpense, balance }: ReportSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* 총 수입 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-minimoku-neutral-bold">총 수입</p>
          <p className="mt-1 text-lg font-semibold text-pigmoney-income">
            +{totalIncome.toLocaleString()} 원
          </p>
        </CardContent>
      </Card>

      {/* 총 지출 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-minimoku-neutral-bold">총 지출</p>
          <p className="mt-1 text-lg font-semibold text-pigmoney-expense">
            -{totalExpense.toLocaleString()} 원
          </p>
        </CardContent>
      </Card>

      {/* 잔액 */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-minimoku-neutral-bold">잔액</p>
          <p className="mt-1 text-lg font-semibold text-pigmoney-balance">
            {balance.toLocaleString()} 원
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportSummaryCards;
