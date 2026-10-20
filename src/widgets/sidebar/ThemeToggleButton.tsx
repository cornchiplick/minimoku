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
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "밝은 테마로 전환" : "어두운 테마로 전환"}
      aria-pressed={isDarkMode}
      className="hover:bg-background-secondary focus-visible:ring-minimoku rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none">
      <Moon
        className="text-minimoku-neutral-bold h-5 w-5"
        fill={isDarkMode ? "currentColor" : "none"}
        stroke={isDarkMode ? "none" : "currentColor"}
      />
    </button>
  );
};

export default ThemeToggleButton;
