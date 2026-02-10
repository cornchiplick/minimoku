"use client";

import {
  CashRecordInterface,
  CashRecordType,
  CategoryInterface,
} from "@/entities/pigmoney/types";
import useCashRecordFilter from "@/features/pigmoney/model/hooks/useCashRecordFilter";
import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import CashRecordList from "@/features/pigmoney/ui/CashRecordList";
import { DEFAULT_DATE_RANGE_DAYS } from "@/shared/constants/pigmoney";
import { getDateRange } from "@/shared/lib/utils/dateUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { useEffect } from "react";

interface PigMoneyMainProps {
  initialRecords: CashRecordInterface[];
  initialCategories: CategoryInterface[];
}

// PigMoney 메인 위젯 (수입/지출 목록)
const PigMoneyMain = ({ initialRecords, initialCategories }: PigMoneyMainProps) => {
  const { setRecords, setCategories, setDateRange } = useCashRecordStore();
  const { incomeRecords, expenseRecords } = useCashRecordFilter();

  // 초기 데이터 로드 및 기본 날짜 구간 설정
  useEffect(() => {
    setRecords(initialRecords);
    setCategories(initialCategories);
    const { from, to } = getDateRange(DEFAULT_DATE_RANGE_DAYS);
    setDateRange({ from, to });
  }, [initialRecords, initialCategories, setRecords, setCategories, setDateRange]);

  return (
    <div className="bg-background-secondary flex-1 overflow-y-auto p-6">
      {/* PC: 좌우 분할 (수입 / 지출) */}
      <div className="hidden gap-6 md:grid md:grid-cols-2">
        <CashRecordList
          records={incomeRecords}
          type={CashRecordType.INCOME}
          categories={initialCategories}
        />
        <CashRecordList
          records={expenseRecords}
          type={CashRecordType.EXPENSE}
          categories={initialCategories}
        />
      </div>

      {/* 모바일: 탭 전환 */}
      <div className="md:hidden">
        <Tabs defaultValue="expense">
          <TabsList className="w-full">
            <TabsTrigger value="income" className="flex-1">
              수입 ({incomeRecords.length})
            </TabsTrigger>
            <TabsTrigger value="expense" className="flex-1">
              지출 ({expenseRecords.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <CashRecordList
              records={incomeRecords}
              type={CashRecordType.INCOME}
              categories={initialCategories}
            />
          </TabsContent>
          <TabsContent value="expense">
            <CashRecordList
              records={expenseRecords}
              type={CashRecordType.EXPENSE}
              categories={initialCategories}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PigMoneyMain;
