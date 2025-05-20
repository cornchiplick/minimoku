import FormInput from "@/components/common/FormInput";
import Icon from "@/components/common/Icon";
import {SearchInputs} from "@/types/phrase";
import {SubmitHandler, useFormContext} from "react-hook-form";

interface SearchFormProps {
  onSubmit: SubmitHandler<SearchInputs>;
}

const SearchForm = ({onSubmit}: SearchFormProps) => {
  const {handleSubmit} = useFormContext<SearchInputs>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon name="search" size={18} color="gray" />
        </span>
        <FormInput
          type="text"
          name="keyword"
          placeholder="문장 검색..."
          className="w-full rounded-lg border p-2 pl-10"
        />
      </div>
    </form>
  );
};

export default SearchForm;
