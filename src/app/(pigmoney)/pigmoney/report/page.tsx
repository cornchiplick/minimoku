import { BarChart3 } from "lucide-react";

// 보고서 페이지 (Phase 2 구현 예정)
const ReportPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <BarChart3 className="h-12 w-12 text-minimoku-neutral-bold" />
      <p className="text-lg font-medium text-minimoku-neutral-bold">보고서 — 준비 중</p>
      <p className="text-sm text-minimoku-neutral-bold">월별·카테고리별 분석 기능이 곧 추가됩니다.</p>
    </div>
  );
};

export default ReportPage;
