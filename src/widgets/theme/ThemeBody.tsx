"use client";
import {Theme} from "@/shared/constants/theme";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import React, {useEffect} from "react";

const ThemeBody = ({children}: {children: React.ReactNode}) => {
  const {value} = useLocalStorage<string>(Theme.THEME_LOCAL_STORAGE_KEY, Theme.LIGHT);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    if (value === Theme.DARK) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [value]);

  // 마운트 전에는 기본값만 적용 (SSR과 동일하게)
  return <>{children}</>;
};

export default ThemeBody;
