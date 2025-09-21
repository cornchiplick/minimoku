import {FilterInterface} from "@/entities/filter/types";
import FilterItem from "@/features/navigation/ui/FilterItem";
import Typography from "@/shared/home/atomic/Typography";

interface FilterListProps {
  filters: FilterInterface[];
}

const FilterList = ({filters}: FilterListProps) => {
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
