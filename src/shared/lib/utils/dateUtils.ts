/**
 * 날짜를 "YYYY.MM.DD" 형식으로 포맷
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * 현재 날짜 기준으로 N일 전부터 오늘까지의 날짜 구간 반환
 */
export const getDateRange = (days: number): { from: Date; to: Date } => {
  const to = new Date();
  to.setHours(23, 59, 59, 999);

  const from = new Date();
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);

  return { from, to };
};

/**
 * 날짜의 시간을 00:00:00으로 정규화
 */
export const normalizeDate = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * 날짜를 ISO 문자열(날짜 부분만)로 변환
 */
export const toDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
