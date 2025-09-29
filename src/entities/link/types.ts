export interface LinkInterface {
  id: number;
  title: string;
  url: string;
  imageUrl: string | null;
  folderId: number;
  tags: string[];
  isAlarm: boolean;
  isFavorite: boolean;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  memo?: string | null;
}
