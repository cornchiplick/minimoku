export const URL = {
  HOME: "/",
  PHRASES: "/phrases",
  HIRAKATA: "/hirakata",
  LOGIN: "/login",
  QUIZ: "/quiz",
  ACCUMULATE: "/accumulate",

  SIGNUP: "/signup",
  QUIZ_JA_KO: "/quiz-ja-ko",
  QUIZ_KO_JA: "/quiz-ko-ja",
  ALPHABET_HIRAGANA: "/alphabet/hiragana",
  ALPHABET_KATAKANA: "/alphabet/katakana",
  ALPHABET_ROMAJI: "/alphabet/romaji",
  ALPHABET_KANJI: "/alphabet/kanji",
};

type UrlTitleMap = {
  [key in (typeof URL)[keyof typeof URL]]: {
    login: string;
    logout: string;
    icon: "book" | "listcheck" | "barchartver" | "barcharthor" | "table" | "edit";
  };
};

export const URL_TITLE_MAP: UrlTitleMap = {
  [URL.HOME]: {
    login: "홈",
    logout: "예시 회화 문장",
    icon: "book",
  },
  [URL.PHRASES]: {
    login: "내 일본어 회화 문장",
    logout: "예시 회화 문장",
    icon: "book",
  },
  [URL.HIRAKATA]: {
    login: "히라가나/카타카나 표",
    logout: "예시 회화 문장",
    icon: "book",
  },
  [URL.LOGIN]: {
    login: "로그인",
    logout: "예시 회화 문장",
    icon: "book",
  },
  [URL.QUIZ]: {
    login: "퀴즈",
    logout: "예시 회화 문장",
    icon: "book",
  },
  [URL.ACCUMULATE]: {
    login: "문장 추가하기",
    logout: "예시 회화 문장",
    icon: "book",
  },
};
