import { CashRecordInterface, CategoryInterface } from "@/entities/pigmoney/types";
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
}));
