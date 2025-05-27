import {Button, ButtonProps} from "@/components/ui/button";
import {useCleanUrl} from "@/hooks/useCleanUrl";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import {useFormContext} from "react-hook-form";

const FormResetButton = ({children, className, ...props}: ButtonProps) => {
  const {reset} = useFormContext();
  const {getCleanUrl} = useCleanUrl();
  const router = useRouter();

  const handleReset = () => {
    reset();
    const cleanUrl = getCleanUrl();
    router.push(cleanUrl);
  };

  return (
    <Button
      type="button"
      onClick={handleReset}
      className={clsx("bg-gray-400 ease-in-out hover:bg-gray-500", className)}
      {...props}>
      {children}
    </Button>
  );
};

export default FormResetButton;
