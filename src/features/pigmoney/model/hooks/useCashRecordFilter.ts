import {
  CashRecordType,
  CategoryBreakdown,
} from "@/entities/pigmoney/types";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { useMemo } from "react";

const useCashRecordFilter = () => {
  const { records, dateRange, showAll } = useCashRecordStore();

  // 필터 조건에 따라 거래 필터링
  const filteredRecords = useMemo(() => {
    if (showAll) return records;

    if (!dateRange.from || !dateRange.to) return records;

    return records.filter((r) => {
      const date = new Date(r.date);
      return date >= dateRange.from! && date <= dateRange.to!;
    });
  }, [records, dateRange, showAll]);

  // 수입/지출 분리
  const incomeRecords = useMemo(
    () => filteredRecords.filter((r) => r.type === CashRecordType.INCOME),
    [filteredRecords],
  );

  const expenseRecords = useMemo(
    () => filteredRecords.filter((r) => r.type === CashRecordType.EXPENSE),
    [filteredRecords],
  );

  // 합계 계산
  const totalIncome = useMemo(
    () => incomeRecords.reduce((sum, r) => sum + r.amount, 0),
    [incomeRecords],
  );

  const totalExpense = useMemo(
    () => expenseRecords.reduce((sum, r) => sum + r.amount, 0),
    [expenseRecords],
  );

  const balance = totalIncome - totalExpense;

  // 카테고리별 합산 (원형 그래프 확장 대비)
  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const map = new Map<string, CategoryBreakdown>();

    filteredRecords.forEach((r) => {
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

    return Array.from(map.values());
  }, [filteredRecords]);

  return {
    filteredRecords,
    incomeRecords,
    expenseRecords,
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown,
  };
};

export default useCashRecordFilter;
