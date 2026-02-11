// 기본 카테고리 목록 (첫 접속 시 자동 생성)
export const DEFAULT_CATEGORIES = ["식비", "간식", "구독"];

// 기본 조회 날짜 구간 (일)
export const DEFAULT_DATE_RANGE_DAYS = 7;

// 사이드바 네비게이션 메뉴
export const PIGMONEY_NAV_ITEMS = [
  { label: "쓰기", href: "/pigmoney", icon: "PenLine" },
  { label: "보고서", href: "/pigmoney/report", icon: "BarChart3" },
  { label: "달력", href: "/pigmoney/calendar", icon: "CalendarDays" },
] as const;

// mockdata (디자인 확인용, 이후 실제 데이터로 교체)
export const MOCK_MONTH_SUMMARY = {
  label: "이달의 가계",
  period: "2026.02.01 ~ 2026.02.28",
  income: 1250000,
  expense: 890000,
};

export const MOCK_WEEK_SUMMARY = {
  label: "이주의 가계",
  period: "2026.02.10 ~ 2026.02.16",
  income: 500000,
  expense: 380000,
};

export const MOCK_RECORDS = [
  { id: 1, date: "2026-02-11", description: "점심식사", amount: 12000, type: "EXPENSE", category: "식비", tags: ["외식"] },
  { id: 2, date: "2026-02-11", description: "버스", amount: 1400, type: "EXPENSE", category: "교통", tags: ["출퇴근"] },
  { id: 3, date: "2026-02-10", description: "넷플릭스", amount: 17000, type: "EXPENSE", category: "구독", tags: [] },
  { id: 4, date: "2026-02-10", description: "카페", amount: 5500, type: "EXPENSE", category: "간식", tags: ["낭비"] },
  { id: 5, date: "2026-02-09", description: "월급", amount: 3500000, type: "INCOME", category: "급여", tags: [] },
  { id: 6, date: "2026-02-08", description: "용돈", amount: 100000, type: "INCOME", category: "기타수입", tags: [] },
];
