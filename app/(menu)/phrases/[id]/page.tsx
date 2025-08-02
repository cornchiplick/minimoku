import PhraseViewPageTemplate from "@/features/phrases/components/templates/PhraseViewPageTemplate";
import {getPhrase} from "@/features/phrases/services/phrases.service";
import {notFound} from "next/navigation";

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

  return <PhraseViewPageTemplate phrase={phrase} />;
};

export default PhraseViewPage;
