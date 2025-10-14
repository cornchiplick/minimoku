"use client";

import {LinkInterface} from "@/entities/link/types";
import LinkCard from "@/features/link/ui/LinkCard";
import Divider from "@/shared/components/molecules/Divider";
import Typography from "@/shared/home/atomic/Typography";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";

interface LinkLockerMainProps {
  initialLinks: LinkInterface[];
}

export default function LinkLockerMain({initialLinks}: LinkLockerMainProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Content Header */}
      <div className="bg-background-primary flex flex-row items-center justify-between px-6 py-4">
        <Typography.SubTitle1 className="font-semibold">최근 링크</Typography.SubTitle1>
        <ThemeToggleButton />
      </div>

      <Divider />

      {/* Content Area */}
      <div className="bg-background-secondary flex-1 overflow-y-auto p-6">
        <div className="w-full space-y-4">
          {initialLinks.map((linkData) => (
            <LinkCard key={linkData.id} data={linkData} />
          ))}
        </div>
      </div>
    </div>
  );
}
