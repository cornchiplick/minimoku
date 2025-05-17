import {Button, ButtonProps} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {useFormStatus} from "react-dom";

// interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const FormButton = ({children, ...props}: ButtonProps) => {
  const {pending} = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-indigo-600 ease-in-out hover:bg-indigo-700"
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
