import {getFolder} from "@/features/folder/model/services/folders.service";
import {getLinks} from "@/features/link/model/services/links.service";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import LinkLockerMain from "@/widgets/link/LinkLockerMain";
import {notFound, redirect} from "next/navigation";

const LinkFolderHome = async ({params}: {params: Promise<{id: string}>}) => {
  const {id} = await params;
  const user = await getSessionUser();

  // proxy 에서 걸러지지만 방어적으로 한 번 더 확인한다
  if (!user) {
    redirect("/login");
  }

  // 폴더 정보와 링크 정보 동시 조회
  const [folder, initialLinks] = await Promise.all([
    getFolder({folderId: Number(id), userId: user.id}),
    getLinks({params: {folderId: id}}),
  ]);

  // 폴더가 없거나 소유자가 아니면 404 로 처리한다
  if (folder.error || !("name" in folder)) {
    notFound();
  }

  return <LinkLockerMain initialLinks={initialLinks} folderName={folder.name} />;
};

export default LinkFolderHome;
