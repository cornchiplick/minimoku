import {Bell} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

interface AlarmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isAlarm: boolean;
}

const AlarmButton = ({isAlarm, ...props}: AlarmButtonProps) => {
  return (
    <button className="cursor-pointer rounded-full transition-colors" {...props}>
      <Bell
        className="h-8 w-8 rounded-full p-2 hover:bg-gray-300"
        stroke={isAlarm ? "#f54900" : "#99a1af"}
        fill={isAlarm ? "#f54900" : "none"}
      />
    </button>
  );
};

export default AlarmButton;
