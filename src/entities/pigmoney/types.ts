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
