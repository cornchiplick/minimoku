/**
 * 캐시 태그 이름.
 *
 * 조회 함수는 `use cache` 안에서 cacheTag 로 이 이름을 붙이고,
 * 변경 함수는 같은 이름으로 updateTag 를 호출해 즉시 반영한다.
 * 사용자별로 분리해, 한 사람의 변경이 다른 사람의 캐시를 지우지 않게 한다.
 */
export const cacheTags = {
  links: (userId: number) => `links:${userId}`,
  folders: (userId: number) => `folders:${userId}`,
  categories: (userId: number) => `categories:${userId}`,
  cashRecords: (userId: number) => `cash-records:${userId}`,
  settings: (userId: number) => `settings:${userId}`,
} as const;
