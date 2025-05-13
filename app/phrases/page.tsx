"use client";

import Icon from "@/components/common/Icon";
import {SAMPLE_PHRASES, USER_PHRASES_EXAMPLE} from "@/constants/examples";
import {useState} from "react";

const PhrasesPage = () => {
  // FIX : 로그인 상태를 관리하는 상태 변수 : next/auth 로 구현할것
  const isLoggedIn = true;
  const handleLoginClick = () => {};
  // const handleLoginClick = () => {
  //   setShowLoginModal(true);
  // };

  const [sortOrder, setSortOrder] = useState<string>("newest");

  const phrases = isLoggedIn ? USER_PHRASES_EXAMPLE : SAMPLE_PHRASES;
  const sortedPhrases = [...phrases].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  return (
    <div className="container flex flex-col gap-6 px-4 py-8">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <h2 className="mb-2 text-2xl font-bold md:mb-0">
          {isLoggedIn ? "내 일본어 회화 문장" : "예시 회화 문장"}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            className={`flex flex-row items-center gap-1 rounded px-3 py-1 ${sortOrder === "newest" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => setSortOrder("newest")}>
            최신순
            <Icon name="chevronup" size={16} color="white" />
          </button>
          <button
            className={`flex flex-row items-center gap-1 rounded px-3 py-1 ${sortOrder === "oldest" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={() => setSortOrder("oldest")}>
            등록순
            <Icon name="chevrondown" size={16} color="black" />
          </button>
        </div>
      </div>

      {isLoggedIn && (
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="문장 검색..."
              className="w-full rounded-lg border p-2 pl-10"
            />
            <Icon name="search" size={18} color="gray" />
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {sortedPhrases.map((phrase) => (
          <div
            key={phrase.id}
            className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-xl font-medium">{phrase.japanese}</p>
                <p className="mb-1 text-gray-600">{phrase.romaji}</p>
                <p className="mb-1 text-gray-600">{phrase.korean}</p>
                <p className="text-gray-700">{phrase.meaning}</p>
              </div>
              <span className="text-xs text-gray-500">{phrase.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {!isLoggedIn && (
        <div className="flex flex-col gap-2 rounded-lg bg-indigo-100 p-4 pt-6">
          <p className="text-center">
            <span className="font-medium">로그인</span>하시면 나만의 문장을 추가하고 관리할 수
            있습니다.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleLoginClick}
              className="focus:shadow-outline inline-flex items-center gap-1 rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none">
              <Icon name="login" size={16} color="white" />
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhrasesPage;
