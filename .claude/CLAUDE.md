# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## 프로젝트 개요

minimoku 는 개인용 **멀티 서비스 웹앱**이다. 하나의 Next.js 앱 안에 독립된 서비스들이 라우트 그룹으로
나뉘어 있고, 홈(`/`)에서 서비스를 골라 들어간다 (`src/shared/constants/menu.ts`).

| 서비스 | 경로 | 상태 | 설명 |
|---|---|---|---|
| **LinkLocker** | `/link` | 운영 중 | 브라우저 북마크 대체. 폴더별 링크 저장, 이미지 미리보기(Cloudflare Images), 읽음·즐겨찾기·알림 표시, 태그·검색, 폴더 정렬(dnd-kit) |
| **PigMoney** | `/pigmoney` | 운영 중 | 가계부. 수입/지출 기록, 카테고리, 월·주 시작일 설정, 달력 뷰, 월별 보고서(recharts). 기획·구현 문서는 `docs/pigmoney/` |
| **텔레그램 Todo 봇** | `/api/telegram/webhook/[token]` | 운영 중 | 텔레그램 명령(`/todo`, `/list`, `/done`, `/delete`)으로 Todo 등록, Lambda 가 매분 알림 발송 |
| jpStudy | `/japanese/*` | **비활성** | 일본어 회화 암기노트 (초기 서비스). 홈 메뉴에서 주석 처리됨. 코드·`Phrase` 모델은 남아 있음 |

### ⚠️ 실서비스 운영 중 — 작업 전 반드시 숙지

- 프로덕션: **https://www.minimoku.net** (AWS Amplify 호스팅)
- **`.env` / `.env.development` / `.env.production` 의 `DATABASE_URL` 이 셋 다 동일한 Supabase 프로덕션 DB
  를 가리킨다.** 이건 **의도적 구성**이다 (Supabase 무료 티어 1개, 테스트 계정과 실사용 계정이 달라 데이터가
  섞이지 않는다는 판단). 즉 `npm run dev` 도 실데이터를 읽고 쓴다.
- 따라서 `prisma migrate reset`, `prisma db push --force-reset`, 대량 삭제/수정 스크립트, 시드 실행 등
  **DB 를 바꾸는 명령은 프로덕션에 그대로 반영**된다. 실행 전 반드시 사용자에게 확인받을 것.
- 게스트 계정은 모든 방문자가 공유하는 실계정이다 (아래 "게스트 모드").

## 명령어

```bash
npm run dev          # 개발 서버 (localhost:3000) — ⚠️ 프로덕션 DB 사용
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint
npm run seed:guest   # 게스트 User 1행 upsert (idempotent). 게스트 로그인이 동작하려면 1회 필요
```

Lambda 패키징 (각 디렉터리에서):

```bash
cd lambda/telegram-notifier && npm run package   # → telegram-notifier.zip
cd lambda/guest-reset && npm run package         # → guest-reset.zip (Prisma CLI·불필요 엔진 제거해 용량 축소)
```

## 기술 스택

- **Framework**: Next.js 15 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york) + Radix UI, `next-themes` 다크모드, `lucide-react` 아이콘
- **State**: Zustand 5
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Supabase) via Prisma 6
- **Auth**: NextAuth 4 (GitHub · Google · Kakao OAuth + 게스트 Credentials)
- **기타**: recharts(PigMoney 차트), react-day-picker v9(달력), @dnd-kit(폴더 정렬), sonner(토스트), date-fns

## 아키텍처

### 디렉터리 (FSD 변형)

```
src/
├── app/                        # Next.js App Router
│   ├── (api)/api/              # auth/[...nextauth], links, folders, cash-records, categories,
│   │                           # telegram/webhook/[token]
│   ├── (auth)/login/           # 소셜 로그인 페이지
│   ├── (link)/link/            # LinkLocker  (/link, /link/[id])
│   ├── (pigmoney)/pigmoney/    # PigMoney    (/pigmoney, /calendar, /report, /settings)
│   ├── (japanese)/japanese/    # jpStudy(비활성) (/japanese, /(menu)/accumulate, /(menu)/phrases,
│   │                           #                 /hirakata, /quiz)
│   └── page.tsx                # 홈: 서비스 메뉴 + 테마 토글
├── features/                   # 기능 단위 비즈니스 로직 (아래 "Feature 구조")
├── entities/                   # 도메인 타입 (filter, folder, link, pigmoney, quiz, user)
├── widgets/                    # 레이아웃 레벨 컴포넌트 (sidebar, pigmoney/*, guest/GuestBanner, auth/*, menu, theme)
└── shared/
    ├── components/atoms/       # shadcn/ui 컴포넌트 (button, dialog, select, calendar …) — ⚠️ "함정 1" 참고
    ├── components/molecules/   # 조합 컴포넌트 (FormInput, FormSelect, Nav, SubHeader, buttons/*)
    ├── lib/                    # auth.ts(authOptions), db.ts(Prisma), utils/*, hooks/*, telegram/*
    ├── constants/ hooks/ providers/ services/ store/ types/
    ├── utils/fetchAPI.ts       # 자체 API 호출 래퍼
    └── home/                   # Typography, DashBoard (레거시 위치)
```

### Feature 구조 — 두 패턴 혼재

**현행 패턴** (link, folder, navigation, pigmoney, telegram). **새 feature 는 이걸 따른다.**

```
features/{feature}/
├── model/
│   ├── hooks/       # 커스텀 훅
│   ├── schema/      # Zod 유효성 검사 스키마
│   ├── services/    # 서버 액션 (*.service.ts, 파일 첫 줄 "use server")
│   ├── store/       # Zustand 스토어
│   └── utils/       # (pigmoney 만)
└── ui/              # "use client" 컴포넌트
```

**레거시 패턴** (accumulate, phrases — jpStudy): `components/organisms|templates/` + `services/`.
손댈 일이 있으면 그대로 두고, 새로 만들 땐 현행 패턴을 쓴다.

## 데이터 접근 패턴 (중요)

조회와 변경의 경로가 다르다. 관련 코드는 `features/link/model/services/links.service.ts` 의
`getLinks` / `postLink` 를 참고.

- **조회 (GET)**: 서버 액션 → `fetchAPI()` (`shared/utils/fetchAPI.ts`) → **자체 API route**
  (`/api/links` 등) 를 `NEXT_PUBLIC_BASE_URL` 기준 절대 URL 로 호출. 이때 `next.tags` 로 캐시 태그를 붙인다.
- **변경 (POST/PUT/DELETE)**: 서버 액션이 Prisma(`db`) 로 직접 DB 조작 후 `revalidateTag()` 로 해당
  사용자·API 의 캐시를 무효화.
- **캐시 태그**: `getTags(userId, api)` (`shared/lib/utils/commonUtils.ts`) → `"${userId}^${api}"`.
  구분자와 API 이름은 `shared/constants/api.ts` 의 `APIConstants`.

```ts
// 조회
const res = await fetchAPI<LinkInterface[]>(
  `/api/${APIConstants.API_LINKS}${getQueryString({...params, userId: user.id!})}`,
  {method: "GET", revalidate: 10, next: {tags: [getTags(user.id!, APIConstants.API_LINKS)]}}
);
// 변경 후
revalidateTag(getTags(user.id!, APIConstants.API_LINKS));
```

## 인증

- 설정: `shared/lib/auth.ts` 의 `authOptions` (NextAuth 4, JWT 세션 7일)
- 프로바이더: GitHub · Google · Kakao OAuth + **Credentials (게스트, id = `"guest"`)**
- 첫 OAuth 로그인 시 `jwt` 콜백에서 `User` 생성 + "기본" 폴더 자동 생성
- **세션 사용자 조회: `getSessionUser()` — `shared/lib/utils/authUtils.ts`** (`@/shared/lib/auth` 아님)
  → `{id, username, provider, provider_id, avatar, isGuest}` 또는 `null`.
  서버 액션 첫 줄에서 호출해 `null` 이면 throw 하는 것이 관례.
- 미들웨어 (`src/middleware.ts`): `/link`, `/pigmoney`, `/accumulate`, `/quiz` (하위 포함) 미인증 시 `/login`
  으로 리다이렉트.

## 게스트 모드 (정책 A)

로그인 없이 체험 가능. **모든 게스트가 DB 의 단일 `User` 1행을 공유**하고, 매일 04:00 KST 에 종속 데이터가
초기화된다 (User 행 자체는 보존).

| 구성 요소 | 위치 |
|---|---|
| 식별 상수 `GUEST_PROVIDER = "guest"`, `isGuestProvider()` | `shared/lib/utils/guestUtils.ts` (next-auth 의존 없음 → 클라이언트에서도 import 가능) |
| CredentialsProvider (`authorize` 가 시드된 User 를 조회, 없으면 로그인 거부) | `shared/lib/auth.ts` |
| 시드 (upsert + 기본 폴더 생성) | `prisma/seed-guest.ts` → `npm run seed:guest` |
| 일일 초기화 Lambda — EventBridge `cron(0 19 * * ? *)` (UTC 19:00 = KST 04:00) | `lambda/guest-reset/index.ts` |
| 진입점: 홈 메뉴 "로그인 없이 이용하기" → `signIn(GUEST_PROVIDER)` | `widgets/menu/MenuItem.tsx` |
| 안내 배너 (link · pigmoney 레이아웃에 포함) | `widgets/guest/GuestBanner.tsx` |
| 이미지 업로드 차단 (`user.isGuest` 면 업로드 URL 발급 거부) | `shared/services/cloudflare.service.ts` `getUploadUrl` |

**⚠️ `"guest"` 문자열은 `guestUtils.ts` · `prisma/seed-guest.ts` · `lambda/guest-reset/index.ts` 세 곳에 각각
하드코딩돼 있다.** seed 스크립트와 Lambda 는 `@/` 별칭을 쓸 수 없어 공유가 불가능하다 — 하나를 바꾸면 셋 다
바꿀 것.

## 이미지 업로드 (LinkLocker)

Cloudflare Images direct upload 방식.

1. 클라이언트 `useUploadImage` (`shared/hooks`) 가 서버 액션 `getUploadUrl()` 호출 → Cloudflare 가 1회용
   `uploadURL` 과 `id` 발급
2. 클라이언트가 그 `uploadURL` 로 직접 `POST` 업로드
3. `Link.imageUrl` 에 `imagedelivery.net/.../{id}` 저장. 링크 삭제·교체 시 `deleteImage(id)` 호출

관련 env: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_KEY`, `CLOUDFLARE_ACCOUNT_HASH`, `CLOUDFLARE_IMAGE_URL`.
`next.config.mjs` 의 `images.domains` 에 `imagedelivery.net` 과 각 OAuth 아바타 도메인이 등록돼 있다.

## 텔레그램 Todo 봇

- Webhook: `POST /api/telegram/webhook/[token]` — URL 의 `token` 이 `TELEGRAM_WEBHOOK_SECRET` 과 같아야 하고,
  `chat.id` 가 `TELEGRAM_ALLOWED_CHAT_ID` 여야 처리 (개인용 단일 chat)
- 명령 파서·발송·상수: `shared/lib/telegram/{parser,bot,constants}.ts`
  서비스: `features/telegram/model/services/telegramTodo.service.ts`, 모델: `TelegramTodo`
- 알림 발송: `lambda/telegram-notifier` — EventBridge 가 매분 트리거, Prisma 로 DB 직접 조회 후 Bot API 로 발송.
  기본 알림 시각 18:10 KST (`TELEGRAM.DEFAULT_TIME`)
- `TELEGRAM_*` env 는 `.env.production` 에만 있다 (`.env.development` 엔 없음)

## 데이터베이스

- Prisma 6 + Supabase PostgreSQL (`aws-0-ap-northeast-2` pooler). 클라이언트 싱글턴: `shared/lib/db.ts`
  (default export `db`)
- 모델 (`prisma/schema.prisma`):
  - LinkLocker: `User`, `Folder`, `Link`
  - PigMoney: `Category`, `CashRecord`, `PigMoneySettings`, enum `CashRecordType`
  - 텔레그램: `TelegramTodo`
  - jpStudy: `Phrase`
- `binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]` — Lambda 용 리눅스 엔진 포함
- 마이그레이션: `prisma/migrations/` (2025-05 ~ 2026-02, 5개). 스키마 변경 시 `prisma migrate dev` 로 마이그레이션
  파일을 남길 것. **프로덕션 DB 와 동일 인스턴스이므로 실행 전 사용자 확인 필수.**

## 배포 / 운영

| 항목 | 내용 |
|---|---|
| 호스팅 | **AWS Amplify** — 프로덕션 `https://www.minimoku.net`. **GitHub `main` push → 자동 빌드·배포** (PR 머지 = 배포). 빌드 설정은 레포 루트 **`amplify.yml`** (PR #26 로 이관, 콘솔 설정보다 우선), 환경변수 값은 Amplify 콘솔에만 존재하고 빌드 시 `env | grep` 으로 `.env` 에 기록됨. **`amplify.yml` 에 값을 적지 말 것.** Vercel 아님 (Vercel Cron 등 호스팅 종속 기능 사용 불가). 무료 서비스가 아니라 **종량제** — 크레딧 기간이 2026-08 로 끝나 **2026-09 부터 실제 청구 중** (월 $0.3~0.5 + VAT 수준, 75% 가 SSR compute 시간. `docs/hosting-and-deployment.md` §3.5) |
| DB | Supabase PostgreSQL (dev/prod 동일 인스턴스 — 위 경고 참고) |
| 이미지 | Cloudflare Images (`imagedelivery.net`) |
| 백그라운드 작업 | **AWS Lambda + EventBridge** (리전 `ap-northeast-2`). `lambda/telegram-notifier` → 함수 `telegram-todo-notifier` (EventBridge Scheduler `telegram-todo-every-minute`, `rate(1 minutes)`), `lambda/guest-reset` → 함수 `minimoku-guest-reset` (EventBridge 규칙 `minimoku-guest-reset-daily`, `cron(0 19 * * ? *)` = 04:00 KST). 새 cron 작업도 같은 패턴으로 추가 |
| Lambda 런타임 | 두 함수 모두 **Node.js 22.x** (OpenSSL 3.0.x 엔진 필요, 커밋 `eb47368`). 메모리 256MB / 128MB, 타임아웃 30초 |
| AWS CLI | 로컬 프로필 **`minimoku`** (`--profile minimoku`). IAM 사용자 `claude-code`, 읽기 + `lambda:UpdateFunctionCode` 만 허용. Amplify appId `d30vlh60k6bid7` |

### 배포 절차

| 대상 | 방법 |
|---|---|
| Next.js 앱 | `main` 에 push/머지하면 Amplify 가 자동 빌드·배포. 별도 조작 없음 |
| Lambda | 현재 **수동**: `npm run package` 로 zip 생성 → AWS 콘솔에서 업로드 (함수명은 위 표). CLI 로는 `aws lambda update-function-code --function-name <함수명> --zip-file fileb://<zip> --region ap-northeast-2 --profile minimoku`. **`prisma/schema.prisma` 를 바꾸면 두 Lambda 모두 재패키징·재업로드**해야 한다 (생성된 Prisma Client 가 zip 에 포함되므로) |
| DB 마이그레이션 | 동일 DB 구성이므로 로컬에서 `prisma migrate dev` 를 실행하는 것이 곧 프로덕션 적용. 실행 전 사용자 확인 |
| 텔레그램 webhook | Telegram 측에 `setWebhook` 으로 **1회 등록 완료** (URL: `https://www.minimoku.net/api/telegram/webhook/<TELEGRAM_WEBHOOK_SECRET>`, 2026-09-14 `getWebhookInfo` 로 확인). Amplify 재배포와 무관하게 유지되며, 도메인이나 `TELEGRAM_WEBHOOK_SECRET` 이 바뀔 때만 재등록. 상태 확인: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"` (토큰은 `.env.production`, 출력에 노출하지 말 것) |

### Lambda 빌드 규약

1. 루트 `prisma/schema.prisma` 를 `lambda/<job>/prisma/` 로 복사 (이 사본은 gitignore)
2. `prisma generate` → `tsc` → `dist/`
3. `dist` + `node_modules` + `prisma` 를 zip
- gitignore: `lambda/*/dist/`, `lambda/*/*.zip`, `lambda/*/package-lock.json`, `lambda/*/prisma/schema.prisma`
- 참고: `lambda/guest-reset/package.json` 의 `package` 스크립트 (clean → 재설치 → build → prune-cli /
  prune-engines → zip). 새 Lambda 는 이 스크립트를 복제하는 것이 가장 빠르다.

### 환경변수

| 키 | 용도 |
|---|---|
| `DATABASE_URL` | Supabase (3개 env 파일 모두 동일) |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | NextAuth |
| `NEXT_PUBLIC_BASE_URL` | `fetchAPI` 가 자체 API 호출 시 base (dev: localhost, prod: www.minimoku.net) |
| `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `KAKAO_CLIENT_ID/SECRET` | OAuth |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_KEY`, `CLOUDFLARE_ACCOUNT_HASH`, `CLOUDFLARE_IMAGE_URL` | Cloudflare Images |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ALLOWED_CHAT_ID` | 텔레그램 봇 (production 전용) |

`.env*` 는 모두 gitignore. Next 규칙대로 `dev` 는 `.env.development` + `.env`, `build`/`start` 는
`.env.production` + `.env` 를 읽는다.

## 알려진 함정 / 기술 부채

1. **shadcn alias 불일치** — `components.json` 의 aliases 는 `@/components/ui`, `@/lib/utils` 를 가리키지만
   실제 컴포넌트는 `src/shared/components/atoms/`, `cn` 은 `shared/lib/utils/commonUtils.ts` 에 있다.
   `npx shadcn add` 를 그대로 돌리면 엉뚱한 경로에 생성되고 import 도 깨진다 → 기존 `atoms/` 파일을 참고해
   수동 작성하거나, 생성 후 옮기고 import 를 고칠 것.
2. **GET API 라우트에 인증 없음** — `/api/links`, `/api/folders`, `/api/cash-records`, `/api/categories` 는
   `?userId=` 쿼리만 믿고 조회한다. 서버 액션 경유 시엔 세션의 userId 가 들어가지만 라우트 자체는 열려 있다
   (수정 예정).
3. **미들웨어 matcher 와 실제 경로 불일치** — `/accumulate`, `/quiz` 를 보호하지만 실제 라우트는
   `/japanese/accumulate`, `/japanese/quiz`. jpStudy 가 비활성이라 방치 중.
4. **feature 구조 2종 혼재** — 위 "Feature 구조" 참고.
5. **`shared/lib/utils/` 에 index 없음** — `@/shared/lib/utils` 로는 import 불가. 파일명까지 적을 것:
   `.../utils/commonUtils`(cn, getTags, getQueryString), `.../utils/authUtils`(getSessionUser),
   `.../utils/dateUtils`, `.../utils/guestUtils`.
6. `shared/constants/url.ts` 의 `URL`·`URL_TITLE_MAP` 은 jpStudy 시절 경로 위주 (낡음).
7. **Amplify 콘솔 buildSpec 에 비밀값이 하드코딩돼 있었음** — 환경변수 17개 값을 `echo "KEY=값" >> .env` 로
   직접 적던 것을 PR #26 에서 레포 `amplify.yml`(이름 참조)로 대체하고 콘솔 buildSpec 도 같은 내용으로 교체 완료
   (2026-09-15). 과거 빌드 로그 #1~#26 에 남은 값의 로테이션은 **보류로 결정** (접근자 본인뿐) — 재검토 조건은
   `docs/hosting-and-deployment.md` §3.6. **콘솔 buildSpec 을 출력하거나 파일로
   저장할 때는 반드시 값 마스킹 후 처리할 것.** 새 환경변수를 추가하면 콘솔 등록 + `amplify.yml` 허용 목록 두 곳 모두
   갱신해야 한다 (guard 가 누락을 잡아 빌드를 실패시킴).

## 코드 스타일

- Prettier (`.prettierrc`): 100자, 2칸, 쌍따옴표, trailing comma es5, **`bracketSpacing: false`**
  (`import {cn} from …`), `bracketSameLine: true`, `prettier-plugin-tailwindcss` 로 클래스 정렬
- ESLint (`.eslintrc.json`, legacy 포맷): next/core-web-vitals + next/typescript.
  `no-unused-vars`, `no-explicit-any`, `react-hooks/exhaustive-deps` 는 경고
- 경로 별칭: `@/*` → `./src/*`
- 주석과 UI 텍스트는 한글로 작성. 주요 로직마다 간단한 주석을 달아 가독성 좋게

## 개발 플로우

### 문제 해결 접근법

- 라이브러리 컴포넌트 수정 전, 공식 문서에서 지원하는 prop/옵션을 먼저 확인할 것
- 특히 shadcn/ui(Radix UI 기반) 컴포넌트는 대부분의 동작을 제어하는 prop 을 이미 제공함

### 응답 규칙

- 이해하기 쉽도록 가급적 한글로 답변할 것

## 참고 문서

- `docs/hosting-and-deployment.md` — 호스팅 구조·요금·대안 비교·EC2 부담·운영 로드맵. **호스팅은 Amplify 현행
  유지로 결정(2026-09-15)** — 이전 제안 전에 이 문서를 먼저 볼 것
- `docs/pigmoney/` — `README.md`(개요·URL), `data-model.md`, `features.md`(기획), `implementation.md`(구현 상세)
- `docs/review.md` — 링크 수정 기능 코드 리뷰 기록 (2026-02)
- `docs/url.md` — 초기 URL 설계 메모 (낡음)
- `.claude/skills/commit-guide/` — 커밋 분리·메시지 작성 가이드 (프로젝트 스킬)
