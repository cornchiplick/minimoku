"use client";

import Icon from "@/components/common/Icon";
import Typography from "@/components/home/atomic/Typography";
import {URL_TITLE_MAP} from "@/constants/url";
import {usePathname} from "next/navigation";

const SubHeader = () => {
  // TODO isLoggedIn
  const isLoggedIn = true;
  const pathname = usePathname();

  return (
    <>
      <Typography.Head3 className="flex items-center gap-2">
        <Icon name={URL_TITLE_MAP[pathname].icon} size={24} color="black" />
        {isLoggedIn ? URL_TITLE_MAP[pathname].login : URL_TITLE_MAP[pathname].logout}
      </Typography.Head3>
    </>
  );
};

export default SubHeader;
