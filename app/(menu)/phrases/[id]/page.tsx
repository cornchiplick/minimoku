import {getPhrase} from "@/app/(menu)/phrases/[id]/action";
import PhraseViewPageTemplate from "@/components/phrase/templates/PhraseViewPageTemplate";
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
