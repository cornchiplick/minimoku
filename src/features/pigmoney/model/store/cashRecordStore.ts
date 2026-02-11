import {
  CashRecordInterface,
  CategoryInterface,
  PigMoneySettingsInterface,
  SummaryData,
} from "@/entities/pigmoney/types";
import { create } from "zustand";

interface CashRecordStore {
  // 거래 목록
  records: CashRecordInterface[];
  setRecords: (records: CashRecordInterface[]) => void;
  removeRecord: (id: number) => void;

  // 카테고리 목록
  categories: CategoryInterface[];
  setCategories: (categories: CategoryInterface[]) => void;

  // 필터 상태
  dateRange: { from: Date | null; to: Date | null };
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
  showAll: boolean;
  setShowAll: (value: boolean) => void;

  // 사용자 설정
  settings: PigMoneySettingsInterface | null;
  setSettings: (settings: PigMoneySettingsInterface) => void;

  // 사이드바 요약
  monthSummary: SummaryData | null;
  setMonthSummary: (summary: SummaryData | null) => void;
  weekSummary: SummaryData | null;
  setWeekSummary: (summary: SummaryData | null) => void;
  summaryVersion: number;
  invalidateSummary: () => void;
}

export const useCashRecordStore = create<CashRecordStore>((set) => ({
  // 거래 목록
  records: [],
  setRecords: (records) => set({ records }),
  removeRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
    })),

  // 카테고리 목록
  categories: [],
  setCategories: (categories) => set({ categories }),

  // 필터 상태
  dateRange: { from: null, to: null },
  setDateRange: (range) => set({ dateRange: range }),
  showAll: false,
  setShowAll: (value) => set({ showAll: value }),

  // 사용자 설정
  settings: null,
  setSettings: (settings) => set({ settings }),

  // 사이드바 요약 (CRUD 후 summaryVersion 증가 → 자동 재조회 트리거)
  monthSummary: null,
  setMonthSummary: (summary) => set({ monthSummary: summary }),
  weekSummary: null,
  setWeekSummary: (summary) => set({ weekSummary: summary }),
  summaryVersion: 0,
  invalidateSummary: () => set((state) => ({ summaryVersion: state.summaryVersion + 1 })),
}));
