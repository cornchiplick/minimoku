"use client";

import {URL} from "@/constants/url";
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
        style={{
          padding: "12px 25px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "1.1em",
          transition: "background-color 0.3s ease",
        }}>
        로그아웃
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn(`${provider}`, {callbackUrl: redirect})}
      style={{
        padding: "12px 25px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "1.1em",
        transition: "background-color 0.3s ease",
      }}>
      GitHub로 로그인
    </button>
  );
};

export default AuthButton;
