import {cn} from "@/shared/lib/utils/commonUtils";
import {Bell} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

interface AlarmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isAlarm: boolean;
}

/** 알림 — 켜진 상태는 채워서 표시한다 */
const AlarmButton = ({isAlarm, ...props}: AlarmButtonProps) => (
  <button
    type="button"
    aria-label={isAlarm ? "알림 끄기" : "알림 켜기"}
    aria-pressed={isAlarm}
    className="hover:bg-background-secondary focus-visible:ring-minimoku cursor-pointer rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    {...props}>
    <Bell
      className={cn("h-4 w-4", isAlarm ? "text-foreground" : "text-minimoku-neutral-bold")}
      fill={isAlarm ? "currentColor" : "none"}
    />
  </button>
);

export default AlarmButton;
