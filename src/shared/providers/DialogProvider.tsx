import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/atoms/alertDialog";
import {Button} from "@/shared/components/atoms/button";
import Typography from "@/shared/home/atomic/Typography";
import {DialogContextType, ShowDialogOptions} from "@/shared/types/dialog.types";
import {createContext, useCallback, useContext, useMemo, useRef, useState} from "react";

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogProvider");
  }
  return context;
};

export function DialogProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [options, setOptions] = useState<ShowDialogOptions>({variant: "alert"});
  const resolverRef = useRef<((value: boolean | PromiseLike<boolean>) => void) | null>(null);

  // showDialog에서 Promise 생성 & Dialog 오픈
  const showDialog = useCallback((msg: string, opt: ShowDialogOptions = {variant: "alert"}) => {
    setMessage(msg);
    setOptions(opt);
    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  // 확인/취소 핸들러 옵션에 따라
  const handleConfirm = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(true);
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resolverRef.current?.(false);
  }, []);

  const value = useMemo(
    () => ({
      isOpenDialog: isOpen,
      showDialog,
    }),
    [isOpen, showDialog]
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="bg-background-primary text-[#637381]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <Typography.P2 className="text-minimoku-neutral-bold">알림</Typography.P2>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-foreground font-medium whitespace-pre-line">
            {message}
          </AlertDialogDescription>
          <AlertDialogFooter>
            {options.variant === "confirm" && (
              <Button
                variant="outline"
                className="bg-background-reverse-primary text-background-primary border-border hover:bg-background-reverse-primary"
                onClick={handleCancel}>
                취소
              </Button>
            )}
            <Button
              variant="outline"
              className="bg-background-primary text-foreground border-border hover:bg-background-primary"
              onClick={handleConfirm}>
              확인
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContext.Provider>
  );
}
