import {deleteLink} from "@/features/link/model/services/links.service";
import {useDialogContext} from "@/shared/providers/DialogProvider";
import {useCallback} from "react";
import {toast} from "sonner";

const useLinkAction = () => {
  const {showDialog} = useDialogContext();

  // TODO
  const onClickAlarm = useCallback(() => {
    console.log("Alarm clicked");
  }, []);

  // TODO
  const onClickFavorite = useCallback(() => {
    console.log("Favorite clicked");
  }, []);

  // TODO
  const onClickRead = useCallback(() => {
    console.log("Read clicked");
  }, []);

  const onDeleteLink = useCallback(async ({id}: {id: number}) => {
    const ok = await showDialog("해당 링크를 정말 삭제하시겠습니까?", {
      variant: "confirm",
    });
    if (!ok) return;

    const {error} = await deleteLink({linkId: id});
    if (!!error) {
      toast.error("링크 삭제에 실패했습니다.");
    } else {
      toast.success("링크가 삭제되었습니다.");
    }
  }, []);

  const onCopyLink = useCallback(async ({url}: {url: string}) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied");
    } catch (error) {
      toast.error("Copy failed");
    }
  }, []);

  return {
    onClickAlarm,
    onClickFavorite,
    onClickRead,
    onDeleteLink,
    onCopyLink,
  };
};

export default useLinkAction;
