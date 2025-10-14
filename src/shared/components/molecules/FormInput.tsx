import * as React from "react";

import {Label} from "@/shared/components/atoms/label";
import Typography from "@/shared/home/atomic/Typography";
import {cn} from "@/shared/lib/utils/commonUtils";
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

  const {required} = registerOptions || {};

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className="text-foreground block text-sm font-semibold">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
      )}
      <input
        {...register(name, registerOptions)}
        className={cn(
          "focus:border-minimoku border-minimoku-neutral-bold bg-minimoku-input text-foreground placeholder:text-minimoku-neutral w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-all duration-200 outline-none",
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
