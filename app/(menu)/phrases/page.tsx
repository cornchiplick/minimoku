import {getPhrases} from "@/app/(menu)/phrases/action";
import PhrasesTemplate from "@/components/phrase/templates/PhrasesTemplate";
import {Prisma} from "@prisma/client";

export type InitialPhrases = Prisma.PromiseReturnType<typeof getPhrases>;

interface PhrasesPageProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

const PhrasesPage = async ({searchParams}: PhrasesPageProps) => {
  // 문장 목록 from db
  // const sortedPhrases = isLoggedIn ? USER_PHRASES_EXAMPLE : SAMPLE_PHRASES;

  const searchType =
    typeof searchParams?.searchType === "string" ? searchParams.searchType : undefined;
  const keyword = typeof searchParams?.keyword === "string" ? searchParams.keyword : undefined;
  const order = typeof searchParams?.createdAt === "string" ? searchParams.createdAt : "desc";

  const initialPhrases = await getPhrases({searchType, keyword, order});

  return <PhrasesTemplate sort={order} initialPhrases={initialPhrases} />;
};

export default PhrasesPage;
