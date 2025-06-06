"use client";

import {deletePhrase} from "@/app/(menu)/phrases/action";
import {InitialPhrases} from "@/app/(menu)/phrases/page";
import FormButton from "@/components/common/FormButton";
import FormResetButton from "@/components/common/FormResetButton";
import FormSelect from "@/components/common/FormSelect";
import Icon from "@/components/common/Icon";
import SentenceCard from "@/components/common/SentenceCard";
import SortButton from "@/components/common/SortButton";
import SearchForm from "@/components/phrase/organisms/SearchForm";
import {SelectContent, SelectItem} from "@/components/ui/select";
import {URL} from "@/constants/url";
import {SearchInputs} from "@/types/phrase";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {KeyboardEventHandler, useCallback} from "react";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

interface PhrasesTemplateProps {
  sort?: string | undefined;
  initialPhrases: InitialPhrases;
}

const PhrasesTemplate = ({sort = "desc", initialPhrases}: PhrasesTemplateProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // FIX : 로그인 상태를 관리하는 상태 변수 : next/auth 로 구현할것
  const isLoggedIn = true;
  const handleLoginClick = () => {};

  // ----------------------------------------
  // 검색 폼
  // const sortOrder = "newest"; // "newest" | "oldest"

  const formMethods = useForm<SearchInputs>({
    defaultValues: {
      searchType: "japanese", // 기본 검색 타입
      keyword: "",
    },
  });
  const {handleSubmit} = formMethods;
  const onSubmit: SubmitHandler<SearchInputs> = async (data) => {
    const params = new URLSearchParams({
      searchType: data.searchType,
      keyword: data.keyword,
    });
    router.push(`${URL.PHRASES}?${params.toString()}`);
  };

  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onChangeSort = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrder = searchParams.get("createdAt") || "desc";
    const toSort = currentOrder === "asc" ? "desc" : "asc";
    params.set("createdAt", toSort);
    router.push(`${URL.PHRASES}?${params.toString()}`);
  }, [router, searchParams]);

  const onClickCard = useCallback(
    (id: number) => {
      router.push(`${URL.PHRASES}/${id}`);
    },
    [router]
  );

  const onDelete = useCallback(
    async (id: number) => {
      await deletePhrase(id);
      router.refresh();
    },
    [router]
  );

  return (
    <div className="container flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <Link href={URL.ACCUMULATE} className="rounded bg-indigo-600 px-3 py-1 text-white">
          새 문장
        </Link>
        <div className="flex items-center gap-2">
          <SortButton name="등록일" sort={sort} onChangeSort={onChangeSort} />
        </div>
      </div>

      {isLoggedIn && (
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-2 self-stretch *:items-center">
              <FormSelect name="searchType" defaultValue="japanese" className="w-[180px]">
                <SelectContent>
                  <SelectItem value="japanese">일어</SelectItem>
                  <SelectItem value="romaji">영어발음</SelectItem>
                  <SelectItem value="pronunciation">한글발음</SelectItem>
                  <SelectItem value="translation">의미</SelectItem>
                </SelectContent>
              </FormSelect>
              <SearchForm onKeyUp={onKeyUp} />
              <FormButton className="w-20">검색</FormButton>
              <FormResetButton className="w-20">초기화</FormResetButton>
            </div>
          </form>
        </FormProvider>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {initialPhrases.map((phrase) => (
          <div
            key={phrase.id}
            className="group relative cursor-pointer"
            onClick={() => onClickCard(phrase.id)}>
            <SentenceCard phrase={phrase} showDateTime />
            <div
              className="pointer-events-none absolute left-[-6px] top-[-6px] opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(phrase.id);
              }}>
              <Icon name="close" />
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

export default PhrasesTemplate;
