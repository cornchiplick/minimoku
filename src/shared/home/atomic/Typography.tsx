// components/Typography.tsx
import {cn} from "@/shared/lib/utils/commonUtils";
import React from "react";

type TypoType = "Head1" | "Head2" | "Head3" | "SubTitle1" | "P1" | "P2" | "P3" | "Error";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  keyword?: string | null;
}

const typoTypeMap: Record<TypoType, string> = {
  Head1: "text-5xl font-exrabold text-foreground",
  Head2: "text-3xl font-bold text-foreground",
  Head3: "text-2xl font-bold text-foreground",
  SubTitle1: "text-xl font-medium text-foreground",
  P1: "text-base text-foreground",
  P2: "text-sm text-foreground",
  P3: "text-xs text-foreground",
  Error: "text-xs text-red-600 text-foreground",
};

const BaseTypography = ({
  type,
  children,
  className,
  keyword,
}: TypographyProps & {type: TypoType}) => {
  const style = typoTypeMap[type];

  const highlightKeyword = (text: string, keyword: string | null) => {
    if (!keyword) return text;

    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="text-minimoku">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderContent = () => {
    if (!keyword || typeof children !== "string") {
      return children;
    }
    return highlightKeyword(children, keyword);
  };

  // TODO tag의 정확한 용법을 위해 추후 Head1 > h1 태그로 변경하는 등의 사전 작업 필요
  return <p className={cn(style, className)}>{renderContent()}</p>;
};

export const Typography = {
  Head1: (props: TypographyProps) => <BaseTypography type="Head1" {...props} />,
  Head2: (props: TypographyProps) => <BaseTypography type="Head2" {...props} />,
  Head3: (props: TypographyProps) => <BaseTypography type="Head3" {...props} />,
  SubTitle1: (props: TypographyProps) => <BaseTypography type="SubTitle1" {...props} />,
  P1: (props: TypographyProps) => <BaseTypography type="P1" {...props} />,
  P2: (props: TypographyProps) => <BaseTypography type="P2" {...props} />,
  P3: (props: TypographyProps) => <BaseTypography type="P3" {...props} />,
  Error: (props: TypographyProps) => <BaseTypography type="Error" {...props} />,
};

export default Typography;
