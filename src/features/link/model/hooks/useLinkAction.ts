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

  return {
    onClickAlarm,
    onClickFavorite,
    onClickRead,
  };
};

export default useLinkAction;
