"use client";

import { cn } from "@/shared/lib/utils/commonUtils";
import { Button } from "@/shared/components/atoms/button";
import { Calendar } from "@/shared/components/atoms/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/atoms/popover";
import { formatDate } from "@/shared/lib/utils/dateUtils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DatePickerProps {
  selected?: Date | null;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /** 이 날짜 이전은 선택 불가 */
  minDate?: Date;
  /** 이 날짜 이후는 선택 불가 */
  maxDate?: Date;
}

const DatePicker = ({
  selected,
  onSelect,
  placeholder = "날짜 선택",
  className,
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);

  // 날짜 선택 시 Popover 닫기
  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[140px] justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? formatDate(selected) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected ?? undefined}
          onSelect={handleSelect}
          defaultMonth={selected ?? undefined}
          disabled={[
            ...(minDate ? [{before: minDate}] : []),
            ...(maxDate ? [{after: maxDate}] : []),
          ]}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
