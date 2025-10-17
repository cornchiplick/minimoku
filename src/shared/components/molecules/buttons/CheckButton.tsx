import {Circle, CircleCheckBig} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

interface CheckButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isChecked: boolean;
}

const CheckButton = ({isChecked, ...props}: CheckButtonProps) => {
  return (
    <button className="cursor-pointer rounded-full transition-colors" {...props}>
      {isChecked ? (
        <CircleCheckBig className="h-8 w-8 rounded-full p-2 hover:bg-gray-300" stroke="#00a63e" />
      ) : (
        <Circle className="h-8 w-8 rounded-full p-2 hover:bg-gray-300" stroke="#99a1af" />
      )}
    </button>
  );
};

export default CheckButton;
