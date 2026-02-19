"use client";

import Icon from "@/shared/components/molecules/Icon";
import {URL} from "@/shared/constants/url";
import {cn} from "@/shared/lib/utils/commonUtils";
import {signIn} from "next-auth/react";

type ProviderType = "github" | "google" | "kakao";

interface LoginButtonProps {
  redirect?: string;
}

const loginButtonMap: Record<ProviderType, {title: string; style: string}> = {
  github: {
    title: "GitHub 로그인",
    style: "bg-gray-900 hover:bg-gray-900 text-white",
  },
  google: {
    title: "Google 로그인",
    style: "bg-green-600 hover:bg-green-700 text-white",
  },
  kakao: {
    title: "Kakao 로그인",
    style: "bg-yellow-500 hover:bg-yellow-600 text-gray-900",
  },
};

/**
 * provider("github" | "google" | "kakao") 중 하나로 로그인
 * 로그인: 기본: 로그인 후 현재 페이지로 리다이렉트 / redirect prop 있는 경우 해당 경로로 redirect함
 */
const BaseLoginButton = ({
  provider,
  redirect = URL.LOGIN,
}: LoginButtonProps & {provider: ProviderType}) => {
  const style = loginButtonMap[provider].style;
  const title = loginButtonMap[provider].title;

  return (
    <button
      onClick={() => signIn(`${provider}`, {callbackUrl: redirect})}
      className={cn(
        style,
        "round-3xl flex cursor-pointer items-center justify-center gap-2 rounded-4xl border-none px-6 py-3 text-lg font-bold"
      )}>
      <Icon name={provider} bgColor={provider !== "kakao" ? "white" : undefined} rx="10" />
      {title}
    </button>
  );
};

export const LoginButton = {
  Github: (props: LoginButtonProps) => <BaseLoginButton provider="github" {...props} />,
  Google: (props: LoginButtonProps) => <BaseLoginButton provider="google" {...props} />,
  Kakao: (props: LoginButtonProps) => <BaseLoginButton provider="kakao" {...props} />,
};

export default LoginButton;
