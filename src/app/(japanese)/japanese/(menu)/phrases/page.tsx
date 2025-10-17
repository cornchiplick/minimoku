import PhrasesTemplate from "@/features/phrases/components/templates/PhrasesTemplate";
import {getPhrases} from "@/features/phrases/services/phrases.service";
import {Prisma} from "@prisma/client";

export const dynamic = "force-dynamic";

export type InitialPhrases = Prisma.PromiseReturnType<typeof getPhrases>;

interface PhrasesPageProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const PhrasesPage = async ({searchParams}: PhrasesPageProps) => {
  const resolvedSearchParams = await searchParams;
  // 문장 목록 from db
  // const sortedPhrases = isLoggedIn ? USER_PHRASES_EXAMPLE : SAMPLE_PHRASES;

  const searchType =
    typeof resolvedSearchParams?.searchType === "string"
      ? resolvedSearchParams.searchType
      : undefined;
  const keyword =
    typeof resolvedSearchParams?.keyword === "string" ? resolvedSearchParams.keyword : undefined;
  const order =
    typeof resolvedSearchParams?.createdAt === "string" ? resolvedSearchParams.createdAt : "desc";

  try {
    const initialPhrases = await getPhrases({searchType, keyword, order});

    const safeInitialPhrases = Array.isArray(initialPhrases) ? initialPhrases : [];
    return <PhrasesTemplate sort={order} initialPhrases={safeInitialPhrases} />;
  } catch (error) {
    // Handle database errors gracefully
    console.error("Failed to fetch phrases:", error);
    return <PhrasesTemplate sort={order} initialPhrases={[]} />;
  }
};

export default PhrasesPage;
