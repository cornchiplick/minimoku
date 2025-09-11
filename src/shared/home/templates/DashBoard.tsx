"use client";

import Icon from "@/shared/common/Icon";
import SentenceCard from "@/shared/common/SentenceCard";
import {SAMPLE_PHRASES} from "@/shared/constants/examples";
import {URL} from "@/shared/constants/url";
import {Phrase} from "@/shared/types/phrase";
import Link from "next/link";

interface DashBoardProps {
  isAuthenticated: boolean;
  userPhrases?: Phrase[];
}

const DashBoard = ({isAuthenticated = false, userPhrases = []}: DashBoardProps) => {
  return (
    <div className="container flex flex-col gap-8 px-4 py-8">
      {!isAuthenticated && (
        <div className="flex flex-col gap-2 rounded-lg bg-indigo-100 p-4">
          <p className="text-center">
            로그인하시면 문장 추가, 퀴즈 풀기 등 더 많은 기능을 이용하실 수 있습니다.
          </p>
          <div className="flex justify-center">
            <Link
              href={URL.LOGIN}
              className="focus:shadow-outline inline-flex items-center gap-1 rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none">
              <Icon name="login" size={24} color="white" />
              로그인
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Icon name="book" size={24} color="black" />
          {isAuthenticated ? "내 일본어 회화 문장" : "예시 회화 문장"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(isAuthenticated ? userPhrases : SAMPLE_PHRASES).slice(0, 4).map((phrase) => (
            <SentenceCard key={phrase.id} phrase={phrase} />
          ))}
        </div>
        {!isAuthenticated && (
          <div className="flex justify-end">
            <Link
              href={URL.PHRASES}
              className="flex items-center text-indigo-600 hover:text-indigo-800">
              <Icon name="listcheck" size={20} color="#4f46e5" />
              전체 보기
            </Link>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Link
          href={isAuthenticated ? URL.QUIZ : URL.LOGIN}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md ${!isAuthenticated && "opacity-75"}`}
          aria-label={!isAuthenticated ? "로그인이 필요한 기능입니다" : undefined}>
          <Icon name="barchartver" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">일본어 → 한국어 퀴즈</h3>
          {!isAuthenticated && <span className="sr-only">로그인 필요</span>}
        </Link>
        <Link
          href={isAuthenticated ? URL.QUIZ : URL.LOGIN}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md ${!isAuthenticated && "opacity-75"}`}>
          <Icon name="barcharthor" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">한국어 → 일본어 퀴즈</h3>
        </Link>
        <Link
          href={URL.HIRAKATA}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md">
          <Icon name="table" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">히라가나/카타카나 표</h3>
        </Link>
        <Link
          href={isAuthenticated ? URL.ACCUMULATE : URL.LOGIN}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md ${!isAuthenticated && "opacity-75"}`}
          aria-label={!isAuthenticated ? "로그인이 필요한 기능입니다" : undefined}>
          <Icon name="edit" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">새 문장 추가하기</h3>
          {!isAuthenticated && <span className="sr-only">로그인 필요</span>}
        </Link>
      </div>
    </div>
  );
};

export default DashBoard;
