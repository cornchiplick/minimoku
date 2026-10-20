import {cn} from "@/shared/lib/utils/commonUtils";
import {Check, Circle} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

interface CheckButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isChecked: boolean;
}

/** 읽음 표시 — 모양이 상태를 말하므로 색을 더 쓰지 않는다 */
const CheckButton = ({isChecked, ...props}: CheckButtonProps) => (
  <button
    type="button"
    aria-label={isChecked ? "읽지 않음으로 표시" : "읽음으로 표시"}
    aria-pressed={isChecked}
    className="hover:bg-background-secondary focus-visible:ring-minimoku cursor-pointer rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    {...props}>
    {isChecked ? (
      <Check className={cn("h-4 w-4", "text-foreground")} strokeWidth={2.5} />
    ) : (
      <Circle className="text-minimoku-neutral-bold h-4 w-4" />
    )}
  </button>
);

export default CheckButton;
