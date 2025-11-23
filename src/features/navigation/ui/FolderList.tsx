"use client";

import {FolderInterface} from "@/entities/folder/types";
import useFolderAction from "@/features/folder/model/hooks/useFolderAction";
import {useFolderStore} from "@/features/folder/model/store/folderStore";
import FolderAddButton from "@/features/folder/ui/FolderAddButton";
import FolderFormModal from "@/features/folder/ui/FolderFormModal";
import FolderItem from "@/features/navigation/ui/FolderItem";
import {URL} from "@/shared/constants/url";
import Typography from "@/shared/home/atomic/Typography";
import {useBoolean} from "@/shared/hooks/useBoolean";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

interface FolderListProps {
  folders: FolderInterface[];
}

const FolderList = ({folders}: FolderListProps) => {
  const router = useRouter();
  const {setFolderList} = useFolderStore();
  const isShowFolderEditModal = useBoolean();
  const [selectedFolder, setSelectedFolder] = useState<FolderInterface | null>(null);

  const handleFolderClick = (folderId: string) => {
    // link => link/{folderId} 로 이동
    const nextPath = `${URL.LINK}/${folderId}`;
    router.push(nextPath);
  };

  const {onDeleteFolder, onEmptyFolder} = useFolderAction();

  const handleFolderEdit = (folder: FolderInterface) => {
    setSelectedFolder(folder);
    isShowFolderEditModal.onTrue();
  };

  useEffect(() => {
    setFolderList(folders);
  }, [folders, setFolderList]);

  return (
    <>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex w-full items-center justify-between pr-3">
          <Typography.P2 className="font-medium">폴더</Typography.P2>
          <FolderAddButton />
        </div>
        <div className="space-y-1">
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              onClick={() => handleFolderClick(folder.id.toString())}
              onEdit={() => handleFolderEdit(folder)}
              onDelete={() => onDeleteFolder({id: Number(folder.id)})}
              onEmpty={() => onEmptyFolder({id: Number(folder.id)})}
            />
          ))}
        </div>
      </div>
      {selectedFolder && (
        <FolderFormModal
          isEdit={true}
          modalState={isShowFolderEditModal}
          originValue={selectedFolder}
        />
      )}
    </>
  );
};

export default FolderList;
