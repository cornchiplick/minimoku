"use client";

import Icon from "@/components/common/Icon";
import {URL} from "@/constants/url";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Nav = () => {
  const pathname = usePathname();

  // TODO 로그인 상태를 관리하는 상태 변수 : next/auth 로 구현할것
  const isLoggedIn = false;

  return (
    <nav className="bg-indigo-600 p-4 text-white">
      <div className="container flex flex-col md:flex-row md:items-center md:justify-between">
        <Link href={URL.HOME} className="flex cursor-pointer items-center justify-between">
          <Icon name="book" size={24} color="white" />
          <span className="text-2xl font-bold">일본어 회화 암기노트</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href={URL.HOME}
            className={`flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700 ${pathname === URL.HOME ? "bg-indigo-700" : ""}`}>
            <Icon name="home" size={16} color="white" />홈
          </Link>
          <Link
            href={isLoggedIn ? URL.PHRASES : URL.LOGIN}
            className={`flex items-center gap-1 rounded px-3 py-2 hover:bg-indigo-700 ${pathname === URL.PHRASES ? "bg-indigo-700" : ""}`}>
            <Icon name="listcheck" size={16} color="white" />
            문장목록
          </Link>
          <Link
            href={isLoggedIn ? URL.QUIZ : URL.LOGIN}
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
          {/* 
            // TODO Link 태그를 사용해서 다른 URL 로 이동시킬 것 (로그인인 경우 로그인 모달을 사용할 것인지 페이지를 넘길 것인지 먼저 결정) */}
          {isLoggedIn ? (
            <button
              // onClick={handleLogout}
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
