import {
  CashRecordInterface,
  CashRecordType,
  CategoryBreakdown,
} from "@/entities/pigmoney/types";

export interface CashRecordStats {
  incomeRecords: CashRecordInterface[];
  expenseRecords: CashRecordInterface[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown[];
}

// 거래 목록에서 통계 계산 (순수 함수)
export function computeCashRecordStats(records: CashRecordInterface[]): CashRecordStats {
  const incomeRecords = records.filter((r) => r.type === CashRecordType.INCOME);
  const expenseRecords = records.filter((r) => r.type === CashRecordType.EXPENSE);

  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;

  // 카테고리별 합산
  const map = new Map<string, CategoryBreakdown>();
  records.forEach((r) => {
    const categoryName = r.category?.name ?? "미분류";
    const key = `${categoryName}-${r.type}`;
    const existing = map.get(key);

    if (existing) {
      existing.total += r.amount;
    } else {
      map.set(key, {
        categoryName,
        total: r.amount,
        type: r.type as CashRecordType,
      });
    }
  });

  return {
    incomeRecords,
    expenseRecords,
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown: Array.from(map.values()),
  };
}
