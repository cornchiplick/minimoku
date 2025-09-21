"use client";

import Icon from "@/shared/components/common/Icon";
import {URL} from "@/shared/constants/url";
import {useAuth} from "@/shared/lib/hooks/useAuth";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Nav = () => {
  const pathname = usePathname();
  const {isAuthenticated} = useAuth();

  return (
    <nav className="w-full bg-indigo-600 px-6 py-2 text-white">
      <div className="flex w-full flex-row items-center justify-between">
        <Link href={URL.HOME} className="flex cursor-pointer items-center justify-between">
          <Icon name="book" size={24} color="white" />
          <span className="text-2xl font-bold">일본어 회화 암기노트</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={URL.HOME}
            className={`flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700 ${pathname === URL.HOME ? "bg-indigo-700" : ""}`}>
            <Icon name="home" size={16} color="white" />홈
          </Link>
          <Link
            href={URL.PHRASES}
            className={`flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700 ${pathname === URL.PHRASES ? "bg-indigo-700" : ""}`}>
            <Icon name="listcheck" size={16} color="white" />
            문장목록
          </Link>
          <Link
            href={URL.QUIZ}
            className={`flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700 ${pathname === "quiz-ja-ko" ? "bg-indigo-700" : ""}`}>
            <Icon name="barchartver" size={16} color="white" />
            퀴즈
          </Link>
          <Link
            href={URL.HIRAKATA}
            className={`flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700 ${pathname === URL.HIRAKATA ? "bg-indigo-700" : ""}`}>
            <Icon name="table" size={16} color="white" />
            문자표
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => signOut({callbackUrl: URL.HOME})}
              className="flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700">
              <Icon name="logout" size={16} color="white" />
              로그아웃
            </button>
          ) : (
            <Link
              href={URL.LOGIN}
              className="flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700">
              <Icon name="login" size={16} color="white" />
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
