import {Label} from "@/shared/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/atoms/select";
import Typography from "@/shared/home/atomic/Typography";
import {cn} from "@/shared/lib/utils/commonUtils";
import {useRef} from "react";
import {Controller, FieldValues, Path, RegisterOptions, useFormContext} from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder: string;
  registerOptions?: RegisterOptions<T, Path<T>>;
  children: React.ReactNode;
  className?: string;
}

const FormSelect = <T extends FieldValues>({
  name,
  label,
  placeholder,
  registerOptions,
  children,
  className,
}: FormSelectProps<T>) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const {
    control,
    formState: {errors},
  } = useFormContext<T>();

  const required = registerOptions?.required;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <Label className="text-foreground block text-sm font-semibold">
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        rules={registerOptions}
        render={({field}) => (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger
              ref={triggerRef}
              className={cn(
                "focus:border-minimoku border-minimoku-neutral-bold bg-minimoku-input text-foreground placeholder-foreground w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-all duration-200 outline-none",
                className
              )}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="focus:border-minimoku border-minimoku-neutral-bold bg-minimoku-input text-foreground placeholder-foreground w-96 rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-all duration-200 outline-none">
              <SelectGroup>{children}</SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors[name]?.message && (
        <Typography.Error>{String(errors[name]?.message)}</Typography.Error>
      )}
    </div>
  );
};

export default FormSelect;
