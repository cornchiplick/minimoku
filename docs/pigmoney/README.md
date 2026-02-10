# PigMoney - 가계부 서비스

## 개요

PigMoney는 minimoku의 두 번째 서비스로, 수입과 지출을 간편하게 기록하고 관리할 수 있는 가계부 앱입니다.

## 핵심 기능

- **수입/지출 기록**: 다중 행 입력으로 여러 건의 거래를 한번에 등록
- **조회**: 수입/지출을 좌우 분할(PC) 또는 탭 전환(모바일)으로 조회
- **날짜 구간 검색**: 특정 기간 또는 전체 기간 조회
- **카테고리 관리**: 사용자별 카테고리 추가/수정/삭제
- **통계**: 조회 구간에 대한 총 수입/지출/잔액 표시 (추후 원형 그래프 확장 예정)
- **거래 수정/삭제**: 기록된 거래의 수정 및 삭제

## 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style)
- **State**: Zustand 5
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Supabase) via Prisma 6
- **Auth**: NextAuth 4 (GitHub, Google, Kakao OAuth)

## URL

- 메인 페이지: `/pigmoney`
- API: `/api/cash-records`, `/api/categories`

## 관련 문서

- [기능 상세 기획](./features.md)
- [데이터 모델](./data-model.md)
- [구현 계획](./implementation.md)
