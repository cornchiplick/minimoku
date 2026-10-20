"use client";

import {GUEST_PROVIDER} from "@/shared/lib/utils/guestUtils";
import {cn} from "@/shared/lib/utils/commonUtils";
import {Loader2} from "lucide-react";
import {signIn} from "next-auth/react";
import {useState} from "react";

interface GuestStartButtonProps {
  /** 로그인 후 이동할 경로 */
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "quiet";
  className?: string;
}

/**
 * 로그인 없이 바로 들어가는 버튼.
 * 모든 방문자가 하나의 게스트 계정을 공유하고, 매일 04:00 에 샘플 상태로 돌아간다.
 */
const GuestStartButton = ({
  href,
  children,
  variant = "solid",
  className,
}: GuestStartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signIn(GUEST_PROVIDER, {callbackUrl: href});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "focus-visible:ring-minimoku inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60",
        variant === "solid"
          ? "bg-foreground text-background-primary hover:opacity-90"
          : "border-border text-foreground hover:bg-background-secondary border",
        className
      )}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default GuestStartButton;
