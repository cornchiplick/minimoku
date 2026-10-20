/** PigMoney 본문이 준비되는 동안의 뼈대 — 합계 자리와 목록 자리를 미리 잡아 둔다 */
const PigMoneyContentSkeleton = () => (
  <div className="bg-background-primary flex min-h-0 flex-1 flex-col" aria-hidden>
    <div className="border-border border-b">
      <div className="mx-auto w-full max-w-3xl px-4 py-5 md:px-6">
        <div className="bg-background-secondary h-3 w-16 animate-pulse rounded" />
        <div className="bg-background-secondary mt-3 h-11 w-56 animate-pulse rounded-md" />
        <div className="bg-background-secondary mt-5 h-9 w-full animate-pulse rounded-md" />
      </div>
    </div>
    <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="border-border flex items-center justify-between border-t py-5">
          <div className="bg-background-secondary h-4 w-40 animate-pulse rounded" />
          <div className="bg-background-secondary h-4 w-24 animate-pulse rounded" />
        </div>
      ))}
    </div>
  </div>
);

export default PigMoneyContentSkeleton;
