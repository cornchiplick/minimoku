"use client";

import Icon from "@/components/common/Icon";
import Typography from "@/components/home/atomic/Typography";
import {URL, URL_TITLE_MAP} from "@/constants/url";
import {getPathnameArray} from "@/utils/commonUtils";
import {usePathname} from "next/navigation";

const SubHeader = () => {
  // TODO isLoggedIn
  const isLoggedIn = false;
  const pathname = usePathname();
  const firstPath = getPathnameArray(pathname).at(0) || URL.HOME;

  return (
    <Typography.Head3 className="flex items-center gap-2">
      <Icon name={URL_TITLE_MAP[firstPath].icon} size={24} color="black" />
      {isLoggedIn ? URL_TITLE_MAP[firstPath].login : URL_TITLE_MAP[firstPath].logout}
    </Typography.Head3>
  );
};

export default SubHeader;
