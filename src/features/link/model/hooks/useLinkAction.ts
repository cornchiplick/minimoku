import {deleteLink} from "@/features/link/model/services/links.service";
import {useCallback} from "react";
import {toast} from "sonner";

const useLinkAction = () => {
  const onClickAlarm = useCallback(() => {
    console.log("Alarm clicked");
  }, []);

  const onClickFavorite = useCallback(() => {
    console.log("Favorite clicked");
  }, []);

  const onClickRead = useCallback(() => {
    console.log("Read clicked");
  }, []);

  const onDeleteLink = useCallback(async ({id}: {id: number}) => {
    const {error} = await deleteLink({linkId: id});
    if (error) {
      toast.error("링크 삭제에 실패했습니다.");
    } else {
      toast.success("링크가 삭제되었습니다.");
    }
  }, []);

  return {
    onClickAlarm,
    onClickFavorite,
    onClickRead,
    onDeleteLink,
  };
};

export default useLinkAction;
