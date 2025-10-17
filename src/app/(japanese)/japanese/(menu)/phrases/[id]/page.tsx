import PhraseViewPageTemplate from "@/features/phrases/components/templates/PhraseViewPageTemplate";
import {getPhrase} from "@/features/phrases/services/phrases.service";
import {notFound} from "next/navigation";

interface PhraseViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const PhraseViewPage = async ({params}: PhraseViewPageProps) => {
  const {id} = await params;

  if (!id || isNaN(Number(id))) {
    // 잘못된 ID 처리: 에러 페이지로 리다이렉트하거나 홈으로 이동
    return notFound();
  }

  const phrase = await getPhrase({id});
  if (!phrase) {
    return notFound();
  }

  return <PhraseViewPageTemplate phrase={phrase} />;
};

export default PhraseViewPage;
