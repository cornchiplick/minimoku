import ReadCell from "@/components/common/ReadCell";
import SentenceCard from "@/components/common/SentenceCard";
import Typography from "@/components/home/atomic/Typography";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Phrase} from "@/types/phrase";

interface PhraseViewPageTemplateProps {
  phrase: Phrase;
}

const PhraseViewPageTemplate = ({phrase}: PhraseViewPageTemplateProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          // TODO: 수정 모달을 여는 onClick 함수 개발할것
          // onClick={() => {}}
          className="bg-indigo-600 transition-colors hover:bg-indigo-600/80">
          수정
        </Button>
      </div>
      <div className="flex gap-6">
        {/* left */}
        <div className="flex flex-1 flex-col">
          <SentenceCard phrase={phrase} />
          <Separator className="my-4" />

          <div className="flex flex-col justify-center">
            <Typography.P2 className="">· 현재 카드에 대한 퀴즈 내역 아래에 보여주기</Typography.P2>
            <Typography.Head3>퀴즈 내역</Typography.Head3>
            <Typography.P1>n번 출제 중 오답 횟수 m번 : 정답률 p %</Typography.P1>
            <Typography.P1>그래프도 그려보기</Typography.P1>
          </div>
        </div>

        {/* right */}
        <div className="flex flex-1 flex-col">
          <ReadCell title="· 일어">
            <Typography.P1>{phrase.japanese}</Typography.P1>
          </ReadCell>
          <ReadCell title="· 영문발음">
            <Typography.P1>{phrase.romaji}</Typography.P1>
          </ReadCell>
          <ReadCell title="· 한글발음">
            <Typography.P1>{phrase.pronunciation}</Typography.P1>
          </ReadCell>
          <ReadCell title="· 의미">
            <Typography.P1>{phrase.translation}</Typography.P1>
          </ReadCell>
          {!!phrase.description && (
            <>
              <Separator className="my-1" />
              <ReadCell title="· 설명">
                <Typography.P1>{phrase.description}</Typography.P1>
              </ReadCell>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhraseViewPageTemplate;
