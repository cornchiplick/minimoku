"use client";

import {Theme} from "@/shared/constants/theme";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import {Moon} from "lucide-react";

const ThemeToggleButton = () => {
  const {value, setValue} = useLocalStorage<string>(Theme.THEME_LOCAL_STORAGE_KEY, Theme.LIGHT);

  const toggleTheme = () => {
    const newTheme = value === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    setValue(newTheme);
  };

  return (
    <button className="rounded-lg p-2 hover:bg-gray-100" onClick={toggleTheme}>
      <Moon className="h-5 w-5 text-gray-600" fill={value === Theme.DARK ? "#000000" : "none"} />
    </button>
  );
};

export default ThemeToggleButton;
