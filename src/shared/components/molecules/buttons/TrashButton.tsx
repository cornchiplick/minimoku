import {Trash} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

const TrashButton = ({...props}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className="cursor-pointer rounded-full transition-colors" {...props}>
      <Trash className="h-8 w-8 rounded-full p-2 hover:bg-gray-300" stroke="#d0321e" fill="none" />
    </button>
  );
};

export default TrashButton;
