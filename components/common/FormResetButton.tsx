import {Button, ButtonProps} from "@/components/ui/button";
import {useCleanUrl} from "@/shared/lib/hooks/useCleanUrl";
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
      className={clsx(
        "bg-secondary-light transition-colors hover:bg-secondary-light/80",
        className
      )}
      {...props}>
      {children}
    </Button>
  );
};

export default FormResetButton;
