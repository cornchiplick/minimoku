import Typography from "@/components/home/atomic/Typography";
import {cn} from "@/lib/utils";

interface ReadCellProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ReadCell = ({title, className, children}: ReadCellProps) => {
  return (
    <div className="flex min-h-10 self-stretch">
      <div className="flex min-h-10 w-40 items-center">
        <Typography.P1 className={cn("font-bold", className)}>{title}</Typography.P1>
      </div>
      <div className="flex min-h-10 flex-1 flex-wrap content-center items-center">{children}</div>
    </div>
  );
};

export default ReadCell;
