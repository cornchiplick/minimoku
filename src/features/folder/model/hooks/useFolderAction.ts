import {deleteFolder, emptyFolder} from "@/features/folder/model/services/folders.service";
import {useDialogContext} from "@/shared/providers/DialogProvider";
import {useRouter} from "next/navigation";
import {useCallback} from "react";
import {toast} from "sonner";

const useFolderAction = () => {
  const router = useRouter();
  const {showDialog} = useDialogContext();

  const onDeleteFolder = useCallback(
    async ({id}: {id: number}) => {
      const ok = await showDialog("정말 폴더를 삭제하시겠습니까?\n내부 목록이 모두 삭제됩니다.", {
        variant: "confirm",
      });
      if (!ok) return;

      const {error} = await deleteFolder(id);
      if (!!error) {
        toast.error("폴더 삭제에 실패했습니다.");
      } else {
        toast.success("폴더가 삭제되었습니다.");
        router.push("/link");
      }
    },
    [router, showDialog]
  );

  const onEmptyFolder = useCallback(
    async ({id}: {id: number}) => {
      const ok = await showDialog("폴더를 모두 비우시겠습니까?\n내부 목록이 모두 삭제됩니다.", {
        variant: "confirm",
      });
      if (!ok) return;

      const {error} = await emptyFolder(id);
      if (!!error) {
        toast.error("폴더 비우기에 실패했습니다.");
      } else {
        toast.success("폴더가 비워졌습니다.");
      }
    },
    [showDialog]
  );

  return {
    onDeleteFolder,
    onEmptyFolder,
  };
};

export default useFolderAction;
