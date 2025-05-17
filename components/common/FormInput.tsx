import * as React from "react";

import Typography from "@/components/home/atomic/Typography";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {FieldValues, Path, RegisterOptions, useFormContext} from "react-hook-form";

interface InputProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  label?: string;
  registerOptions?: RegisterOptions<T, Path<T>>;
  className?: string;
}

const FormInput = <T extends FieldValues>({
  name,
  label,
  registerOptions,
  className,
  ...props
}: InputProps<T>) => {
  const {
    register,
    formState: {errors},
  } = useFormContext<T>();

  return (
    <div className="flex w-full flex-col gap-1">
      {label && <Label className="text-gray-700">{label}</Label>}
      <input
        {...register(name, registerOptions)}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
      {errors[name]?.message && (
        <Typography.Error>{String(errors[name]?.message)}</Typography.Error>
      )}
    </div>
  );
};
FormInput.displayName = "FormInput";

export default FormInput;
