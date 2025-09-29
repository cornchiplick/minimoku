import {FolderInterface} from "@/entities/folder/types";
import {create} from "zustand";

interface FolderStore {
  selectedFolderId: number | null;
  setSelectedFolderId: (id: number | null) => void;
  folderList: FolderInterface[];
  setFolderList: (folders: FolderInterface[]) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  selectedFolderId: null,
  setSelectedFolderId: (id: number | null) => set({selectedFolderId: id}),
  folderList: [],
  setFolderList: (folders: FolderInterface[]) => set({folderList: folders}),
}));
