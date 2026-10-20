import {SquareArrowOutUpRight} from "lucide-react";

interface ExternalLinkButtonProps {
  url: string;
  /** 스크린리더에 "무엇을" 여는지 알리기 위해 제목을 함께 받는다 */
  title?: string;
}

/**
 * 링크를 새 탭에서 연다.
 *
 * 이전에는 onClick 을 단 SVG 아이콘이어서 키보드로 도달할 수 없었고 스크린리더에도 읽히지 않았다.
 * 주소로 이동하는 동작이므로 button 이 아니라 a 가 맞다.
 */
const ExternalLinkButton = ({url, title}: ExternalLinkButtonProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={title ? `${title} 새 탭에서 열기` : "새 탭에서 열기"}
    className="text-minimoku-neutral-bold hover:text-minimoku focus-visible:ring-minimoku mt-0.5 inline-flex shrink-0 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none">
    <SquareArrowOutUpRight className="h-4 w-4" />
  </a>
);

export default ExternalLinkButton;
