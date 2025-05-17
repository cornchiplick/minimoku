"use client";

import FormButton from "@/components/common/FormButton";
import FormInput from "@/components/common/FormInput";
import Typography from "@/components/home/atomic/Typography";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import clsx from "clsx";
import {useEffect, useState} from "react";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

// 폼 입력 타입 정의
interface LanguageCardInputs {
  // 일본어 원문
  japanese: string;
  // 로마자 표기
  romaji: string;
  // 한글 발음
  pronunciation: string;
  // 한국어 의미
  translation: string;
}

const LanguageCardForm = () => {
  const [previewCard, setPreviewCard] = useState<LanguageCardInputs | null>(null);

  const formMethods = useForm<LanguageCardInputs>({
    defaultValues: {
      japanese: "",
      romaji: "",
      pronunciation: "",
      translation: "",
    },
  });
  const {handleSubmit, reset, watch} = formMethods;

  const onSubmit: SubmitHandler<LanguageCardInputs> = (data) => {
    console.log("data :: ", data);
    reset();
  };

  // 미리보기 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      setPreviewCard(value as LanguageCardInputs);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex w-full gap-6">
      {/* 카드 미리보기 */}
      <div className="flex flex-[0.5] flex-col gap-4">
        <Typography.SubTitle1 className="text-gray-700">카드 미리보기</Typography.SubTitle1>
        <div className="rounded-lg border-2 border-indigo-200 bg-white p-5 shadow-md">
          <div className="flex flex-col gap-1 p-0">
            <Typography.SubTitle1 className={clsx(!previewCard?.japanese && "text-gray-600")}>
              {previewCard?.japanese ? previewCard.japanese : "일본어"}
            </Typography.SubTitle1>
            <Typography.P1
              className={clsx(
                previewCard?.romaji && "text-gray-400",
                !previewCard?.romaji && "text-gray-600"
              )}>
              {previewCard?.romaji ? previewCard?.romaji : "로마자 표기"}
            </Typography.P1>
            <Typography.P1
              className={clsx(
                previewCard?.pronunciation && "text-gray-400",
                !previewCard?.pronunciation && "text-gray-600"
              )}>
              {previewCard?.pronunciation ? previewCard?.pronunciation : "한글 발음"}
            </Typography.P1>

            <Typography.P1
              className={clsx(
                !previewCard?.translation && "text-gray-400",
                previewCard?.translation && "text-gray-700"
              )}>
              {previewCard?.translation ? previewCard?.translation : "한국어 의미"}
            </Typography.P1>
          </div>
        </div>
      </div>

      {/* 카드 생성 폼 */}
      <Tabs defaultValue="classic" className="flex flex-[0.7] flex-col">
        <TabsList className="flex justify-start">
          <TabsTrigger value="classic">Classic</TabsTrigger>
          <TabsTrigger value="whole">Whole</TabsTrigger>
        </TabsList>
        <TabsContent value="classic">
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-[0.7] flex-col gap-4">
              <div className="flex flex-1 flex-col gap-4">
                <FormInput
                  name="japanese"
                  label="일본어 (원문)"
                  placeholder="ありがとうございます"
                  registerOptions={{required: "일본어 원문을 입력해주세요"}}
                />
                <FormInput
                  name="romaji"
                  label="로마자 표기"
                  placeholder="arigatou gozaimasu"
                  registerOptions={{required: "로마자 표기를 입력해주세요"}}
                />
                <FormInput
                  name="pronunciation"
                  label="한글 발음"
                  placeholder="아리가토 고자이마스"
                  registerOptions={{required: "한글 발음을 입력해주세요"}}
                />
                <FormInput
                  name="translation"
                  label="한국어 의미"
                  placeholder="감사합니다"
                  registerOptions={{required: "한국어 의미를 입력해주세요"}}
                />
              </div>
              <FormButton type="submit">카드 저장하기</FormButton>
            </form>
          </FormProvider>
        </TabsContent>
        <TabsContent value="whole">
          <Typography.SubTitle1>탭 테스트</Typography.SubTitle1>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LanguageCardForm;
