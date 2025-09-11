import SubHeader from "@/shared/common/SubHeader";
import {ReactNode} from "react";

const LayoutMenu = ({children}: Readonly<{children: ReactNode}>) => {
  return (
    <div className="container flex flex-col gap-6 px-4 py-8">
      <SubHeader />
      {children}
    </div>
  );
};

export default LayoutMenu;
