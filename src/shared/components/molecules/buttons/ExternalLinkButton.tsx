import {SquareArrowOutUpRight} from "lucide-react";

interface ExternalLinkButtonProps {
  url: string;
}

const ExternalLinkButton = ({url}: ExternalLinkButtonProps) => {
  const onClickUrl = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <SquareArrowOutUpRight className="h-4 w-4 cursor-pointer text-gray-400" onClick={onClickUrl} />
  );
};

export default ExternalLinkButton;
