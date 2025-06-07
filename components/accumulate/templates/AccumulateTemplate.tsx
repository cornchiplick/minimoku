"use client";

import {addCardAction} from "@/app/(menu)/accumulate/action";
import CardForm from "@/components/accumulate/organisms/CardForm";
import Typography from "@/components/home/atomic/Typography";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {PhraseConstants} from "@/constants/phrase";
import {CardInputs} from "@/types/phrase";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";

const AccumulateTemplate = () => {
  const router = useRouter();
  const [previewCard, setPreviewCard] = useState<CardInputs | null>(null);

  const formMethods = useForm<CardInputs>({
    defaultValues: {
      japanese: "",
      romaji: "",
      pronunciation: "",
      translation: "",
    },
  });
  const {reset, watch} = formMethods;

  const onSubmit: SubmitHandler<CardInputs> = async (data, e) => {
    // submitType 읽기
    const submitter = (e?.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement | undefined;
    const submitType = submitter?.value;

    const formData = new FormData();
    formData.append("japanese", data.japanese);
    formData.append("romaji", data.romaji);
    formData.append("pronunciation", data.pronunciation);
    formData.append("translation", data.translation);

    const errors = await addCardAction(formData);
    if (errors) {
      // setError("")
    }
    reset();
    if (submitType === PhraseConstants.CARD_SAVETYPE_SAVE) {
      router.push("/phrases");
    }
  };

  // 미리보기 업데이트
  useEffect(() => {
    const subscription = watch((value) => {
      setPreviewCard(value as CardInputs);
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
            <CardForm onSubmit={onSubmit} />
          </FormProvider>
        </TabsContent>
        <TabsContent value="whole">
          <Typography.SubTitle1>탭 테스트</Typography.SubTitle1>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccumulateTemplate;
