import FormButton from "@/shared/common/FormButton";
import FormInput from "@/shared/common/FormInput";
import {PhraseConstants} from "@/shared/constants/phrase";
import {CardInputs} from "@/shared/types/phrase";
import {SubmitHandler, useFormContext} from "react-hook-form";

interface CardFormProps {
  onSubmit: SubmitHandler<CardInputs>;
}

const CardForm = ({onSubmit}: CardFormProps) => {
  const {handleSubmit} = useFormContext<CardInputs>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-2xl flex-col gap-4 lg:flex-[0.7]">
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
      <div className="flex flex-1 items-center justify-end gap-4">
        <FormButton type="submit" name="submitType" value={PhraseConstants.CARD_SAVETYPE_SAVE}>
          카드 저장하기
        </FormButton>
        <FormButton type="submit" name="submitType" value={PhraseConstants.CARD_SAVETYPE_CONTINUE}>
          계속 추가하기
        </FormButton>
      </div>
    </form>
  );
};

export default CardForm;
