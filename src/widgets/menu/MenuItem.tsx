"use client";

import Icon from "@/shared/components/molecules/Icon";
import Typography from "@/shared/home/atomic/Typography";
import {GUEST_PROVIDER} from "@/shared/lib/utils/guestUtils";
import {useThemeStore} from "@/shared/store/themeStore";
import {MenuItemType} from "@/shared/types/menu";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useCallback, useState} from "react";

interface MenuItemPropType {
  menu: MenuItemType;
}

const MenuItem = ({menu}: MenuItemPropType) => {
  const router = useRouter();
  const {isDarkMode} = useThemeStore();
  // 게스트 로그인 진행 중 중복 클릭 방지
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleMenuClick = useCallback(
    (menu: MenuItemType) => {
      if (menu.url) {
        router.push(menu.url);
      }
    },
    [router]
  );

  // 로그인 없이 이용하기: 시드된 게스트 계정으로 자동 로그인 후 해당 서비스로 이동
  const handleGuestClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!menu.url || isGuestLoading) return;
      setIsGuestLoading(true);
      try {
        await signIn(GUEST_PROVIDER, {callbackUrl: menu.url});
      } finally {
        setIsGuestLoading(false);
      }
    },
    [menu.url, isGuestLoading]
  );

  return (
    <div
      key={menu.id}
      className="group flex min-h-24 min-w-24 flex-col items-center justify-start gap-2">
      {/* 메뉴 아이콘 + 이름: 클릭 시 정식 로그인 흐름으로 진입 */}
      <button
        type="button"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 *:transition-colors *:duration-300"
        onClick={() => handleMenuClick(menu)}>
        {isDarkMode ? <Icon name="menu" size={48} color="white" /> : <Icon name="menu" size={48} />}
        <Typography.P1 className="text-foreground max-w-28 truncate text-center transition-colors duration-300">
          {menu.name}
        </Typography.P1>
      </button>
      {/* 게스트 진입 버튼: 단일 게스트 계정으로 즉시 로그인 */}
      <button
        type="button"
        onClick={handleGuestClick}
        disabled={isGuestLoading}
        className="text-foreground/60 hover:text-foreground cursor-pointer text-xs underline-offset-2 transition-colors duration-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50">
        {isGuestLoading ? "이동 중..." : "로그인 없이 이용하기"}
      </button>
    </div>
  );
};

export default MenuItem;
