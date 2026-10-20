import {cn} from "@/shared/lib/utils/commonUtils";
import {Star} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

interface FavoriteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFavorite: boolean;
}

/** 즐겨찾기 — 켜졌을 때만 강조색으로 채운다 (꺼진 상태는 테두리만) */
const FavoriteButton = ({isFavorite, ...props}: FavoriteButtonProps) => (
  <button
    type="button"
    aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
    aria-pressed={isFavorite}
    className="hover:bg-background-secondary focus-visible:ring-minimoku cursor-pointer rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    {...props}>
    <Star
      className={cn("h-4 w-4", isFavorite ? "text-minimoku" : "text-minimoku-neutral-bold")}
      fill={isFavorite ? "currentColor" : "none"}
    />
  </button>
);

export default FavoriteButton;
