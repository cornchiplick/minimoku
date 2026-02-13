"use client";

import { CategoryBreakdown, CashRecordType } from "@/entities/pigmoney/types";
import { Card, CardContent } from "@/shared/components/atoms/card";

interface ReportCategoryListProps {
  breakdown: CategoryBreakdown[];
}

// 카테고리별 금액/비율 상세 테이블
const ReportCategoryList = ({ breakdown }: ReportCategoryListProps) => {
  const expenseItems = breakdown.filter((b) => b.type === CashRecordType.EXPENSE);
  const incomeItems = breakdown.filter((b) => b.type === CashRecordType.INCOME);

  const totalExpense = expenseItems.reduce((sum, b) => sum + b.total, 0);
  const totalIncome = incomeItems.reduce((sum, b) => sum + b.total, 0);

  // 금액 내림차순 정렬
  const sortedExpense = [...expenseItems].sort((a, b) => b.total - a.total);
  const sortedIncome = [...incomeItems].sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardContent className="p-4">
        <p className="mb-3 text-sm font-semibold">카테고리별 상세</p>

        <div className="grid grid-cols-2 gap-6">
          {/* 지출 */}
          <div>
            <p className="mb-2 text-xs font-medium text-pigmoney-expense">지출</p>
            {sortedExpense.length === 0 ? (
              <p className="text-xs text-minimoku-neutral-bold">데이터 없음</p>
            ) : (
              <table className="w-full">
                <tbody>
                  {sortedExpense.map((item) => (
                    <tr key={item.categoryName} className="border-b border-background-secondary">
                      <td className="py-1.5 text-xs">{item.categoryName}</td>
                      <td className="py-1.5 text-right text-xs font-medium">
                        {item.total.toLocaleString()} 원
                      </td>
                      <td className="py-1.5 pl-2 text-right text-xs text-minimoku-neutral-bold">
                        {totalExpense > 0 ? ((item.total / totalExpense) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 수입 */}
          <div>
            <p className="mb-2 text-xs font-medium text-pigmoney-income">수입</p>
            {sortedIncome.length === 0 ? (
              <p className="text-xs text-minimoku-neutral-bold">데이터 없음</p>
            ) : (
              <table className="w-full">
                <tbody>
                  {sortedIncome.map((item) => (
                    <tr key={item.categoryName} className="border-b border-background-secondary">
                      <td className="py-1.5 text-xs">{item.categoryName}</td>
                      <td className="py-1.5 text-right text-xs font-medium">
                        {item.total.toLocaleString()} 원
                      </td>
                      <td className="py-1.5 pl-2 text-right text-xs text-minimoku-neutral-bold">
                        {totalIncome > 0 ? ((item.total / totalIncome) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCategoryList;
