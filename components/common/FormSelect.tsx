import {Select, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";
import {
  Controller,
  FieldValue,
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  defaultValue: FieldValue<T>;
  children: React.ReactNode;
  className?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

const FormSelect = <T extends FieldValues>({
  name,
  defaultValue,
  children,
  className,
  rules,
}: FormSelectProps<T>) => {
  const {control} = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({field}) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className={cn("w-[180px]", className)}>
            <SelectValue placeholder="항목" />
          </SelectTrigger>
          {children}
        </Select>
      )}
    />
  );
};

export default FormSelect;
