// 샘플 문장 데이터 (비로그인 시 볼 수 있는 예시)
export const SAMPLE_PHRASES = [
  {
    id: 1,
    japanese: "はい！いいですよ",
    romaji: "hai! ii desu yo",
    pronunciation: "하이! 이이 데스 요",
    translation: "하이(네) / 이이(좋다) / 데스 요(좋아요)",
    createdAt: 1744934400000,
  },
  {
    id: 2,
    japanese: "おはようございます",
    romaji: "ohayou gozaimasu",
    pronunciation: "오하요 고자이마스",
    translation: "안녕하세요 (아침인사)",
    createdAt: 1745020800000,
  },
  {
    id: 3,
    japanese: "ありがとうございます",
    romaji: "arigatou gozaimasu",
    pronunciation: "아리가토 고자이마스",
    translation: "감사합니다",
    createdAt: 1745107200000,
  },
  {
    id: 4,
    japanese: "すみません",
    romaji: "sumimasen",
    pronunciation: "스미마센",
    translation: "실례합니다/죄송합니다",
    createdAt: 1745193600000,
  },
];

// 유저 문장 데이터 (로그인 시 볼 수 있는 데이터)
export const USER_PHRASES_EXAMPLE = [
  ...SAMPLE_PHRASES,
  {
    id: 5,
    japanese: "元気ですか？",
    romaji: "genki desuka?",
    pronunciation: "겐키 데스카?",
    translation: "잘 지내세요?/기분이 좋으세요?",
    createdAt: 1745193600000,
  },
  {
    id: 6,
    japanese: "お名前は何ですか",
    romaji: "onamae wa nan desuka",
    pronunciation: "오나마에 와 난 데스카",
    translation: "이름이 뭐예요?",
    createdAt: 1745193600000,
  },
];
