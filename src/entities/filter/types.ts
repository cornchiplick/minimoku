// 서버 컴포넌트에서 클라이언트로 전달 가능하도록 iconName을 문자열로 정의
export type FilterIconName = "Star" | "Bell";

export interface FilterInterface {
  id: string;
  name: string;
  iconName: FilterIconName;
  count: number;
}
