/** 사이드바가 준비되는 동안 자리를 잡아 두는 뼈대 (레이아웃이 밀리지 않도록 같은 폭·높이) */
const SidebarSkeleton = () => (
  <div className="flex h-full flex-col gap-4 p-4" aria-hidden>
    <div className="bg-background-secondary h-8 w-32 animate-pulse rounded-md" />
    <div className="bg-background-secondary h-9 w-full animate-pulse rounded-lg" />
    <div className="bg-background-secondary h-9 w-full animate-pulse rounded-lg" />
    <div className="bg-background-secondary mt-2 h-12 w-full animate-pulse rounded-md" />
    <div className="mt-2 flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-background-secondary h-7 w-full animate-pulse rounded-md" />
      ))}
    </div>
  </div>
);

export default SidebarSkeleton;
