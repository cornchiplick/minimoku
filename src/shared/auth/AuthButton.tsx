"use client";

import {URL} from "@/shared/constants/url";
import {signIn, signOut, useSession} from "next-auth/react";

interface AuthButtonProps {
  provider?: "github" | "kakao" | "google";
  redirect?: string;
}

/**
 * provider("github" | "kakao" | "google") 중 하나로 로그인
 *
 * 로그인: 기본: 로그인 후 현재 페이지로 리다이렉트 / redirect prop 있는 경우 해당 경로로 redirect함
 *
 * 로그아웃: "/" 으로 redirect
 */
const AuthButton = ({provider = "github", redirect = URL.LOGIN}: AuthButtonProps) => {
  const {data: session} = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut({callbackUrl: URL.HOME})}
        className="cursor-pointer rounded-lg border-none bg-red-600 px-6 py-3 text-[1.1em] text-white transition-colors duration-300 hover:bg-red-700">
        로그아웃
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn(`${provider}`, {callbackUrl: redirect})}
      className="cursor-pointer rounded-lg border-none bg-blue-600 px-6 py-3 text-[1.1em] text-white transition-colors duration-300 hover:bg-blue-700">
      GitHub로 로그인
    </button>
  );
};

export default AuthButton;
