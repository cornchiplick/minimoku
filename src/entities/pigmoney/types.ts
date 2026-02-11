// 수입/지출 타입
export enum CashRecordType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

// 거래 기록 인터페이스
export interface CashRecordInterface {
  id: number;
  type: CashRecordType;
  date: Date;
  description: string;
  amount: number;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  categoryId: number;
  category?: CategoryInterface;
}

// 카테고리 인터페이스
export interface CategoryInterface {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

// 카테고리별 합산 데이터 (통계 확장 대비)
export interface CategoryBreakdown {
  categoryName: string;
  total: number;
  type: CashRecordType;
}

// PigMoney 사용자 설정
export interface PigMoneySettingsInterface {
  id: number;
  monthStartDay: number; // 1~28
  weekStartDay: number; // 0=일, 1=월, ..., 6=토
}

// 사이드바 요약 데이터 (이달의 가계 / 이주의 가계)
export interface SummaryData {
  label: string;
  period: string;
  income: number;
  expense: number;
}
