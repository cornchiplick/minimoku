import FormInput from "@/components/common/FormInput";
import Icon from "@/components/common/Icon";
import {KeyboardEventHandler} from "react";

interface SearchFormProps {
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
}

const SearchForm = ({onKeyUp}: SearchFormProps) => {
  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2">
        <Icon name="search" size={18} color="gray" />
      </span>
      <FormInput
        type="text"
        name="keyword"
        placeholder="문장 검색..."
        className="w-full rounded-lg border p-2 pl-10"
        onKeyUp={onKeyUp}
      />
    </div>
  );
};

export default SearchForm;
