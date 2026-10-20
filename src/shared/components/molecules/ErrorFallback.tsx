"use client";

import {Button} from "@/shared/components/atoms/button";
import {useEffect} from "react";

interface ErrorFallbackProps {
  /** Next.js 가 error.tsx 에 넘겨주는 에러 객체 */
  error: Error & {digest?: string};
  /** 해당 세그먼트를 다시 렌더링하는 함수 */
  reset: () => void;
  /** 화면에 표시할 안내 문구 (서비스별로 다르게 줄 수 있다) */
  message?: string;
}

/**
 * error.tsx 에서 공통으로 쓰는 에러 화면.
 * 서버 컴포넌트에서 try/catch 로 JSX 를 감싸는 대신, 에러를 그대로 던지고 이 바운더리가 받는다.
 */
const ErrorFallback = ({error, reset, message}: ErrorFallbackProps) => {
  useEffect(() => {
    // 서버에서 발생한 에러는 digest 로만 식별된다 (메시지는 클라이언트에 노출되지 않음)
    console.error("[error boundary]", error.digest ?? error.message);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-foreground text-lg font-medium">
        {message ?? "문제가 발생해 화면을 불러오지 못했습니다."}
      </p>
      <p className="text-minimoku-neutral-bold text-sm">
        잠시 후 다시 시도해 주세요. 계속 발생하면 새로고침해 주세요.
      </p>
      <Button onClick={reset} variant="default">
        다시 시도
      </Button>
    </div>
  );
};

export default ErrorFallback;
