"use client";

import {cn} from "@/shared/lib/utils/commonUtils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {X} from "lucide-react";
import * as React from "react";

/**
 * 화면 가장자리에서 밀려 들어오는 패널. 모바일 사이드바(드로어)에 쓴다.
 * Radix Dialog 를 기반으로 하므로 포커스 트랩·ESC 닫기·스크롤 잠금이 기본 제공된다.
 */
const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({className, ...props}, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const sideClasses = {
  left: "inset-y-0 left-0 h-full w-80 max-w-[85vw] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  right:
    "inset-y-0 right-0 h-full w-80 max-w-[85vw] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
} as const;

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: keyof typeof sideClasses;
  /** 스크린리더용 제목 (시각적으로는 숨긴다) */
  title: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({className, children, side = "left", title, ...props}, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "bg-background-primary border-background-secondary data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col shadow-float transition ease-out-smooth duration-300",
        sideClasses[side],
        className
      )}
      {...props}>
      {/* Radix 는 Content 에 접근 가능한 이름을 요구한다 */}
      <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
      {children}
      <DialogPrimitive.Close
        aria-label="메뉴 닫기"
        className="ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:outline-none">
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

export {Sheet, SheetClose, SheetContent, SheetOverlay, SheetPortal, SheetTrigger};
