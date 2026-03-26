// 텔레그램 봇 관련 상수
export const TELEGRAM = {
  // 기본 알림 시각 (KST)
  DEFAULT_TIME: "18:10",

  // 시간 포맷 패턴 (HH:mm)
  TIME_PATTERN: /^\d{2}:\d{2}$/,

  // 봇 명령어
  COMMAND: {
    TODO: "/todo",
    LIST: "/list",
    DONE: "/done",
    DELETE: "/delete",
  },

  // 반복 옵션
  REPEAT: {
    EVERY: "every",
  },

  // 텔레그램 Bot API 기본 URL
  API_BASE: "https://api.telegram.org/bot",
} as const;
