"use client";

import {GUEST_PROVIDER} from "@/shared/lib/utils/guestUtils";
import {cn} from "@/shared/lib/utils/commonUtils";
import {Loader2} from "lucide-react";
import {getSession, signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

interface GuestStartButtonProps {
  /** 로그인 후 이동할 경로 */
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * 로그인 없이 바로 들어가는 버튼.
 * 모든 방문자가 하나의 게스트 계정을 공유하고, 매일 04:00 에 샘플 상태로 돌아간다.
 *
 * 이미 로그인돼 있으면(내 계정이든 게스트든) 세션을 건드리지 않고 그대로 들어간다.
 * 내 계정으로 로그인한 채 눌렀을 때 게스트 세션으로 덮어쓰지 않기 위해서다.
 */
const GuestStartButton = ({href, children, className}: GuestStartButtonProps) => {
  const router = useRouter();
  // 세션 확인·게스트 로그인 중
  const [isSigningIn, setIsSigningIn] = useState(false);
  // 화면 이동 중. 이동이 끝나면 저절로 풀린다 — 뒤로 가기로 이 화면이 상태째 돌아와도 굳어 있지 않게
  const [isNavigating, startNavigation] = useTransition();
  const isLoading = isSigningIn || isNavigating;

  const handleClick = async () => {
    if (isLoading) return;
    setIsSigningIn(true);

    // 세션 확인이 실패하면 로그인돼 있다고 보고 이동만 한다 — 실패가 덮어쓰기로 이어지지 않게
    const hasSession = await getSession().then(
      (session) => session != null,
      () => true
    );
    if (hasSession) {
      setIsSigningIn(false);
      startNavigation(() => router.push(href));
      return;
    }

    try {
      await signIn(GUEST_PROVIDER, {callbackUrl: href});
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "focus-visible:ring-minimoku bg-foreground text-background-primary inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:opacity-60",
        className
      )}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default GuestStartButton;
