import {FolderInterface} from "@/entities/folder/types";
import {useFolderStore} from "@/features/folder/model/store/folderStore";
import FolderItem from "@/features/navigation/ui/FolderItem";
import {URL} from "@/shared/constants/url";
import Typography from "@/shared/home/atomic/Typography";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

interface FolderListProps {
  folders: FolderInterface[];
}

const FolderList = ({folders}: FolderListProps) => {
  const router = useRouter();
  const {setFolderList} = useFolderStore();

  const handleFolderClick = (folderId: string) => {
    // link => link/{folderId} 로 이동
    const nextPath = `${URL.LINK}/${folderId}`;
    router.push(nextPath);
  };

  useEffect(() => {
    setFolderList(folders);
  }, [folders]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography.P2 className="font-medium">폴더</Typography.P2>
      <div className="space-y-1">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            onClick={() => {
              handleFolderClick(folder.id.toString());
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderList;
