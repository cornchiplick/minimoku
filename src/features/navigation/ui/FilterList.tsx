"use client";

import FilterItem from "@/features/navigation/ui/FilterItem";
import {FilterConstants} from "@/shared/constants/navigation";
import Typography from "@/shared/home/atomic/Typography";
import {Bell, Star} from "lucide-react";

const FilterList = () => {
  const filters = [
    {id: FilterConstants.FILTER_ALL, name: "전체", icon: Star, count: 4},
    {id: FilterConstants.FILTER_UNREAD, name: "읽지 않음", icon: Bell, count: 2},
    {id: FilterConstants.FILTER_FAVORITE, name: "즐겨찾기", icon: Star, count: 1},
    // {id: FilterConstants.FILTER_NOTIFIED, name: "알림 설정", icon: Bell, count: 0},
  ];

  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography.P2 className="font-medium">빠른 필터</Typography.P2>
      <div className="space-y-1">
        {filters.map((filter) => (
          <FilterItem key={filter.name} filter={filter} />
        ))}
      </div>
    </div>
  );
};

export default FilterList;
