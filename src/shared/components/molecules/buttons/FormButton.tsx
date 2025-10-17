import {Button, ButtonProps} from "@/shared/components/atoms/button";
import clsx from "clsx";
import {Loader2} from "lucide-react";
import {useFormContext} from "react-hook-form";

const FormButton = ({children, className, ...props}: ButtonProps) => {
  const formContext = useFormContext();
  const pending = formContext?.formState?.isSubmitting || false;

  return (
    <Button
      type="submit"
      disabled={pending}
      className={clsx(
        "bg-background-reverse-primary hover:bg-background-reverse-secondary ease-in-out",
        className
      )}
      {...props}>
      {pending ? (
        <>
          <Loader2 className="animate-spin" />
          Loading
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default FormButton;
