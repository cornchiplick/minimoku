"use client";

import Icon from "@/shared/components/molecules/Icon";
import Typography from "@/shared/home/atomic/Typography";
import {useThemeStore} from "@/shared/store/themeStore";
import {MenuItemType} from "@/shared/types/menu";
import {useRouter} from "next/navigation";
import {useCallback} from "react";

interface MenuItemPropType {
  menu: MenuItemType;
}

const MenuItem = ({menu}: MenuItemPropType) => {
  const router = useRouter();
  const {isDarkMode} = useThemeStore();

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
      className="group flex min-h-24 min-w-24 cursor-pointer flex-col items-center justify-center gap-2 *:transition-colors *:duration-300"
      onClick={() => handleMenuClick(menu)}>
      {isDarkMode ? <Icon name="menu" size={48} color="white" /> : <Icon name="menu" size={48} />}
      <Typography.P1 className="text-foreground max-w-28 truncate text-center transition-colors duration-300">
        {menu.name}
      </Typography.P1>
    </div>
  );
};

export default MenuItem;
