import {deleteLink} from "@/features/link/model/services/links.service";
import {useCallback} from "react";

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
    await deleteLink({linkId: id});
  }, []);

  return {
    onClickAlarm,
    onClickFavorite,
    onClickRead,
    onDeleteLink,
  };
};

export default useLinkAction;
