import {CashRecordInterface, CashRecordType, CategoryBreakdown} from "@/entities/pigmoney/types";

/** 스토리에서 쓰는 가짜 거래 기록 — 서버를 거치지 않고 화면만 확인한다 */
const base = {createdAt: new Date(), updatedAt: new Date(), userId: 1};

const day = (offset: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - offset);
  return date;
};

const record = (
  id: number,
  dayOffset: number,
  description: string,
  amount: number,
  categoryName: string,
  type: CashRecordType = CashRecordType.EXPENSE
): CashRecordInterface => ({
  ...base,
  id,
  type,
  date: day(dayOffset),
  description,
  amount,
  categoryId: id,
  category: {id, name: categoryName, createdAt: new Date(), updatedAt: new Date(), userId: 1},
});

export const sampleRecords: CashRecordInterface[] = [
  record(1, 0, "점심 - 김치찌개", 11000, "식비"),
  record(2, 0, "아메리카노", 4500, "카페"),
  record(3, 1, "저녁 - 분식", 9500, "식비"),
  record(4, 1, "지하철 충전", 30000, "교통"),
  record(5, 2, "장보기", 48200, "생활"),
  record(6, 3, "영화", 15000, "문화생활"),
  record(7, 5, "월급", 3245000, "급여", CashRecordType.INCOME),
  record(8, 6, "통신비", 33000, "고정지출"),
];

export const sampleBreakdown: CategoryBreakdown[] = [
  {categoryName: "식비", total: 208000, type: CashRecordType.EXPENSE},
  {categoryName: "쇼핑", total: 127000, type: CashRecordType.EXPENSE},
  {categoryName: "교통", total: 122800, type: CashRecordType.EXPENSE},
  {categoryName: "카페", total: 60500, type: CashRecordType.EXPENSE},
  {categoryName: "문화생활", total: 33000, type: CashRecordType.EXPENSE},
  {categoryName: "급여", total: 3245000, type: CashRecordType.INCOME},
  {categoryName: "용돈", total: 100000, type: CashRecordType.INCOME},
];
