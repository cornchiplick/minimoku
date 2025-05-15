"use client";

import Typography from "@/components/home/atomic/Typography";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

// 폼 입력 타입 정의
interface LanguageCardInputs {
  japanese: string; // 일본어 원문
  romaji: string; // 로마자 표기
  pronunciation: string; // 한글 발음
  translation: string; // 한국어 의미
}

// 저장된 카드 타입 정의
interface LanguageCard extends LanguageCardInputs {
  id: string;
}

const LanguageCardForm = () => {
  // 카드 목록 상태
  const [cards, setCards] = useState<LanguageCard[]>([]);

  // 미리보기 상태
  const [previewCard, setPreviewCard] = useState<LanguageCardInputs | null>(null);

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<LanguageCardInputs>({
    defaultValues: {
      japanese: "",
      romaji: "",
      pronunciation: "",
      translation: "",
    },
  });

  // 현재 폼 값 실시간 감시
  const currentFormValues = watch();

  // 미리보기 업데이트
  useEffect(() => {
    setPreviewCard(currentFormValues);
    // }, [currentFormValues]);
  }, []);

  // 폼 제출 처리
  const onSubmit: SubmitHandler<LanguageCardInputs> = (data) => {
    // 실제 구현에서는 API 요청 등이 여기에 들어갈 수 있습니다
    const newCard: LanguageCard = {
      ...data,
      id: Date.now().toString(),
    };

    setCards((prevCards) => [...prevCards, newCard]);
    reset(); // 폼 초기화
  };

  return (
    <div className="flex w-full gap-6">
      {/* 카드 미리보기 */}
      <div className="flex flex-1 flex-col">
        <Typography.SubTitle1 className="mb-2 text-lg font-medium text-gray-700">
          카드 미리보기
        </Typography.SubTitle1>
        <div className="rounded-lg border-2 border-indigo-200 bg-white p-5 shadow-md">
          <div className="space-y-3 text-center">
            {previewCard?.japanese ? (
              <p className="text-xl font-medium">{previewCard.japanese}</p>
            ) : (
              <p className="text-xl text-gray-400">일본어</p>
            )}

            {previewCard?.romaji ? (
              <p className="text-lg text-gray-600">{previewCard.romaji}</p>
            ) : (
              <p className="text-lg text-gray-400">로마자 표기</p>
            )}

            {previewCard?.pronunciation ? (
              <p className="text-lg text-gray-600">{previewCard.pronunciation}</p>
            ) : (
              <p className="text-lg text-gray-400">한글 발음</p>
            )}

            {previewCard?.translation ? (
              <p className="text-lg font-medium text-indigo-600">{previewCard.translation}</p>
            ) : (
              <p className="text-lg text-gray-400">한국어 의미</p>
            )}
          </div>
        </div>
      </div>

      {/* 카드 생성 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">일본어 (원문)</label>
          <input
            type="text"
            {...register("japanese", {required: "일본어 원문을 입력해주세요"})}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="ありがとうございます"
          />
          {errors.japanese && (
            <p className="mt-1 text-sm text-red-600">{errors.japanese.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">로마자 표기</label>
          <input
            type="text"
            {...register("romaji", {required: "로마자 표기를 입력해주세요"})}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="arigatou gozaimasu"
          />
          {errors.romaji && <p className="mt-1 text-sm text-red-600">{errors.romaji.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">한글 발음</label>
          <input
            type="text"
            {...register("pronunciation", {required: "한글 발음을 입력해주세요"})}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="아리가토 고자이마스"
          />
          {errors.pronunciation && (
            <p className="mt-1 text-sm text-red-600">{errors.pronunciation.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">한국어 의미</label>
          <input
            type="text"
            {...register("translation", {required: "한국어 의미를 입력해주세요"})}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="감사합니다"
          />
          {errors.translation && (
            <p className="mt-1 text-sm text-red-600">{errors.translation.message}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition duration-300 ease-in-out hover:bg-indigo-700"
            // whileHover={{ scale: 1.02 }}
            // whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? "저장 중..." : "카드 저장하기"}
          </button>
        </div>
      </form>

      {/* 저장된 카드 목록 (옵션) */}
      {cards.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-3 text-lg font-medium text-gray-700">저장된 카드 목록</h3>
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="space-y-2 text-center">
                  <p className="text-lg font-medium">{card.japanese}</p>
                  <p className="text-gray-600">{card.romaji}</p>
                  <p className="text-gray-600">{card.pronunciation}</p>
                  <p className="font-medium text-indigo-600">{card.translation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageCardForm;
