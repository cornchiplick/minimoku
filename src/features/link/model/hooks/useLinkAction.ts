import {deleteLink, favoriteLink, readLink} from "@/features/link/model/services/links.service";
import {useDialogContext} from "@/shared/providers/DialogProvider";
import {useCallback} from "react";
import {toast} from "sonner";

const useLinkAction = () => {
  const {showDialog} = useDialogContext();

  // TODO
  const onClickAlarm = useCallback(() => {
    console.log("Alarm clicked");
  }, []);

  const onClickFavorite = useCallback(async ({id, onError}: {id: number; onError?: () => void}) => {
    const {error} = await favoriteLink({linkId: id});

    // 즐겨찾기 체크는 토스트, 알림 아무것도 하지 않고 바로 반영
    if (error) {
      if (onError && typeof onError === "function") onError();
      toast.error("즐겨찾기 중 알 수 없는 오류가 발생했어요.");
      return {error: true};
    }

    return {success: true};
  }, []);

  const onClickRead = useCallback(async ({id, onError}: {id: number; onError?: () => void}) => {
    const {error} = await readLink({linkId: id});

    // 즐겨찾기 체크는 토스트, 알림 아무것도 하지 않고 바로 반영
    if (error) {
      if (onError && typeof onError === "function") onError();
      toast.error("읽음 처리 중 알 수 없는 오류가 발생했어요.");
      return {error: true};
    }

    return {success: true};
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
