import Typography from "@/shared/home/atomic/Typography";
import {cn} from "@/shared/lib/utils/commonUtils";

interface ReadCellProps {
  title: string;
  titleWidth?: string;
  className?: string;
  children: React.ReactNode;
}

const ReadCell = ({title, titleWidth = "w-40", className, children}: ReadCellProps) => {
  return (
    <div className="flex min-h-10 self-stretch">
      <div className={cn("flex min-h-10 items-center", titleWidth)}>
        <Typography.P1 className={cn("font-bold", className)}>{title}</Typography.P1>
      </div>
      <div className="flex min-h-10 flex-1 flex-wrap content-center items-center">{children}</div>
    </div>
  );
};

export default ReadCell;
