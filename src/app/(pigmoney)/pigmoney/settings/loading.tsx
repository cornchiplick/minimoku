import { Skeleton } from "@/shared/components/atoms/skeleton";

// 설정 탭 스켈레톤 (PigMoneySettings 레이아웃 모방)
const SettingsLoading = () => {
  return (
    <div className="bg-background-secondary flex flex-1 flex-col overflow-hidden">
      <div className="p-6">
        {/* 제목 */}
        <Skeleton className="mb-6 h-6 w-24" />

        <div className="flex max-w-md flex-col gap-6">
          {/* 설정 항목 1: 월 시작일 */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-72" />
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>

          {/* 설정 항목 2: 주 시작 요일 */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-9 w-40 rounded-md" />
          </div>

          {/* 저장 버튼 */}
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SettingsLoading;
