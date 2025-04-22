// 샘플 문장 데이터 (비로그인 시 볼 수 있는 예시)
export const SAMPLE_PHRASES = [
  {
    id: 1,
    japanese: "はい！いいですよ",
    romaji: "hai! ii desu yo",
    korean: "하이! 이이 데스 요",
    meaning: "하이(네) / 이이(좋다) / 데스 요(좋아요)",
    createdAt: "2025-04-18",
  },
  {
    id: 2,
    japanese: "おはようございます",
    romaji: "ohayou gozaimasu",
    korean: "오하요 고자이마스",
    meaning: "안녕하세요 (아침인사)",
    createdAt: "2025-04-19",
  },
  {
    id: 3,
    japanese: "ありがとうございます",
    romaji: "arigatou gozaimasu",
    korean: "아리가토 고자이마스",
    meaning: "감사합니다",
    createdAt: "2025-04-20",
  },
  {
    id: 4,
    japanese: "すみません",
    romaji: "sumimasen",
    korean: "스미마센",
    meaning: "실례합니다/죄송합니다",
    createdAt: "2025-04-21",
  },
];

// 유저 문장 데이터 (로그인 시 볼 수 있는 데이터)
export const USER_PHRASES_EXAMPLE = [
  ...SAMPLE_PHRASES,
  {
    id: 5,
    japanese: "元気ですか？",
    romaji: "genki desuka?",
    korean: "겐키 데스카?",
    meaning: "잘 지내세요?/기분이 좋으세요?",
    createdAt: "2025-04-21",
  },
  {
    id: 6,
    japanese: "お名前は何ですか",
    romaji: "onamae wa nan desuka",
    korean: "오나마에 와 난 데스카",
    meaning: "이름이 뭐예요?",
    createdAt: "2025-04-21",
  },
];
