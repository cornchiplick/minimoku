// 카드 작성 폼 입력 타입
export interface CardInputs {
  japanese: string; // 일본어 원문
  romaji: string; // 로마자 표기
  pronunciation: string; // 한글 발음
  translation: string; // 한국어 의미
}

// 카드 검색 폼 입력 타입
export interface SearchInputs {
  keyword: string; // 검색어
}

// 카드 조회 타입
export interface Phrase {
  id: number;
  japanese: string;
  romaji: string;
  pronunciation: string;
  translation: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string | null;
}
