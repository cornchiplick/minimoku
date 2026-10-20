import {Pencil} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

const EditButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    aria-label="수정"
    className="text-minimoku-neutral-bold hover:bg-background-secondary hover:text-foreground focus-visible:ring-minimoku cursor-pointer rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    {...props}>
    <Pencil className="h-4 w-4" />
  </button>
);

export default EditButton;
