import {getPhrase} from "@/app/(menu)/phrases/[id]/action";
import {Prisma} from "@prisma/client";
import {notFound} from "next/navigation";

type Phrase = Prisma.PromiseReturnType<typeof getPhrase>;

interface PhraseViewPageProps {
  params: {
    id: string;
  };
}

const PhraseViewPage = async ({params}: PhraseViewPageProps) => {
  if (!params.id || isNaN(Number(params.id))) {
    // 잘못된 ID 처리: 에러 페이지로 리다이렉트하거나 홈으로 이동
    return notFound();
  }

  const phrase = await getPhrase({id: params.id});
  if (!phrase) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">문장 보기</h1>
      <p>문장 상세 정보가 여기에 표시됩니다.</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">{phrase.japanese}</h2>
        <p className="text-gray-600">{phrase.romaji}</p>
        <p className="text-gray-600">{phrase.pronunciation}</p>
        <p className="text-gray-700">{phrase.translation}</p>
        {phrase.description && <p className="mt-2 text-gray-500">{phrase.description}</p>}
        {/* 여기에 문장 상세 컴포넌트를 추가하세요 */}
      </div>
    </div>
  );
};

export default PhraseViewPage;
