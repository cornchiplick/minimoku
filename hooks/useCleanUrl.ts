import {usePathname, useSearchParams} from "next/navigation";
import {useCallback, useMemo} from "react";

export const useCleanUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCleanUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("searchType");
    params.delete("keyword");
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const memorizedValue = useMemo(
    () => ({
      getCleanUrl,
    }),
    [getCleanUrl]
  );

  return memorizedValue;
};
