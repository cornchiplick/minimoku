import {ICONS} from "@/constants/icons";

interface IconPropType {
  name: keyof typeof ICONS;
  size?: number; // 아이콘 사이즈
  color?: string; // 아이콘 색상
  bgColor?: string; // 배경색
  rx?: string; // 모서리의 둥근정도 보통 size / 10 정도가 적당
}

const Icon = ({name, size = 24, color = "black", bgColor, rx}: IconPropType) => {
  const icon = ICONS[name];

  // 사이즈 동적 조절
  // const scale = size >= 28 ? size / 28 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex items-center justify-center">
      {bgColor && <rect width={size} height={size} rx={rx} fill={bgColor} />}
      {/* <g transform={`scale(${scale})`}> */}
      <g transform={`scale(${size / 24})`}>
        <path fillRule="evenodd" clipRule="evenodd" d={icon} fill={color} />
      </g>
    </svg>
  );
};

export default Icon;
