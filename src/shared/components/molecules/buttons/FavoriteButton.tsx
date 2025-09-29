import {Star} from "lucide-react";
import {ButtonHTMLAttributes} from "react";

interface FavoriteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFavorite: boolean;
}

const FavoriteButton = ({isFavorite, ...props}: FavoriteButtonProps) => {
  return (
    <button className="cursor-pointer rounded-full transition-colors" {...props}>
      <Star
        className="h-8 w-8 rounded-full p-2 hover:bg-gray-300"
        stroke={isFavorite ? "#fdc700" : "#99a1af"}
        fill={isFavorite ? "#fdc700" : "none"}
      />
    </button>
  );
};

export default FavoriteButton;
