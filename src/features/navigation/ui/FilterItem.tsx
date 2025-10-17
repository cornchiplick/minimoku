"use client";

import {FilterInterface} from "@/entities/filter/types";
import {useFilterStore} from "@/features/navigation/model/store/filterStore";
import Typography from "@/shared/home/atomic/Typography";
import {useThemeStore} from "@/shared/store/themeStore";

interface FilterItemProps {
  filter: FilterInterface;
}

const FilterItem = ({filter}: FilterItemProps) => {
  const {isDarkMode} = useThemeStore();
  const {selectedFilterId, setSelectedFilterId} = useFilterStore();

  return (
    <button
      key={filter.id}
      onClick={() => setSelectedFilterId(filter.id)}
      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} ${selectedFilterId === filter.id ? "bg-minimoku text-gray-700" : "text-gray-700"}`}>
      <div className="flex items-center space-x-3">
        <filter.icon className="h-4 w-4" />
        <Typography.P2>{filter.name}</Typography.P2>
      </div>
      {filter.count > 0 && (
        <Typography.P3
          className={`rounded-full px-2 py-1 ${isDarkMode ? "bg-gray-500" : "bg-gray-200"}`}>
          {filter.count}
        </Typography.P3>
      )}
    </button>
  );
};

export default FilterItem;
