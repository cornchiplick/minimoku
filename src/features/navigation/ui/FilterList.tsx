import {getFilterCounts} from "@/features/navigation/model/services/filter.service";
import FilterItem from "@/features/navigation/ui/FilterItem";
import {FilterConstants} from "@/shared/constants/navigation";
import Typography from "@/shared/home/atomic/Typography";

// 서버 컴포넌트에서 아이콘 이름을 문자열로 전달
const FilterList = async () => {
  // DB에서 필터별 읽지 않은 링크 개수 조회
  const filterCounts = await getFilterCounts();

  const filters = [
    {
      id: FilterConstants.FILTER_ALL,
      name: "전체",
      iconName: "Star" as const,
      count: filterCounts[FilterConstants.FILTER_ALL],
    },
    {
      id: FilterConstants.FILTER_UNREAD,
      name: "읽지 않음",
      iconName: "Bell" as const,
      count: filterCounts[FilterConstants.FILTER_UNREAD],
    },
    {
      id: FilterConstants.FILTER_FAVORITE,
      name: "즐겨찾기",
      iconName: "Star" as const,
      count: filterCounts[FilterConstants.FILTER_FAVORITE],
    },
  ];

  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography.P2 className="font-medium">빠른 필터</Typography.P2>
      <div className="space-y-1">
        {filters.map((filter) => (
          <FilterItem key={filter.id} filter={filter} />
        ))}
      </div>
    </div>
  );
};

export default FilterList;
