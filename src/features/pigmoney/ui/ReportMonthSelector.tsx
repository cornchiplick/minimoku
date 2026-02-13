"use client";

import { Button } from "@/shared/components/atoms/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReportMonthSelectorProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

// 월 선택기 (좌우 화살표)
const ReportMonthSelector = ({ currentDate, onPrev, onNext }: ReportMonthSelectorProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="min-w-[120px] text-center text-lg font-semibold">
        {year}년 {month}월
      </span>
      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ReportMonthSelector;
