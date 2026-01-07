"use client";

import {X} from "lucide-react";

import {Label} from "@/shared/components/atoms/label";
import Typography from "@/shared/home/atomic/Typography";
import {cn} from "@/shared/lib/utils/commonUtils";
import {CompositionEvent, KeyboardEvent, useCallback, useMemo, useRef, useState} from "react";
import {FieldValues, Path, useFormContext} from "react-hook-form";

interface FormTagInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
}

const FormTagInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
}: FormTagInputProps<T>) => {
  const {
    setValue,
    watch,
    formState: {errors},
  } = useFormContext<T>();

  const watchedTags = watch(name) as string[] | undefined;
  const tags = useMemo(() => watchedTags ?? [], [watchedTags]);
  const [inputValue, setInputValue] = useState("");
  const isComposingRef = useRef(false);

  // 태그 추가
  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (!trimmedTag || tags.includes(trimmedTag)) {
        setInputValue("");
        return;
      }
      setValue(name, [...tags, trimmedTag] as T[Path<T>], {shouldValidate: true});
      setInputValue("");
    },
    [tags, name, setValue]
  );

  // 태그 제거
  const removeTag = useCallback(
    (indexToRemove: number) => {
      setValue(name, tags.filter((_, i) => i !== indexToRemove) as T[Path<T>], {
        shouldValidate: true,
      });
    },
    [tags, name, setValue]
  );

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 IME 조합 중일 때는 무시
    if (e.nativeEvent.isComposing || isComposingRef.current) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // IME 조합 이벤트 핸들러
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const value = e.currentTarget.value;
    if (value.endsWith(" ")) {
      addTag(value.slice(0, -1));
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {label && <Label className="text-foreground block text-sm font-semibold">{label}</Label>}
      <div
        className={cn(
          "focus-within:border-minimoku border-minimoku-neutral-bold bg-minimoku-input flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded-lg border px-3 py-2 transition-all duration-200",
          className
        )}>
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="bg-minimoku text-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-minimoku-neutral ml-0.5 rounded-sm p-0.5 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="text-foreground placeholder:text-minimoku-neutral min-w-[120px] flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {errors[name]?.message && (
        <Typography.Error>{String(errors[name]?.message)}</Typography.Error>
      )}
    </div>
  );
};
FormTagInput.displayName = "FormTagInput";

export default FormTagInput;
