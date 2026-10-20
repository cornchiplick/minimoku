/** 링크 목록이 준비되는 동안의 뼈대 — 실제 행과 같은 높이로 둬 화면이 튀지 않게 한다 */
const LinkListSkeleton = () => (
  <div className="mx-auto w-full max-w-3xl" aria-hidden>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} className="border-border flex items-start gap-3 border-b py-4">
        <div className="min-w-0 flex-1">
          <div className="bg-background-secondary h-5 w-2/3 animate-pulse rounded" />
          <div className="bg-background-secondary mt-2.5 h-3.5 w-1/3 animate-pulse rounded" />
        </div>
        <div className="bg-background-secondary h-5 w-28 animate-pulse rounded" />
      </div>
    ))}
  </div>
);

export default LinkListSkeleton;
