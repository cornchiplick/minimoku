import {getFolders} from "@/features/folder/model/services/folders.service";
import Sidebar from "@/widgets/sidebar/Sidebar";
import {unstable_noStore as noStore} from "next/cache";

const LinkHomeLayout = async ({children}: {children: React.ReactNode}) => {
  noStore();
  const initialFolders = await getFolders();

  return (
    <div className="flex min-h-screen">
      <Sidebar initialFolders={initialFolders} />
      {children}
    </div>
  );
};

export default LinkHomeLayout;
