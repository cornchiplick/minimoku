import {deleteFolder, emptyFolder} from "@/features/folder/model/services/folders.service";
import {useRouter} from "next/navigation";
import {useCallback} from "react";
import {toast} from "sonner";

const useFolderAction = () => {
  const router = useRouter();

  const onDeleteFolder = useCallback(async ({id}: {id: number}) => {
    const {error} = await deleteFolder(id);
    if (error) {
      toast.error("폴더 삭제에 실패했습니다.");
    } else {
      toast.success("폴더가 삭제되었습니다.");
      router.push("/link");
    }
  }, []);

  const onEmptyFolder = useCallback(async ({id}: {id: number}) => {
    const {error} = await emptyFolder(id);
    if (error) {
      toast.error("폴더 비우기에 실패했습니다.");
    } else {
      toast.success("폴더가 비워졌습니다.");
    }
  }, []);

  return {
    onDeleteFolder,
    onEmptyFolder,
  };
};

export default useFolderAction;
