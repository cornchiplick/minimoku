interface DividerProps {
  direction?: "horizontal" | "vertical";
  className?: string;
}

/**
direction: 'horizontal' | 'vertical' prop 추가
기본값은 horizontal
vertical일 때는 w-px, h-full, border-l 사용
horizontal일 때는 w-full, h-px, border-t 사용
추가로 className prop으로 커스텀 스타일도 전달 가능
 */
const Divider = ({direction = "horizontal", className = ""}: DividerProps) => {
  if (direction === "vertical") {
    return (
      <div
        className={`bg-semi-background border-semi-background h-full w-px border-l ${className}`}
        aria-hidden="true"
      />
    );
  }
  return <hr className={`h-px w-full bg-semi-background border-semi-background ${className}`} aria-hidden="true" />;
};

export default Divider;
