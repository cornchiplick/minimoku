"use client";

import LoginButton from "@/widgets/auth/LoginButton";
import GuestStartButton from "@/widgets/home/GuestStartButton";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

/**
 * 로그인 수단을 모아 둔 패널.
 *
 * 들어오려던 경로는 미인증 리다이렉트(proxy.ts)가 `?callbackUrl=` 로 붙여 준다.
 * 그 값을 그대로 넘겨 로그인 후 원래 가려던 곳으로 보낸다.
 */
const LoginPanel = () => {
  const searchParams = useSearchParams();

  // 외부 주소로 튕겨 나가지 않도록 앱 안의 경로만 받는다
  const requested = searchParams.get("callbackUrl") ?? "";
  const redirect = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/link";

  return (
    <>
      <Link
        href="/"
        className="text-minimoku-neutral-bold hover:text-foreground text-sm transition-colors">
        ← MiniMoku
      </Link>

      <h1 className="text-title mt-8 font-bold">들어가기</h1>
      <p className="text-minimoku-neutral-bold mt-3 text-[0.9375rem] leading-relaxed">
        링크를 모아 두는 LinkLocker 와 가계부 PigMoney 를 쓸 수 있습니다. 먼저 둘러보고 싶다면
        로그인하지 않아도 됩니다.
      </p>

      <div className="mt-8">
        <GuestStartButton href={redirect} className="w-full">
          로그인 없이 둘러보기
        </GuestStartButton>
        <p className="text-minimoku-neutral-bold mt-2.5 text-[0.8125rem] leading-relaxed">
          체험 계정은 모든 방문자가 함께 씁니다. 매일 새벽 4시에 처음 상태로 돌아갑니다.
        </p>
      </div>

      {/* 구분선 — 가운데에 라벨을 둔다 */}
      <div className="my-8 flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-minimoku-neutral-bold text-xs">내 계정으로</span>
        <span className="bg-border h-px flex-1" />
      </div>

      <div className="flex flex-col gap-2.5">
        <LoginButton.Google redirect={redirect} />
        <LoginButton.Github redirect={redirect} />
        <LoginButton.Kakao redirect={redirect} />
      </div>
    </>
  );
};

export default LoginPanel;
