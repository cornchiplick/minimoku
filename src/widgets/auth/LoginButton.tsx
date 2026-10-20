"use client";

import {cn} from "@/shared/lib/utils/commonUtils";
import {GithubMark, GoogleMark, KakaoMark} from "@/widgets/auth/ProviderMark";
import {signIn} from "next-auth/react";
import {useState} from "react";

type ProviderType = "github" | "google" | "kakao";

interface LoginButtonProps {
  /** 로그인 후 이동할 경로 */
  redirect?: string;
}

/**
 * 제공자별 공식 색. 각 서비스가 지정한 값이라 디자인 토큰으로 바꾸지 않는다.
 * 다크모드에서는 구글·깃허브가 따로 어두운 변형을 제공하므로 그걸 쓴다.
 */
const PROVIDERS: Record<
  ProviderType,
  {label: string; mark: () => React.ReactElement; className: string}
> = {
  google: {
    label: "Google로 계속하기",
    mark: GoogleMark,
    className:
      "border border-[#747775] bg-white text-[#1f1f1f] hover:bg-[#f2f2f2] " +
      "dark:border-[#8e918f] dark:bg-[#131314] dark:text-[#e3e3e3] dark:hover:bg-[#1e1f20]",
  },
  github: {
    label: "GitHub로 계속하기",
    mark: GithubMark,
    className:
      "border border-transparent bg-[#24292f] text-white hover:bg-[#32383f] " +
      "dark:border-[#3d444d] dark:bg-[#212830] dark:hover:bg-[#2a313c]",
  },
  kakao: {
    label: "카카오로 계속하기",
    mark: KakaoMark,
    className: "border border-transparent bg-[#fee500] text-[#191600] hover:bg-[#f0d800]",
  },
};

const BaseLoginButton = ({provider, redirect}: LoginButtonProps & {provider: ProviderType}) => {
  const {label, mark: Mark, className} = PROVIDERS[provider];
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signIn(provider, redirect ? {callbackUrl: redirect} : undefined);
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
        "focus-visible:ring-minimoku relative flex h-11 w-full cursor-pointer items-center",
        "rounded-lg px-4 text-sm font-medium transition-colors",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-default disabled:opacity-60",
        className
      )}>
      <Mark />
      {/* 마크는 왼쪽에 고정하고 글자는 버튼 가운데에 둔다 */}
      <span className="pointer-events-none absolute inset-x-11 text-center">{label}</span>
    </button>
  );
};

export const LoginButton = {
  Github: (props: LoginButtonProps) => <BaseLoginButton provider="github" {...props} />,
  Google: (props: LoginButtonProps) => <BaseLoginButton provider="google" {...props} />,
  Kakao: (props: LoginButtonProps) => <BaseLoginButton provider="kakao" {...props} />,
};

export default LoginButton;
