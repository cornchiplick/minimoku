import { Skeleton } from "@/shared/components/atoms/skeleton";

// 보고서 탭 스켈레톤 (PigMoneyReport 레이아웃 모방)
const ReportLoading = () => {
  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-y-auto">
      <div className="p-6">
        {/* 상단: 제목 + 월 선택기 */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* 요약 카드 3개 */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>

          {/* 도넛 차트 2개 */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>

          {/* 카테고리 목록 */}
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ReportLoading;
