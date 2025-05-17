// components/Typography.tsx
import {cn} from "@/lib/utils";
import React from "react";

type TypoType = "Head1" | "Head2" | "Head3" | "SubTitle1" | "P1" | "P2" | "P3" | "Error";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

const typoTypeMap: Record<TypoType, string> = {
  Head1: "text-5xl font-exrabold",
  Head2: "text-3xl font-bold",
  Head3: "text-2xl font-bold",
  SubTitle1: "text-xl font-medium",
  P1: "text-base",
  P2: "text-sm",
  P3: "text-xs",
  Error: "text-xs text-red-600",
};

const BaseTypography = ({type, children, className}: TypographyProps & {type: TypoType}) => {
  const style = typoTypeMap[type];
  // TODO tag의 정확한 용법을 위해 추후 Head1 > h1 태그로 변경하는 등의 사전 작업 필요
  return <p className={cn(style, className)}>{children}</p>;
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
