import {create} from "zustand";

interface ThemeState {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  setDarkMode: (value) => set({isDarkMode: value}),
  toggleDarkMode: () => set((state) => ({isDarkMode: !state.isDarkMode})),
}));
