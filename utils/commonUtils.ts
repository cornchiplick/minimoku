export const getPathnameArray = (pathname: string): string[] => {
  const pathArray = pathname
    .split("/")
    .filter(Boolean)
    .map((path) => `/${path}`);
  return pathArray;
};
