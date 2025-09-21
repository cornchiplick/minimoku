import {menus} from "@/shared/constants/menu";
import MenuItem from "@/widgets/menu/MenuItem";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";

const RootHome = () => {
  return (
    <div
      className={`bg-background text-foreground flex min-h-screen flex-col transition-colors duration-300`}>
      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-start p-6">
        {/* 상단 타이틀 */}
        <div className="flex flex-col items-end self-stretch">
          <ThemeToggleButton />
        </div>
        <div className="mt-[20vh] mb-8">
          <h1 className="text-8xl font-light tracking-tight transition-colors duration-300">
            MiniMoku
          </h1>
        </div>

        {/* 메뉴들 */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-5 justify-items-center gap-8 md:grid-cols-10">
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
