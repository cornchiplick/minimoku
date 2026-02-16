import { Skeleton } from "@/shared/components/atoms/skeleton";

// 달력 탭 스켈레톤 (PigMoneyCalendar 레이아웃 모방)
const CalendarLoading = () => {
  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-y-auto">
      <div className="p-6">
        {/* 제목 */}
        <Skeleton className="mb-4 h-6 w-12" />

        {/* 달력 헤더 (요일) */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="mx-auto h-4 w-6" />
          ))}
        </div>

        {/* 달력 그리드 (5주) */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarLoading;
