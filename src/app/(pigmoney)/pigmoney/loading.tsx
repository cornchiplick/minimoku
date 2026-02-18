import { Skeleton } from "@/shared/components/atoms/skeleton";

// 쓰기 탭 스켈레톤 (PigMoneyMain 레이아웃 모방)
const PigMoneyLoading = () => {
  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-hidden">
      {/* 서브 헤더 */}
      <div className="bg-background-primary border-b">
        {/* 첫 번째 줄: 날짜 구간 + 검색 */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-6 pt-3 pb-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-9 w-[140px] rounded-md" />
          <Skeleton className="mx-1 h-4 w-4" />
          <Skeleton className="h-9 w-[140px] rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-5 w-8" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>

        {/* 두 번째 줄: 탭 + 저장 버튼 */}
        <div className="flex items-center justify-between px-6 pb-3">
          <div className="flex gap-1">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-3 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
        ))}

        {/* + 버튼 */}
        <Skeleton className="h-12 w-full rounded-lg" />

        {/* 합계 */}
        <div className="flex items-center justify-between border-t-2 pt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};

export default PigMoneyLoading;
