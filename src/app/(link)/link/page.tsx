import {getLinks} from "@/features/link/model/services/links.service";
import LinkLockerMain from "@/widgets/link/LinkLockerMain";

const LinkHome = async () => {
  try {
    const initialLinks = await getLinks();
    return <LinkLockerMain initialLinks={initialLinks} />;
  } catch (error) {
    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default LinkHome;
