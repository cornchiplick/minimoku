"use client";

import Icon from "@/shared/common/Icon";
import { menus } from "@/shared/constants/menu";
import { MenuItem } from "@/shared/types/menu";


const RootHome = () => {
  const textColor = "dark:text-white text-gray-800";

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.url) {
      window.open(menu.url, "_blank");
    }
  };

  return (
    <div
      className={`min-h-screen ${textColor} flex flex-col bg-white transition-colors duration-300 dark:bg-gray-700`}>
      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        {/* Google 로고 */}
        <div className="mb-8">
          <h1
            className={`text-8xl font-light tracking-tight transition-colors duration-300 ${textColor}`}>
            MiniMoku
          </h1>
        </div>

        {/* 바로가기 아이콘들 */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-5 justify-items-center gap-8 md:grid-cols-10">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="group flex min-h-10 min-w-10 cursor-pointer flex-col items-center"
                onClick={() => handleMenuClick(menu)}>
                <Icon name="menu" size={40} />
                <span className="max-w-20 truncate text-center text-sm leading-tight text-gray-600 transition-colors duration-300 dark:text-gray-300">
                  {menu.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootHome;
