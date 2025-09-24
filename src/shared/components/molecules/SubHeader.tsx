"use client";

import {URL, URL_TITLE_MAP} from "@/shared/constants/url";
import {useAuth} from "@/shared/lib/hooks/useAuth";
import {getPathnameArray} from "@/shared/lib/utils/commonUtils";
import {usePathname} from "next/navigation";
import Typography from "../../home/atomic/Typography";
import Icon from "./Icon";

const SubHeader = () => {
  const pathname = usePathname();
  const firstPath = getPathnameArray(pathname).at(0) || URL.HOME;
  const {isAuthenticated} = useAuth();

  return (
    <Typography.Head3 className="flex items-center gap-2">
      <Icon name={URL_TITLE_MAP[firstPath].icon} size={24} color="black" />
      {isAuthenticated ? URL_TITLE_MAP[firstPath].login : URL_TITLE_MAP[firstPath].logout}
    </Typography.Head3>
  );
};

export default SubHeader;
