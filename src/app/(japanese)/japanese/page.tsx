import {USER_PHRASES_EXAMPLE} from "@/shared/constants/examples";
import DashBoard from "@/shared/home/templates/DashBoard";
import {authOptions} from "@/shared/lib/auth";
import {getServerSession} from "next-auth";

const JapaneseHome = async () => {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("Failed to get session:", error);
    session = null;
  }

  // TODO 로그인 되어 있다면 사용자 문장목록 보여주기 (조회해야함) -> USER_PHRASES_EXAMPLE 을 대체함

  return <DashBoard isAuthenticated={!!session} userPhrases={USER_PHRASES_EXAMPLE} />;
};

export default JapaneseHome;
