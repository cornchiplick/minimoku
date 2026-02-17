"use client";

import {URL} from "@/shared/constants/url";
import Typography from "@/shared/home/atomic/Typography";
import LoginButton from "@/widgets/auth/LoginButton";
import Head from "next/head";

const LoginPage = () => {
  return (
    <div className="bg-background-tertiary flex min-h-screen items-center justify-center">
      <Head>
        <title>로그인 | 내 앱</title>
      </Head>

      <div className="bg-background-primary flex w-full max-w-md flex-col items-center gap-8 rounded-2xl p-10 shadow-2xl">
        <Typography.Head1 className="mb-2 tracking-tight">MiniMoku</Typography.Head1>
        <Typography.Head3 className="mb-2 tracking-tight">
          MiniMoku에 오신 것을 환영합니다!
        </Typography.Head3>
        <div>
          <Typography.P2 className="text-center">
            각종 링크를 안전하게 관리하고 저장하세요!
          </Typography.P2>
          <Typography.P2 className="text-center">소셜 계정으로 간편 로그인!</Typography.P2>
        </div>
        <div className="flex w-full flex-col gap-4">
          <LoginButton.Github redirect={URL.HOME} />
          <LoginButton.Google redirect={URL.HOME} />
          <LoginButton.Kakao redirect={URL.HOME} />
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          서비스 이용을 위해 반드시 로그인이 필요합니다.
          <br />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
