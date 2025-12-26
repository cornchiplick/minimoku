# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## 프로젝트 개요

minimoku는 브라우저 북마크와 차별화된 링크 관리 앱으로, 이미지 미리보기와 읽음 처리 등의 기능을
제공합니다.

## 명령어

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint validation
```

## 아키텍처

### Feature-Scoped Domain (FSD) Structure

```
src/
├── app/                    # Next.js App Router 페이지 & API 라우트
│   ├── (api)/api/         # API 엔드포인트 (auth, folders, links)
│   └── (link)/            # 링크 관리 라우트
├── features/              # 기능별 비즈니스 로직 (model + ui per feature)
├── entities/              # 도메인 모델 및 타입
├── widgets/               # 레이아웃 레벨 컴포넌트
└── shared/                # 공유 유틸리티, 컴포넌트, 스토어, 훅
```

### Feature Structure Pattern

Each feature in `features/` follows this structure:

```
features/{feature}/
├── model/
│   ├── hooks/       # 커스텀 훅
│   ├── schema/      # Zod 유효성 검사 스키마
│   ├── services/    # 서버 액션 (*.service.ts)
│   └── store/       # Zustand 스토어
└── ui/              # UI 컴포넌트
```

## 기술 스택

- **Framework**: Next.js 15 with App Router, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style) + Radix UI
- **State**: Zustand 5
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Supabase) via Prisma 6
- **Auth**: NextAuth 4 (GitHub, Google, Kakao OAuth)

## 주요 패턴

### 서버/클라이언트 분리

- 서비스는 `"use server"`로 데이터베이스 작업 처리
- UI 컴포넌트는 `"use client"`로 인터랙티브 기능 처리

### 서비스 레이어

- 서버 액션 위치: `features/*/model/services/*.service.ts`
- 인증 확인: `getSessionUser()` (`@/shared/lib/auth`)
- 캐시 무효화: `revalidateTag()` 및 `getTags()` 유틸리티

### 데이터베이스 접근

- Prisma Client 싱글턴: `src/shared/lib/db.ts`
- 모델: User, Phrase, Link, Folder

### 유틸리티

- `cn()` - 클래스명 유틸리티 (clsx + tailwind-merge), `@/shared/lib/utils`
- 경로 별칭: `@/*` → `./src/*`

### 보호된 라우트

미들웨어 보호 대상: `/link/*`, `/accumulate/*`, `/quiz/*`

## 코드 스타일

- Prettier: 100자 너비, 2칸 들여쓰기, 쌍따옴표, trailing comma (es5)
- ESLint: next/core-web-vitals + TypeScript 규칙 (unused-vars, no-explicit-any는 경고)
- 주석과 UI 텍스트는 한글로 작성

## 개발 플로우

### FSD (Feature-Sliced Design) 아키텍처

### 코드 작성 규칙

- 주요 로직마다 간단한 주석을 달아서 가독성 좋게 작성할 것

### 응답 규칙

- 이해하기 쉽도록 가급적 한글로 답변할 것.
