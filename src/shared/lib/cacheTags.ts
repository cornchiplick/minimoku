/**
 * 캐시 태그 이름.
 *
 * 조회 함수는 `use cache` 안에서 cacheTag 로 이 이름을 붙이고,
 * 변경 함수는 같은 이름으로 updateTag 를 호출해 즉시 반영한다.
 * 사용자별로 분리해, 한 사람의 변경이 다른 사람의 캐시를 지우지 않게 한다.
 *
 * 수명은 cacheLife("hours") 로 묶는다. 앱을 거치지 않는 변경도 있기 때문이다 —
 * 게스트 초기화 Lambda 는 DB 를 직접 다시 채우므로 태그를 갱신할 방법이 없다.
 * 수명을 무제한으로 두면 그런 변경이 캐시에 영영 반영되지 않는다.
 */
export const cacheTags = {
  links: (userId: number) => `links:${userId}`,
  folders: (userId: number) => `folders:${userId}`,
  categories: (userId: number) => `categories:${userId}`,
  cashRecords: (userId: number) => `cash-records:${userId}`,
  settings: (userId: number) => `settings:${userId}`,
} as const;
