import {getFolders} from "@/features/link/model/services/links.service";
import Sidebar from "@/widgets/sidebar/Sidebar";

const LinkHomeLayout = async ({children}: {children: React.ReactNode}) => {
  const initialFolders = await getFolders();

  return (
    <div className="flex min-h-screen">
      <Sidebar initialFolders={initialFolders} />
      {children}
    </div>
  );
};

export default LinkHomeLayout;
