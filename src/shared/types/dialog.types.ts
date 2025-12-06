export type ShowDialogOptions = {
  variant: "confirm" | "alert" | "error";
  confirmProps?: {
    label?: string;
    color?: string;
    className?: string;
  };
};

export type ShowDialog = (message: string, options?: ShowDialogOptions) => Promise<boolean | void>;

export interface DialogContextType {
  isOpenDialog: boolean;
  showDialog: ShowDialog;
}
