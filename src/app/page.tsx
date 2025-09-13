import {menus} from "@/shared/constants/menu";
import MenuItem from "@/widgets/menu/MenuItem";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";

const RootHome = () => {
  // const textColor = "dark:text-white text-gray-800";
  const textColor = "";
  // const bgColor = "dark:bg-gray-800 bg-white";
  const bgColor = "";

  return (
    <div
      className={`bg-background text-foreground flex min-h-screen flex-col transition-colors duration-300`}>
      {/* 메인 컨텐츠 */}
      <div className="mt-[20vh] flex flex-1 flex-col items-center justify-start px-6">
        {/* 상단 타이틀 */}
        <div className="mb-8">
          <h1
            className={`text-8xl font-light tracking-tight transition-colors duration-300 ${textColor}`}>
            MiniMoku
          </h1>
        </div>

        {/* 메뉴들 */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-5 justify-items-center gap-8 md:grid-cols-10">
            <ThemeToggleButton />
            {menus.map((menu) => (
              <MenuItem key={menu.id} menu={menu} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootHome;
