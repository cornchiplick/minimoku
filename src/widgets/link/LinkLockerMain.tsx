"use client";

import {LinkInterface} from "@/entities/link/types";
import LinkCard from "@/features/link/ui/LinkCard";
import Divider from "@/shared/components/molecules/Divider";
import Icon from "@/shared/components/molecules/Icon";
import MobileSidebarTrigger from "@/widgets/sidebar/MobileSidebarTrigger";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";
import {Inbox} from "lucide-react";
import {useSearchParams} from "next/navigation";

interface LinkLockerMainProps {
  initialLinks: LinkInterface[];
  folderName?: string; // 폴더명 (선택적)
}

export default function LinkLockerMain({initialLinks, folderName}: LinkLockerMainProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  // 헤더 제목 결정 (검색 > 폴더명 > 최근 링크 순서)
  const getHeaderTitle = () => {
    if (keyword) return `검색: ${keyword}`;
    if (folderName) return folderName;
    return "최근 링크";
  };

  // 폴더 아이콘 표시 여부
  const showFolderIcon = !keyword && !!folderName;

  // 비어 있는 이유가 검색·폴더·전체 중 무엇인지에 따라 안내를 달리한다
  const emptyTitle = keyword
    ? `"${keyword}" 와 맞는 링크가 없습니다`
    : "아직 저장한 링크가 없습니다";
  const emptyHint = keyword
    ? "다른 낱말로 찾아보세요."
    : "왼쪽 위 '링크 추가' 로 첫 링크를 담아 보세요.";

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Content Header */}
      <div className="bg-background-primary flex flex-row items-center justify-between gap-2 px-4 py-3 md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          {/* 모바일에서만 보이는 사이드바 열기 버튼 */}
          <MobileSidebarTrigger />
          {showFolderIcon && <Icon name="folder" size={24} color="currentColor" />}
          <h1 className="text-foreground truncate text-xl font-semibold">{getHeaderTitle()}</h1>
        </div>
        <ThemeToggleButton />
      </div>

      <Divider />

      {/* Content Area */}
      <div className="bg-background-primary min-h-0 flex-1 overflow-y-auto px-4 md:px-6">
        <div className="mx-auto w-full max-w-3xl">
          {!!initialLinks.length ? (
            initialLinks.map((linkData) => (
              <LinkCard key={linkData.id} data={linkData} keyword={keyword} />
            ))
          ) : (
            // 빈 화면은 분위기가 아니라 다음 행동을 알려주는 자리다
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
              <Inbox className="text-minimoku-neutral-bold h-10 w-10" aria-hidden />
              <p className="text-foreground mt-4 text-[0.9375rem] font-medium">{emptyTitle}</p>
              <p className="text-minimoku-neutral-bold mt-1.5 text-sm">{emptyHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
