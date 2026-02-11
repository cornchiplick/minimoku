import { CalendarDays } from "lucide-react";

// 달력 페이지 (Phase 2 구현 예정)
const CalendarPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <CalendarDays className="h-12 w-12 text-minimoku-neutral-bold" />
      <p className="text-lg font-medium text-minimoku-neutral-bold">달력 — 준비 중</p>
      <p className="text-sm text-minimoku-neutral-bold">일별 수입·지출을 달력에서 확인할 수 있습니다.</p>
    </div>
  );
};

export default CalendarPage;
