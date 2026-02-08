import {getFolder} from "@/features/folder/model/services/folders.service";
import {getLinks} from "@/features/link/model/services/links.service";
import {getSessionUser} from "@/shared/lib/utils/authUtils";
import LinkLockerMain from "@/widgets/link/LinkLockerMain";

const LinkFolderHome = async ({params}: {params: Promise<{id: string}>}) => {
  try {
    const {id} = await params;
    const user = await getSessionUser();

    if (!user) {
      return <div>로그인이 필요합니다.</div>;
    }

    // 폴더 정보와 링크 정보 동시 조회
    const [folder, initialLinks] = await Promise.all([
      getFolder({folderId: Number(id), userId: user.id}),
      getLinks({params: {folderId: id}}),
    ]);

    // 폴더가 존재하지 않거나 접근 권한이 없는 경우
    if (folder.error) {
      return <div>존재하지 않거나 접근 권한이 없는 폴더입니다.</div>;
    }

    return <LinkLockerMain initialLinks={initialLinks} folderName={folder.name} />;
  } catch (error) {
    console.error("Error loading folder links:", error);

    return <div>오류가 발생했습니다. 다시 시도해주세요.</div>;
  }
};

export default LinkFolderHome;
