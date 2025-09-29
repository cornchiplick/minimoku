import {useCallback, useState} from "react";

export const useBoolean = () => {
  const [value, setValue] = useState(false);

  const onTrue = useCallback((e: any) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    setValue(true);
  }, []);

  const onFalse = useCallback((e: any) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    setValue(false);
  }, []);

  const onToggle = useCallback((e: any) => {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    setValue((prev) => !prev);
  }, []);

  return {
    value,
    onTrue,
    onFalse,
    onToggle,
    setValue,
  };
};
