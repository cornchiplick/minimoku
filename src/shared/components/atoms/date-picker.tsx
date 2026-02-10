"use client";

import { cn } from "@/shared/lib/utils/commonUtils";
import { Button } from "@/shared/components/atoms/button";
import { Calendar } from "@/shared/components/atoms/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/atoms/popover";
import { formatDate } from "@/shared/lib/utils/dateUtils";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  selected?: Date | null;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker = ({
  selected,
  onSelect,
  placeholder = "날짜 선택",
  className,
  disabled,
}: DatePickerProps) => {
  return (
    <Popover>
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
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
