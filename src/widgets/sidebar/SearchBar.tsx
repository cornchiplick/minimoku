"use client";

import {
  linkSearchSchema,
  LinkSearchSchemaType,
} from "@/features/link/model/schema/linkSearchSchema";
import FormInput from "@/shared/components/molecules/FormInput";
import {URL} from "@/shared/constants/url";
import {zodResolver} from "@hookform/resolvers/zod";
import {Search} from "lucide-react";
import {useRouter} from "next/navigation";
import {FormProvider, useForm} from "react-hook-form";

const SearchBar = () => {
  const router = useRouter();

  const formMethod = useForm<LinkSearchSchemaType>({
    resolver: zodResolver(linkSearchSchema),
    defaultValues: {
      keyword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const {handleSubmit} = formMethod;

  const onSubmit = (data: LinkSearchSchemaType): void => {
    const keyword = data.keyword || "";

    router.push(`${URL.LINK}?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="relative">
      <FormProvider {...formMethod}>
        <Search className="pointer-events-none absolute top-2.5 left-3 z-10 h-4 w-4 text-gray-400" />
        <FormInput
          name="keyword"
          placeholder="검색어를 입력하세요"
          className="bg-background-secondary text-foreground w-full rounded-lg border-0 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          onKeyUp={handleKeyup}
        />
      </FormProvider>
    </div>
  );
};

export default SearchBar;
