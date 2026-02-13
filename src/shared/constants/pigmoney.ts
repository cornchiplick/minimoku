// 기본 카테고리 목록 (첫 접속 시 자동 생성)
export const DEFAULT_CATEGORIES = ["식비", "간식", "구독"];

// 기본 조회 날짜 구간 (일)
export const DEFAULT_DATE_RANGE_DAYS = 7;

// 설정 기본값
export const DEFAULT_MONTH_START_DAY = 1;
export const DEFAULT_WEEK_START_DAY = 0; // 0=일요일

// 요일 라벨
export const WEEK_DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// 사이드바 네비게이션 메뉴
export const PIGMONEY_NAV_ITEMS = [
  { label: "쓰기", href: "/pigmoney", icon: "PenLine" },
  { label: "보고서", href: "/pigmoney/report", icon: "BarChart3" },
  { label: "달력", href: "/pigmoney/calendar", icon: "CalendarDays" },
  { label: "설정", href: "/pigmoney/settings", icon: "Settings" },
] as const;
