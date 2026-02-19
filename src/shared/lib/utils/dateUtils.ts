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

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * 날짜를 "YYYY.MM.DD (요일)" 형식으로 포맷
 */
export const formatDateWithDay = (date: Date | string): string => {
  const d = new Date(date);
  return `${formatDate(d)} (${DAY_NAMES[d.getDay()]})`;
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
 * 날짜를 "YYYY-MM-DD" 문자열로 변환 (로컬 시간대 기준)
 */
export const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * 사용자 설정 기반 "이번 달" 범위 계산
 * monthStartDay=25 → 1/25~2/24, 2/25~3/24 ...
 */
export const getCustomMonthRange = (
  monthStartDay: number,
): { from: Date; to: Date; label: string } => {
  return getCustomMonthRangeFor(new Date(), monthStartDay);
};

/**
 * 특정 날짜가 속하는 "월" 범위 (사용자 설정 monthStartDay 반영)
 */
export const getCustomMonthRangeFor = (
  date: Date,
  monthStartDay: number,
): { from: Date; to: Date; label: string } => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-based

  let from: Date;
  let to: Date;

  if (d.getDate() >= monthStartDay) {
    // 현재 날짜 >= 시작일 → from: 이번달 시작일, to: 다음달 시작일 - 1
    from = new Date(year, month, monthStartDay, 0, 0, 0, 0);
    to = new Date(year, month + 1, monthStartDay - 1, 23, 59, 59, 999);
  } else {
    // 현재 날짜 < 시작일 → from: 저번달 시작일, to: 이번달 시작일 - 1
    from = new Date(year, month - 1, monthStartDay, 0, 0, 0, 0);
    to = new Date(year, month, monthStartDay - 1, 23, 59, 59, 999);
  }

  const label = `${from.getMonth() + 1}월`;

  return { from, to, label };
};

/**
 * 현재 조회 범위의 이전 커스텀 월 범위 계산
 */
export const getPrevCustomMonthRange = (
  currentFrom: Date,
  monthStartDay: number,
): { from: Date; to: Date; label: string } => {
  const prevDate = new Date(currentFrom);
  prevDate.setDate(prevDate.getDate() - 1); // 시작일 하루 전 = 이전 월에 속함
  return getCustomMonthRangeFor(prevDate, monthStartDay);
};

/**
 * 현재 조회 범위의 다음 커스텀 월 범위 계산
 */
export const getNextCustomMonthRange = (
  currentTo: Date,
  monthStartDay: number,
): { from: Date; to: Date; label: string } => {
  const nextDate = new Date(currentTo);
  nextDate.setDate(nextDate.getDate() + 1); // 종료일 다음날 = 다음 월에 속함
  return getCustomMonthRangeFor(nextDate, monthStartDay);
};

/**
 * 사용자 설정 기반 "이번 주" 범위 계산
 * weekStartDay=5(금) → 금~목
 */
export const getCustomWeekRange = (weekStartDay: number): { from: Date; to: Date } => {
  return getCustomWeekRangeFor(new Date(), weekStartDay);
};

/**
 * 특정 날짜가 속하는 "주" 범위 (사용자 설정 weekStartDay 반영)
 */
export const getCustomWeekRangeFor = (
  date: Date,
  weekStartDay: number,
): { from: Date; to: Date } => {
  const d = new Date(date);
  const currentDay = d.getDay(); // 0=일, 1=월, ..., 6=토

  // 현재 요일에서 주 시작 요일까지의 차이
  const diff = (currentDay - weekStartDay + 7) % 7;

  const from = new Date(d);
  from.setDate(from.getDate() - diff);
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  to.setHours(23, 59, 59, 999);

  return { from, to };
};

/**
 * 현재 조회 범위의 이전 커스텀 주 범위 계산
 */
export const getPrevCustomWeekRange = (
  currentFrom: Date,
  weekStartDay: number,
): { from: Date; to: Date } => {
  const prevDate = new Date(currentFrom);
  prevDate.setDate(prevDate.getDate() - 1); // 시작일 하루 전 = 이전 주에 속함
  return getCustomWeekRangeFor(prevDate, weekStartDay);
};

/**
 * 현재 조회 범위의 다음 커스텀 주 범위 계산
 */
export const getNextCustomWeekRange = (
  currentTo: Date,
  weekStartDay: number,
): { from: Date; to: Date } => {
  const nextDate = new Date(currentTo);
  nextDate.setDate(nextDate.getDate() + 1); // 종료일 다음날 = 다음 주에 속함
  return getCustomWeekRangeFor(nextDate, weekStartDay);
};

/**
 * KST(UTC+9) 기준 특정 날짜의 시작 시각(00:00:00)을 UTC Date로 반환
 * 서버(UTC 환경)에서 Prisma 쿼리의 gte 조건에 사용
 */
export const toKSTStartOfDay = (dateStr: string): Date => {
  return new Date(`${dateStr}T00:00:00+09:00`);
};

/**
 * KST(UTC+9) 기준 특정 날짜의 종료 시각(23:59:59.999)을 UTC Date로 반환
 * 서버(UTC 환경)에서 Prisma 쿼리의 lte 조건에 사용
 */
export const toKSTEndOfDay = (dateStr: string): Date => {
  return new Date(`${dateStr}T23:59:59.999+09:00`);
};
