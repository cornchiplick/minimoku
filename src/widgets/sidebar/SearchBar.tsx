"use client";

import {Search} from "lucide-react";

const SearchBar = () => {
  // TODO 검색
  const searchQuery = "";
  const setSearchQuery = (query: string) => {};

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
      <input
        type="text"
        placeholder="링크 검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-lg border-0 bg-gray-100 py-2 pr-4 pl-10 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
