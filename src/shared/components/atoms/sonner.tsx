"use client";

import {CheckCircle, Loader2, XCircle} from "lucide-react";
// import {useTheme} from "next-themes";
import {Toaster as Sonner} from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({...props}: ToasterProps) => {
  // const {theme = "system"} = useTheme();

  return (
    <Sonner
      // theme={theme as ToasterProps["theme"]}
      theme="light"
      className="toaster group"
      position="top-right"
      duration={1000}
      toastOptions={{
        classNames: {
          toast: "bg-white text-black border",
        },
      }}
      icons={{
        success: <CheckCircle className="text-green-500" />, // 초록 체크
        error: <XCircle className="text-red-500" />, // 빨강 에러
        loading: <Loader2 className="animate-spin text-gray-400" />, // 회색 스피너
      }}
      {...props}
    />
  );
};

export {Toaster};
