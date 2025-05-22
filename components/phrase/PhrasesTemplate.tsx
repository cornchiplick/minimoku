"use client";

import {InitialPhrases} from "@/app/(menu)/phrases/page";
import Icon from "@/components/common/Icon";
import SentenceCard from "@/components/common/SentenceCard";
import SearchForm from "@/components/phrase/organisms/SearchForm";
import {URL} from "@/constants/url";
import {SearchInputs} from "@/types/phrase";
import clsx from "clsx";
import Link from "next/link";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

interface PhrasesTemplateProps {
  sortOrder?: "newest" | "oldest";
  initialPhrases: InitialPhrases;
}

const PhrasesTemplate = ({sortOrder = "newest", initialPhrases}: PhrasesTemplateProps) => {
  // FIX : 로그인 상태를 관리하는 상태 변수 : next/auth 로 구현할것
  const isLoggedIn = true;
  const handleLoginClick = () => {};

  // ----------------------------------------
  // 검색 폼
  // const sortOrder = "newest"; // "newest" | "oldest"

  const formMethods = useForm<SearchInputs>({
    defaultValues: {
      keyword: "",
    },
  });
  const onSubmit: SubmitHandler<SearchInputs> = async (data) => {
    console.log("Search data: ", data);
  };

  return (
    <div className="container flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <Link href={URL.ACCUMULATE} className="rounded bg-indigo-600 px-3 py-1 text-white">
          새 문장
        </Link>
        <div className="flex items-center gap-2">
          <button
            className={clsx(
              "flex flex-row items-center gap-1 rounded px-3 py-1",
              sortOrder === "newest" && "bg-indigo-600 text-white",
              sortOrder !== "newest" && "bg-gray-200 hover:bg-gray-300"
            )}
            // onClick={() => setSortOrder("newest")}
          >
            최신순
            <Icon name="chevronup" size={16} color="white" />
          </button>
          <button
            className={clsx(
              "flex flex-row items-center gap-1 rounded px-3 py-1",
              sortOrder === "oldest" && "bg-indigo-600 text-white",
              sortOrder !== "oldest" && "bg-gray-200 hover:bg-gray-300"
            )}
            // onClick={() => setSortOrder("oldest")}
          >
            등록순
            <Icon name="chevrondown" size={16} color="black" />
          </button>
        </div>
      </div>

      {isLoggedIn && (
        <FormProvider {...formMethods}>
          <SearchForm onSubmit={onSubmit} />
        </FormProvider>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {initialPhrases.map((phrase) => (
          <SentenceCard key={phrase.id} phrase={phrase} showDateTime />
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

export default PhrasesTemplate;
