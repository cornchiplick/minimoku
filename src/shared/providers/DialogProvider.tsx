import {AlertDialog, AlertDialogTitle} from "@/shared/components/atoms/alertDialog";
import {Button} from "@/shared/components/atoms/button";
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
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [options, setOptions] = useState<ShowDialogOptions>({variant: "alert"});
  const resolverRef = useRef<(value: boolean | void) => void>(null);

  // showDialog에서 Promise 생성 & Dialog 오픈
  const showDialog = useCallback((msg: string, opt: ShowDialogOptions = {variant: "alert"}) => {
    setMessage(msg);
    setOptions(opt);
    setOpen(true);

    return new Promise<boolean | void>((resolve) => {
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
        <AlertDialogTitle>{message}</AlertDialogTitle>
        <Button onClick={handleConfirm}>확인</Button>
        {options.variant === "confirm" && <Button onClick={handleCancel}>취소</Button>}
      </AlertDialog>
    </DialogContext.Provider>
  );
}
