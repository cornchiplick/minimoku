# PigMoney - 가계부 서비스

## 개요

PigMoney는 minimoku의 두 번째 서비스로, 수입과 지출을 간편하게 기록하고 관리할 수 있는 가계부 앱입니다.

## 핵심 기능

- **수입/지출 기록**: 다중 행 입력으로 여러 건의 거래를 한번에 등록
- **조회**: 지출/수입 탭 전환으로 조회, 날짜 구간 검색
- **카테고리 관리**: 사용자별 카테고리 추가/수정/삭제
- **거래 수정/삭제**: 기록된 거래의 수정 및 삭제
- **사용자 설정**: 월 시작일/주 시작 요일 커스텀 설정
- **사이드바 요약**: 이달의 가계, 이주의 가계 실시간 표시 (설정 반영)
- **보고서**: 월별 카테고리 분석 (요약 카드 + 도넛 차트 + 상세 테이블)
- **달력**: 일별 수입/지출 달력 뷰, 날짜 클릭 시 상세 내역

## 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style)
- **State**: Zustand 5
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Supabase) via Prisma 6
- **Auth**: NextAuth 4 (GitHub, Google, Kakao OAuth)
- **Charts**: recharts (PieChart 도넛 차트)
- **Calendar**: react-day-picker v9 (DayButton 커스터마이즈)

## URL

| 경로 | 설명 |
|------|------|
| `/pigmoney` | 메인 쓰기 페이지 |
| `/pigmoney/report` | 보고서 페이지 |
| `/pigmoney/calendar` | 달력 페이지 |
| `/pigmoney/settings` | 설정 페이지 |
| `/api/cash-records` | 거래 API |
| `/api/categories` | 카테고리 API |

## 관련 문서

- [기능 상세 기획](./features.md)
- [데이터 모델](./data-model.md)
- [구현 상세](./implementation.md)

## 구현 히스토리

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 1 | DB 스키마, 타입, 서버 액션, 스토어, UI 컴포넌트, 메인 쓰기 페이지 | 완료 |
| Phase 1.5 | 사이드바 + 헤더 + 테이블 UI 디자인 (네이버 가계부 참고, mockdata) | 완료 |
| Phase 2 | 설정/보고서/달력 기능 구현, 사이드바 실데이터 연결 | 완료 |
| Phase 3 | 태그 기능 (DB 스키마 변경 필요) | 미정 |
