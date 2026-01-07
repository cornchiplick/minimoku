import {getLinks} from "@/features/link/model/services/links.service";
import LinkLockerMain from "@/widgets/link/LinkLockerMain";

// searchParams를 prop으로 받습니다 (Next.js 15에서 Promise 타입)
const LinkHome = async ({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) => {
  try {
    const queryString = await searchParams;
    // TODO 값 정제화 코드를 utils 등으로 분리 고려
    const filteredParams: Record<string, string | number | boolean> = Object.entries(
      queryString
    ).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = Array.isArray(value) ? value[0] : value;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean>
    );
    const initialLinks = await getLinks({params: filteredParams});
    return <LinkLockerMain initialLinks={initialLinks} />;
  } catch (error) {
    console.error("Error in LinkHome : ", error);
    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default LinkHome;
