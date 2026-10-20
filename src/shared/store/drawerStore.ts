import {create} from "zustand";

/**
 * 모바일 사이드바(드로어) 열림 상태.
 * 여는 버튼은 헤더에, 드로어 본체는 레이아웃에 있어 서로 떨어져 있으므로 전역 상태로 연결한다.
 */
interface DrawerState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  open: () => set({isOpen: true}),
  close: () => set({isOpen: false}),
  setOpen: (isOpen) => set({isOpen}),
}));
