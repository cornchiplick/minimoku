// 수입/지출 타입
// TypeScript enum 대신 상수 객체 + 유니온 타입으로 선언한다.
// enum 은 명목적 타입이라 Prisma 가 생성한 동일 값의 열거형과 호환되지 않아,
// DB 조회 결과를 그대로 쓰지 못하는 문제가 있었다. 유니온 타입은 구조적으로 호환된다.
export const CashRecordType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type CashRecordType = (typeof CashRecordType)[keyof typeof CashRecordType];

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
  // 저장된 행이 아직 없을 수 있으므로 id 는 두지 않는다 (어디서도 쓰지 않음)
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
