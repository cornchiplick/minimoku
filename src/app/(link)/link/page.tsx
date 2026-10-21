import {getLinks} from "@/features/link/model/services/links.service";
import LinkListSkeleton from "@/widgets/link/LinkListSkeleton";
import LinkLockerMain from "@/widgets/link/LinkLockerMain";
import {Suspense} from "react";

// searchParams 는 Next 15 부터 Promise 타입이다
const LinkHomeContent = async ({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) => {
  const queryString = await searchParams;

  // 배열로 들어온 쿼리는 첫 값만 사용한다
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

  // 조회 실패는 error.tsx 바운더리가 처리한다 (try/catch 로 JSX 를 감싸지 않는다)
  const initialLinks = await getLinks({params: filteredParams});

  return <LinkLockerMain initialLinks={initialLinks} />;
};

const LinkHome = ({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) => (
  <Suspense
    fallback={
      <div className="px-4 py-6 md:px-6">
        <LinkListSkeleton />
      </div>
    }>
    <LinkHomeContent searchParams={searchParams} />
  </Suspense>
);

export default LinkHome;
