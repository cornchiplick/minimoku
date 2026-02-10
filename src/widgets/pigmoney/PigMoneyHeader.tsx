"use client";

import { useCashRecordStore } from "@/features/pigmoney/model/store/cashRecordStore";
import { getCashRecords } from "@/features/pigmoney/model/services/cashRecords.service";
import CashRecordAddButton from "@/features/pigmoney/ui/CashRecordAddButton";
import { Button } from "@/shared/components/atoms/button";
import { Switch } from "@/shared/components/atoms/switch";
import { DatePicker } from "@/shared/components/atoms/date-picker";
import { toDateString } from "@/shared/lib/utils/dateUtils";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";
import { PiggyBank, Search } from "lucide-react";
import { toast } from "sonner";

// PigMoney 헤더 위젯 (1줄: 로고+테마 / 2줄: 검색필터)
const PigMoneyHeader = () => {
  const { dateRange, setDateRange, showAll, setShowAll, setRecords, categories } =
    useCashRecordStore();

  // 검색 실행
  const handleSearch = async () => {
    try {
      const params: Record<string, string | number | boolean> = {};

      // 전체 토글이 꺼져있으면 날짜 구간 파라미터 추가
      if (!showAll && dateRange.from && dateRange.to) {
        params.fromDate = toDateString(dateRange.from);
        params.toDate = toDateString(dateRange.to);
      }

      const records = await getCashRecords({ params });
      setRecords(records);
    } catch {
      toast.error("조회에 실패했습니다.");
    }
  };

  return (
    <div className="bg-background-primary border-b">
      {/* 1줄: 로고 + 테마 토글 */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pigmoney-brand">
            <PiggyBank className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">PigMoney</span>
        </div>
        <ThemeToggleButton />
      </div>

      {/* 2줄: 검색 필터 */}
      <div className="flex flex-wrap items-center gap-3 border-t px-6 py-3">
        {/* 날짜 구간 선택 */}
        <DatePicker
          selected={dateRange.from}
          onSelect={(date) => setDateRange({ ...dateRange, from: date ?? null })}
          placeholder="시작일"
          disabled={showAll}
        />
        <span className="text-minimoku-neutral-bold">~</span>
        <DatePicker
          selected={dateRange.to}
          onSelect={(date) => setDateRange({ ...dateRange, to: date ?? null })}
          placeholder="종료일"
          disabled={showAll}
        />

        {/* 전체 토글 */}
        <div className="flex items-center gap-2">
          <span className="text-sm">전체</span>
          <Switch checked={showAll} onCheckedChange={setShowAll} />
        </div>

        {/* 검색 버튼 */}
        <Button onClick={handleSearch} variant="outline" className="cursor-pointer">
          <Search className="mr-1 h-4 w-4" />
          검색
        </Button>

        {/* 거래 추가 버튼 (우측 정렬) */}
        <div className="ml-auto">
          <CashRecordAddButton categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default PigMoneyHeader;
