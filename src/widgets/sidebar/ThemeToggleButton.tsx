"use client";

import {Theme} from "@/shared/constants/theme";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import {useThemeStore} from "@/shared/store/themeStore";
import {Moon} from "lucide-react";
import {useEffect} from "react";

const ThemeToggleButton = () => {
  const {value, setValue} = useLocalStorage<string>(Theme.THEME_LOCAL_STORAGE_KEY, Theme.LIGHT);
  const {isDarkMode, setDarkMode, toggleDarkMode} = useThemeStore();

  const toggleTheme = () => {
    const newTheme = value === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setValue(newTheme);
    toggleDarkMode();
  };

  useEffect(() => {
    setDarkMode(value === Theme.DARK);
  }, [value]);

  return (
    <button className="rounded-lg p-2 hover:bg-accent" onClick={toggleTheme}>
      <Moon
        className="h-5 w-5 text-minimoku-neutral-bold"
        fill={isDarkMode ? "currentColor" : "none"}
        stroke={isDarkMode ? "none" : "currentColor"}
      />
    </button>
  );
};

export default ThemeToggleButton;
