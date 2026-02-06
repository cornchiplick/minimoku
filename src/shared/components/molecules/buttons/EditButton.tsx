import {Pencil} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

const EditButton = ({...props}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className="cursor-pointer rounded-full transition-colors" {...props}>
      <Pencil className="h-8 w-8 rounded-full p-2 hover:bg-gray-300" stroke="#99a1af" fill="none" />
    </button>
  );
};

export default EditButton;
