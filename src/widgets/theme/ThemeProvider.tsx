"use client";
import {Theme} from "@/shared/constants/theme";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import {useThemeStore} from "@/shared/store/themeStore";
import React, {useEffect} from "react";

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const {value} = useLocalStorage<string>(Theme.THEME_LOCAL_STORAGE_KEY, Theme.LIGHT);
  const {setDarkMode} = useThemeStore();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    const body = window.document.body;
    if (value === Theme.DARK) {
      root.classList.add("dark");
      body.classList.add("dark");
      setDarkMode(true);
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      setDarkMode(false);
    }
  }, [value]);

  // 마운트 전에는 기본값만 적용 (SSR과 동일하게)
  return <>{children}</>;
};

export default ThemeProvider;
