import {Button, ButtonProps} from "@/shared/components/atoms/button";
import clsx from "clsx";
import {Loader2} from "lucide-react";
import {useFormStatus} from "react-dom";

const FormButton = ({children, className, ...props}: ButtonProps) => {
  const {pending} = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={clsx("bg-indigo-600 ease-in-out hover:bg-indigo-700", className)}
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
