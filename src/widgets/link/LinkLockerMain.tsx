"use client";

import {LinkInterface} from "@/entities/link/types";
import LinkCard from "@/features/link/ui/LinkCard";
import Divider from "@/shared/components/molecules/Divider";
import Icon from "@/shared/components/molecules/Icon";
import Typography from "@/shared/home/atomic/Typography";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";
import {useSearchParams} from "next/navigation";

interface LinkLockerMainProps {
  initialLinks: LinkInterface[];
}

export default function LinkLockerMain({initialLinks}: LinkLockerMainProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  return (
    <div className="flex flex-1 flex-col">
      {/* Content Header */}
      <div className="bg-background-primary flex flex-row items-center justify-between px-6 py-4">
        <Typography.SubTitle1 className="font-semibold" keyword={keyword}>
          {!!keyword ? `검색: ${keyword}` : "최근 링크"}
        </Typography.SubTitle1>
        <ThemeToggleButton />
      </div>

      <Divider />

      {/* Content Area */}
      <div className="bg-background-secondary flex-1 overflow-y-auto p-6">
        <div className="w-full space-y-4">
          {!!initialLinks.length ? (
            initialLinks.map((linkData) => (
              <LinkCard key={linkData.id} data={linkData} keyword={keyword} />
            ))
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
              <Icon name="box" size={120} color="white" />
              <Typography.SubTitle1 className="opacity-50">
                추가된 링크가 없습니다.
              </Typography.SubTitle1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
