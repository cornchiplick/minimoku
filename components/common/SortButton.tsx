import Icon from "@/components/common/Icon";

interface SortButtonProps {
  name: string;
  sort: string | undefined;
  onChangeSort: () => void;
}

const SortButton = ({name, sort, onChangeSort}: SortButtonProps) => {
  return (
    <button
      className="flex flex-row items-center gap-1 rounded-md border border-gray-600 px-3 py-1"
      onClick={onChangeSort}>
      {name}
      <Icon name={sort === "asc" ? "chevronup" : "chevrondown"} size={16} color="black" />
    </button>
  );
};

export default SortButton;
