"use client";

import Icon from "@/shared/common/Icon";
import Typography from "@/shared/home/atomic/Typography";
import { MenuItemType } from "@/shared/types/menu";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface MenuItemPropType {
  menu: MenuItemType;
}

const MenuItem = ({menu}: MenuItemPropType) => {
  const router = useRouter();

  const handleMenuClick = useCallback(
    (menu: MenuItemType) => {
      if (menu.url) {
        router.push(menu.url);
      }
    },
    [router]
  );

  return (
    <div
      key={menu.id}
      className="group flex min-h-24 min-w-24 cursor-pointer flex-col items-center justify-center gap-2"
      onClick={() => handleMenuClick(menu)}>
      <Icon name="menu" size={48} />
      <Typography.P1 className="max-w-28 truncate text-center text-gray-700 transition-colors duration-300 dark:text-gray-200">
        {menu.name}
      </Typography.P1>
    </div>
  );
};

export default MenuItem;
