import {FolderInterface} from "@/entities/folder/types";
import FolderItem from "@/features/navigation/ui/FolderItem";
import Typography from "@/shared/home/atomic/Typography";

interface FolderListProps {
  folders: FolderInterface[];
}

const FolderList = ({folders}: FolderListProps) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Typography.P2 className="font-medium">폴더</Typography.P2>
      <div className="space-y-1">
        {folders.map((folder) => (
          <FolderItem key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  );
};

export default FolderList;
