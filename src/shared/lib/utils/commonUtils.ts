import { APIConstants } from "@/shared/constants/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 주어진 pathname 문자열을 '/'로 분리하여 각 경로 조각 앞에 '/'를 붙인 문자열 배열로 반환합니다.
 *
 * @param pathname usePathname()의 반환값
 * @returns 각 경로 조각 앞에 '/'가 붙은 문자열 배열을 반환
 * 예시: "/phrase/word" → ["/phrase", "/word"]
 * 예시: "/" → ["/"]
 */
export const getPathnameArray = (pathname: string): string[] => {
  if (!pathname || pathname === "/") {
    return ["/"];
  }

  const pathArray = pathname
    .split("/")
    .filter(Boolean)
    .map((path) => `/${path}`);
  return pathArray;
};

export const getQueryString = (params: Record<string, string | number | boolean> = {}) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const getTags = (userId: number, api: string) => {
  return `${userId}${APIConstants.DELIMITER}${api}`;
}
