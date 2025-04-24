"use client";
import Icon from "@/components/common/Icon";
import HiraKataChart from "@/components/home/HiraKataChart";
import LoginModal from "@/components/home/LoginModal";
import {SAMPLE_PHRASES, USER_PHRASES_EXAMPLE} from "@/constants/examples";
import {useState} from "react";

export default function JapaneseWebApp() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const handleAddPhrase = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      // 로그인 상태면 문장 추가 페이지로 이동
      setActiveTab("add");
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    // e.preventDefault();
    // 실제로는 인증 로직이 여기 들어갈 것입니다
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("home");
  };

  const renderHome = () => (
    <div className="container mx-auto px-4 py-8">
      {!isLoggedIn && (
        <div className="mb-8 rounded-lg bg-indigo-100 p-4">
          <p className="text-center">
            로그인하시면 문장 추가, 퀴즈 풀기 등 더 많은 기능을 이용하실 수 있습니다.
          </p>
          <div className="mt-2 flex justify-center">
            <button
              onClick={handleLoginClick}
              className="focus:shadow-outline inline-flex items-center gap-1 rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none">
              <Icon name="login" size={24} color="white" />
              로그인
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
          <Icon name="book" size={24} color="black" />
          {isLoggedIn ? "내 일본어 회화 문장" : "예시 회화 문장"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(isLoggedIn ? USER_PHRASES_EXAMPLE : SAMPLE_PHRASES).slice(0, 4).map((phrase) => (
            <div
              key={phrase.id}
              className="rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
              <p className="mb-1 text-xl font-medium">{phrase.japanese}</p>
              <p className="mb-1 text-gray-600">{phrase.romaji}</p>
              <p className="mb-1 text-gray-600">{phrase.korean}</p>
              <p className="text-gray-700">{phrase.meaning}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setActiveTab("phrases")}
            className="flex items-center text-indigo-600 hover:text-indigo-800">
            <Icon name="listcheck" size={20} color="#4f46e5" />
            전체 보기
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div
          onClick={() => (isLoggedIn ? setActiveTab("quiz-ja-ko") : handleLoginClick())}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md ${!isLoggedIn && "opacity-75"}`}>
          <Icon name="barchartver" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">일본어 → 한국어 퀴즈</h3>
          {!isLoggedIn && <span className="mt-1 text-xs text-indigo-600">로그인 필요</span>}
        </div>
        <div
          onClick={() => (isLoggedIn ? setActiveTab("quiz-ko-ja") : handleLoginClick())}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md ${!isLoggedIn && "opacity-75"}`}>
          <Icon name="barcharthor" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">한국어 → 일본어 퀴즈</h3>
          {!isLoggedIn && <span className="mt-1 text-xs text-indigo-600">로그인 필요</span>}
        </div>
        <div
          onClick={() => setActiveTab("alphabet")}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md">
          <Icon name="table" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">히라가나/카타카나 표</h3>
        </div>
        <div
          onClick={handleAddPhrase}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg bg-indigo-100 p-4 shadow transition-shadow hover:shadow-md ${!isLoggedIn && "opacity-75"}`}>
          <Icon name="edit" size={32} color="#4f46e5" />
          <h3 className="text-center font-medium">새 문장 추가하기</h3>
          {!isLoggedIn && <span className="mt-1 text-xs text-indigo-600">로그인 필요</span>}
        </div>
      </div>
    </div>
  );

  const renderPhraseList = () => {
    const phrases = isLoggedIn ? USER_PHRASES_EXAMPLE : SAMPLE_PHRASES;
    const sortedPhrases = [...phrases].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
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
          <div className="mb-6">
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
          <div className="mt-8 rounded-lg bg-indigo-100 p-4">
            <p className="text-center">
              <span className="font-medium">로그인</span>하시면 나만의 문장을 추가하고 관리할 수
              있습니다.
            </p>
            <div className="mt-2 flex justify-center">
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

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "phrases":
        return renderPhraseList();
      case "alphabet":
        return <HiraKataChart />;
      default:
        return (
          <div className="container mx-auto px-4 py-8 text-center">
            {!isLoggedIn ? (
              <div>
                <p className="mb-4">이 기능을 사용하려면 로그인이 필요합니다.</p>
                <button
                  onClick={handleLoginClick}
                  className="focus:shadow-outline inline-flex items-center gap-1 rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none">
                  <Icon name="login" size={16} color="white" />
                  로그인
                </button>
              </div>
            ) : (
              <p>해당 페이지는 준비 중입니다.</p>
            )}
          </div>
        );
    }
  };

  return (
    <>
      {/* 메인 콘텐츠 영역 */}
      <main className="min-h-screen pb-8">{renderContent()}</main>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal handleLogin={handleLogin} setShowLoginModal={setShowLoginModal} />
      )}
    </>
  );
}
