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
    <button className="rounded-lg p-2 hover:bg-gray-100" onClick={toggleTheme}>
      <Moon
        className="h-5 w-5 text-gray-600"
        fill={isDarkMode ? "#7d7d7d" : "none"}
        stroke={isDarkMode ? "none" : "#7d7d7d"}
      />
    </button>
  );
};

export default ThemeToggleButton;
