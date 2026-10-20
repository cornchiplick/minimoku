import {Trash} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

/** 삭제 — 평소엔 조용하고, 커서를 올렸을 때만 경고색이 된다 */
const TrashButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    aria-label="삭제"
    className="text-minimoku-neutral-bold hover:bg-background-secondary hover:text-destructive focus-visible:ring-destructive cursor-pointer rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    {...props}>
    <Trash className="h-4 w-4" />
  </button>
);

export default TrashButton;
