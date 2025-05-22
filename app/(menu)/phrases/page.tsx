import {getPhrases} from "@/app/(menu)/phrases/action";
import PhrasesTemplate from "@/components/phrase/PhrasesTemplate";
import {Prisma} from "@prisma/client";

export type InitialPhrases = Prisma.PromiseReturnType<typeof getPhrases>;

const PhrasesPage = async () => {
  // 문장 목록 from db
  // const sortedPhrases = isLoggedIn ? USER_PHRASES_EXAMPLE : SAMPLE_PHRASES;
  const initialPhrases = await getPhrases();

  return <PhrasesTemplate initialPhrases={initialPhrases} />;
};

export default PhrasesPage;
