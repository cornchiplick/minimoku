import {FilterConstants} from "@/shared/constants/navigation";
import {create} from "zustand";

interface FilterStore {
  selectedFilterId: string | null;
  setSelectedFilterId: (id: string) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedFilterId: FilterConstants.FILTER_ALL,
  setSelectedFilterId: (id: string) => set({selectedFilterId: id}),
}));
