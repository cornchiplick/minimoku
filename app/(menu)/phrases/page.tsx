import PhrasesTemplate from "@/features/phrases/components/templates/PhrasesTemplate";
import {getPhrases} from "@/features/phrases/services/phrases.service";
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

  try {
    const initialPhrases = await getPhrases({searchType, keyword, order});
    return <PhrasesTemplate sort={order} initialPhrases={initialPhrases} />;
  } catch (error) {
    // Handle database errors gracefully
    console.error("Failed to fetch phrases:", error);
    return <PhrasesTemplate sort={order} initialPhrases={[]} />;
  }
};

export default PhrasesPage;
