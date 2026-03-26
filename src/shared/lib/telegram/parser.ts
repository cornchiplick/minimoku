import {TELEGRAM} from "./constants";

// 파싱된 todo 명령 결과
export interface ParsedTodoCommand {
  title: string;
  time: string; // "HH:mm"
}

// 파싱된 done/delete 명령 결과
export interface ParsedIndexCommand {
  index: number; // 1-based 번호
}

// 시간 유효성 검증 (00:00 ~ 23:59)
function isValidTime(time: string): boolean {
  if (!TELEGRAM.TIME_PATTERN.test(time)) return false;
  const [hours, minutes] = time.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

/**
 * /todo 명령어 파싱
 * - /todo title → { title, time: "18:10" }
 * - /todo title 07:30 → { title, time: "07:30" }
 * - /todo title 22:00 every → { title, time: "22:00" }
 */
export function parseTodoCommand(text: string): ParsedTodoCommand | null {
  const tokens = text.trim().split(/\s+/);

  // 최소 2개 토큰 필요: /todo title
  if (tokens.length < 2) return null;

  const title = tokens[1];

  // 토큰 2개: /todo title → 기본 시간
  if (tokens.length === 2) {
    return {title, time: TELEGRAM.DEFAULT_TIME};
  }

  // 토큰 3개 이상: 시간 확인
  const possibleTime = tokens[2];
  if (TELEGRAM.TIME_PATTERN.test(possibleTime) && isValidTime(possibleTime)) {
    return {title, time: possibleTime};
  }

  // 시간 형식이 아니면 기본값 적용
  return {title, time: TELEGRAM.DEFAULT_TIME};
}

/**
 * /done, /delete 명령어 파싱
 * - /done 3 → { index: 3 }
 * - /delete 1 → { index: 1 }
 */
export function parseIndexCommand(text: string): ParsedIndexCommand | null {
  const tokens = text.trim().split(/\s+/);

  if (tokens.length < 2) return null;

  const index = parseInt(tokens[1], 10);
  if (isNaN(index) || index < 1) return null;

  return {index};
}
