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

Lambda (각 디렉터리에서, AWS 프로필 `minimoku` 자동 사용):

```bash
npm run package    # zip 생성 (재설치 → prisma generate → tsc → prune → zip)
npm run deploy     # package + 검사 + 업로드 (+ telegram-notifier 는 실행 검증까지)
npm run upload     # 이미 만든 zip 만 검사·업로드
npm run rollback   # 직전 배포 코드(.previous.zip)로 되돌리기
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
│   ├── (api)/api/              # auth/[...nextauth], telegram/webhook/[token]
│   │                           # (데이터 조회용 route 는 없다 — 서버 액션이 직접 처리)
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
    └── home/                   # Typography, DashBoard (레거시 위치)
```

### Feature 구조

모든 feature 가 아래 패턴을 따른다 (link, folder, navigation, pigmoney, telegram).

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

## 데이터 접근 패턴 (중요)

**조회·변경 모두 서버 액션이 Prisma 로 직접 처리한다.** 자체 API route 를 거치지 않는다.
관련 코드는 `features/link/model/services/links.service.ts` 의 `getLinks` / `postLink` 를 참고.

```ts
export async function getLinks(parameters: {params?: Record<string, ...>} = {}) {
  const user = await getSessionUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  // userId 는 반드시 세션에서만 가져온다 — 외부 입력(쿼리 파라미터)으로 받지 않는다
  return db.link.findMany({where: {folder: {userId: user.id}, ...}});
}
```

**지켜야 할 규칙**

- **`userId` 는 `getSessionUser()` 로만 얻는다.** 클라이언트가 보낸 값으로 조회 범위를 정하지 않는다.
- 조회 함수 첫 줄에서 세션을 확인하고 없으면 throw 한다.
- 단건 조회도 소유권 조건을 where 에 넣는다 (`getLink` 의 `folder: {userId: user.id}`, `getFolder` 의 `userId`).
- **변경 후 별도 캐시 무효화가 필요 없다.** 조회가 캐시를 타지 않으므로 다음 조회는 항상 최신이다.
  클라이언트는 변경 후 같은 서버 액션을 다시 호출해 상태를 갱신한다 (`CategoryManageModal` 참고).

**왜 이 구조인가** (2026-10-20 변경, 커밋 참조)

이전에는 서버 액션이 `fetchAPI()` 로 자기 자신의 `/api/*` route 를 다시 호출하고 `next.tags` 로 캐시했다. 문제는:
① 그 route 들이 `?userId=` 쿼리만 믿어 **로그인 없이 타인 데이터가 조회됐다**, ② 요청 한 번에 HTTP 왕복이
한 번 더 생겨 SSR compute 시간을 먹었다 (Amplify 요금의 75%), ③ JSON 직렬화 때문에 `Date` 가 문자열로
와서 선언된 타입(`Date`)과 런타임이 달랐다. 직접 조회로 바꾸면서 셋 다 해소됐다.
`shared/utils/fetchAPI.ts`, `shared/constants/api.ts`, `getTags`, `getQueryString` 은 함께 제거됐다.

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
| 호스팅 | **AWS Amplify** — 프로덕션 `https://www.minimoku.net`. **GitHub `main` push → 자동 빌드·배포** (PR 머지 = 배포). 빌드 설정은 레포 루트 **`amplify.yml`** (PR #26 로 이관, 콘솔 설정보다 우선), 환경변수 값은 Amplify 콘솔에만 존재하고 빌드 시 `env | grep` 으로 `.env` 에 기록됨. **`amplify.yml` 에 값을 적지 말 것.** Vercel 아님 (Vercel Cron 등 호스팅 종속 기능 사용 불가). 무료 서비스가 아니라 **종량제** — 크레딧 기간이 2026-08 로 끝나 **2026-09 부터 실제 청구 중** — 실측 2026-09 $0.73, 2026-10 $0.66 (세금 포함), 대부분 SSR compute 시간. `docs/hosting-and-deployment.md` §3.5 |
| DB | Supabase PostgreSQL (dev/prod 동일 인스턴스 — 위 경고 참고) |
| 이미지 | Cloudflare Images (`imagedelivery.net`) |
| 백그라운드 작업 | **AWS Lambda + EventBridge** (리전 `ap-northeast-2`). `lambda/telegram-notifier` → 함수 `telegram-todo-notifier` (EventBridge Scheduler `telegram-todo-every-minute`, `rate(1 minutes)`), `lambda/guest-reset` → 함수 `minimoku-guest-reset` (EventBridge 규칙 `minimoku-guest-reset-daily`, `cron(0 19 * * ? *)` = 04:00 KST). 새 cron 작업도 같은 패턴으로 추가 |
| Lambda 런타임 | 두 함수 모두 **Node.js 22.x** (OpenSSL 3.0.x 엔진 필요, 커밋 `eb47368`). 메모리 256MB / 128MB, 타임아웃 30초 |
| AWS CLI | 로컬 프로필 **`minimoku`** (`--profile minimoku`). IAM 사용자 `claude-code` — 인프라·청구·IAM 읽기 + `lambda:UpdateFunctionCode` + `amplify:UpdateApp` 만 허용 (정책 `MinimokuClaudeOps` v3). Amplify appId `d30vlh60k6bid7` |
| CI 배포 자격증명 | GitHub OIDC. 공급자 `token.actions.githubusercontent.com`(대상 `sts.amazonaws.com`) + 역할 `minimoku-github-lambda-deploy`(신뢰 조건 `repo:cornchiplick/minimoku:ref:refs/heads/main`) + 정책 `MinimokuLambdaDeploy`(두 함수 코드 교체 + 로그 읽기). **레포에 AWS 키 없음.** 2026-10-20 검증 완료 |

### 배포 절차

| 대상 | 방법 |
|---|---|
| Next.js 앱 | `main` 에 push/머지하면 Amplify 가 자동 빌드·배포. 별도 조작 없음 |
| Lambda | **자동**: `main` push 중 `lambda/**`·`prisma/schema.prisma`·워크플로 파일이 바뀌면 GitHub Actions `Deploy Lambda` (`.github/workflows/deploy-lambda.yml`) 가 바뀐 함수만 `npm run deploy` 로 배포 (OIDC 역할 `minimoku-github-lambda-deploy`, 레포 변수 `AWS_DEPLOY_ROLE_ARN`). 수동 재배포는 Actions 탭 "Run workflow" 또는 로컬 `npm run deploy`. **2026-10-20 CI 전 구간 검증 완료** (run `39349846387`). 아래 "Lambda 배포 규칙" 필독 |
| DB 마이그레이션 | 동일 DB 구성이므로 로컬에서 `prisma migrate dev` 를 실행하는 것이 곧 프로덕션 적용. 실행 전 사용자 확인 |
| 텔레그램 webhook | Telegram 측에 `setWebhook` 으로 **1회 등록 완료** (URL: `https://www.minimoku.net/api/telegram/webhook/<TELEGRAM_WEBHOOK_SECRET>`, 2026-09-14 `getWebhookInfo` 로 확인). Amplify 재배포와 무관하게 유지되며, 도메인이나 `TELEGRAM_WEBHOOK_SECRET` 이 바뀔 때만 재등록. 상태 확인: `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"` (토큰은 `.env.production`, 출력에 노출하지 말 것) |

### Lambda 빌드 규약

1. 루트 `prisma/schema.prisma` 를 `lambda/<job>/prisma/` 로 복사 (이 사본은 gitignore)
2. `prisma generate` → `tsc` → `dist/`
3. `dist` + `node_modules` + `prisma` 를 zip
- gitignore: `lambda/*/dist/`, `lambda/*/*.zip`, `lambda/*/package-lock.json`, `lambda/*/prisma/schema.prisma`
- 참고: `lambda/guest-reset/package.json` 의 `package` 스크립트 (clean → 재설치 → build → prune-cli /
  prune-engines → zip). 새 Lambda 는 이 스크립트를 복제하는 것이 가장 빠르다.

### Lambda 배포 규칙 (`lambda/deploy.sh` 가 강제)

- 배포 = `update-function-code` 한 번. 아래 검사 중 하나라도 실패하면 **업로드 자체를 하지 않는다** (기존 코드 유지).
  1. zip **50 MB 초과 → 중단** (API/콘솔 직접 업로드 한도). 45 MB 부터 경고. 현재 두 함수 모두 34.6 MB
  2. 압축 해제 **250 MB 초과 → 중단** (하드 리밋). 현재 93 MB
  3. 함수 설정의 `Handler` 에서 유도한 파일(`index.js` / `dist/index.js`)이 zip 에 없으면 중단 — **두 함수의 zip 구조가 다르다**:
     guest-reset 은 `index.js` 가 루트, telegram-notifier 는 `dist/` 가 루트 (`Handler=dist/index.handler`). `package` 스크립트가 이 구조를 만든다
  4. `libquery_engine-rhel-openssl-3.0.x` 엔진이 없으면 중단 (Node 22 런타임 필수). darwin/windows/1.0.x 엔진이 남아 있으면 경고(용량)
- 업로드 전 현재 코드를 `.previous.zip` 으로 백업 → 문제 시 `npm run rollback`. 업로드 후 `LastUpdateStatus=Successful` 과 SHA256 일치를 확인
- telegram-notifier 는 배포 후 `lambda/verify.sh` 가 다음 1분 실행의 새 로그 스트림을 기다려 오류를 판정한다. guest-reset 은 하루 1회라
  즉시 검증 불가 → 다음날 04:00 KST 로그 확인
- **`prisma/schema.prisma` 변경 = 두 Lambda 모두 재배포** (Prisma Client 가 zip 에 포함). CI 는 이를 자동 감지한다
- **50 MB 를 넘게 되면** 순서대로: ① `prune-cli`/`prune-engines` 대상 추가 → ② S3 경유 업로드(`--s3-bucket`, 버킷·권한 필요, 압축 해제 250 MB 까지)
  → ③ `node_modules` 를 Lambda Layer 로 분리 → ④ 컨테이너 이미지(10 GB). 새 의존성을 추가할 때 zip 크기를 먼저 확인할 것
- 배포는 코드만 바꾼다. 메모리·타임아웃·환경변수·트리거는 Lambda 설정이며 별도 권한(`UpdateFunctionConfiguration`)이 필요해 콘솔에서 직접 변경
- CI 는 `concurrency: deploy-lambda` 로 직렬화된다. 실패한 CI 는 함수에 영향 없음(업로드 전 중단이거나, 업로드 후 검증 실패 시 `.previous.zip` 은 러너에만 남으므로
  **CI 에서의 롤백 = 코드를 `git revert` 해 push** 하거나 로컬에서 `npm run rollback`)

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
2. ~~**GET API 라우트에 인증 없음**~~ → **해결 (2026-10-20)**. 네 라우트를 삭제하고 서버 액션이 Prisma 로
   직접 조회하도록 바꿨다. 같은 종류의 문제였던 `getLink` 단건 조회(소유권 미검증)도 함께 고쳤다.
   새 조회 기능을 만들 때 **데이터 조회용 public route 를 다시 만들지 말 것** — 위 "데이터 접근 패턴" 규칙을 따른다.
3. ~~**미들웨어 matcher 와 실제 경로 불일치**~~ → 해결 (2026-10-20, jpStudy 제거와 함께).
4. ~~**feature 구조 2종 혼재**~~ → 해결 (2026-10-20, 레거시 구조였던 jpStudy feature 제거).
5. **`shared/lib/utils/` 에 index 없음** — `@/shared/lib/utils` 로는 import 불가. 파일명까지 적을 것:
   `.../utils/commonUtils`(cn, getTags, getQueryString), `.../utils/authUtils`(getSessionUser),
   `.../utils/dateUtils`, `.../utils/guestUtils`.
6. ~~`shared/constants/url.ts` 가 낡음~~ → 해결 (2026-10-20, 실사용 3개만 남김).
7. **Amplify 콘솔 buildSpec 에 비밀값이 하드코딩돼 있었음** — 환경변수 17개 값을 `echo "KEY=값" >> .env` 로
   직접 적던 것을 PR #26 에서 레포 `amplify.yml`(이름 참조)로 대체하고 콘솔 buildSpec 도 같은 내용으로 교체 완료
   (2026-09-15). 과거 빌드 로그 #1~#26 에 남은 값의 로테이션은 **보류로 결정** (접근자 본인뿐) — 재검토 조건은
   `docs/hosting-and-deployment.md` §3.6. **콘솔 buildSpec 을 출력하거나 파일로
   저장할 때는 반드시 값 마스킹 후 처리할 것.** 새 환경변수를 추가하면 콘솔 등록 + `amplify.yml` 허용 목록 두 곳 모두
   갱신해야 한다 (guard 가 누락을 잡아 빌드를 실패시킴).

## 디자인 토큰 (`src/app/globals.css`)

**색은 팔레트에서 한 번만 정의하고, 토큰 이름은 매핑만 한다.** 하드코딩 금지.

```
:root / :root.dark   팔레트 — 개념당 값 하나 (--bg-1, --fg-2, --brand, --line, --pig-* …)
@theme inline        토큰 이름 → 팔레트 매핑 (프로젝트 토큰 + shadcn 표준 토큰 두 벌)
@theme               모드와 무관한 스케일 (글꼴·타이포·radius·ease·animate)
```

- **토큰을 추가할 때**: 팔레트(라이트/다크) + `@theme inline` 매핑 한 줄. 값을 세 곳에 복사하지 않는다.
- `@theme inline` 이어야 하는 이유: 값을 인라인하지 않고 `var()` 참조로 내보내야 다크모드 전환이 런타임에 먹는다.
- **다크모드는 `@custom-variant dark (&:where(.dark, .dark *))`** 로 클래스 기준이다.
  이 선언이 없으면 Tailwind 4 의 `dark:` 는 OS 설정(`prefers-color-scheme`)을 따라가 앱 토글과 어긋난다.
- 두 토큰 계열은 같은 팔레트를 가리킨다: 프로젝트 토큰(`bg-background-primary`, `text-minimoku-neutral-bold` …)과
  shadcn 표준 토큰(`bg-background`, `text-muted-foreground` …). 앱 코드는 전자, `components/atoms` 의
  shadcn 컴포넌트는 후자를 쓴다.
- **대비(contrast)**: 본문 텍스트는 WCAG AA 4.5:1 을 기준으로 한다. `--fg-3`(라이트)과 `--fg-2`(다크)는
  이 기준을 맞추려고 조정한 값이므로 임의로 밝히지 말 것.
- 사용 가능한 스케일: `text-display`/`text-hero`/`text-title`(행간·자간 포함), `rounded-card`/`rounded-panel`,
  `shadow-card`/`shadow-float`(모드별 세기 자동), `ease-out-smooth`/`ease-in-out-smooth`,
  `animate-fade-in`/`animate-fade-in-up`.
- `prefers-reduced-motion` 사용자에게는 전역으로 애니메이션을 끈다 (globals.css 하단).
- **한글 웹폰트는 아직 미정이다.** 현재는 OS 기본 한글 글꼴로 렌더링된다 (`--font-sans`).

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

- `docs/frontend-portfolio-review.md` — **프런트엔드 포트폴리오 관점 진단 (2026-10-20)**. 이 프로젝트의
  궁극적 목적은 취업용 포트폴리오이며 지원 분야는 **프런트엔드**다. 반응형 부재·홈 화면·스택 노후도의
  실측 근거와 권장 작업 순서가 정리돼 있다. UI·구조 관련 제안 전에 이 문서를 먼저 볼 것
- `docs/hosting-and-deployment.md` — 호스팅 구조·요금·대안 비교·EC2 부담·운영 로드맵. **호스팅은 Amplify 현행
  유지로 결정(2026-09-15)** — 이전 제안 전에 이 문서를 먼저 볼 것
- `docs/pigmoney/` — `README.md`(개요·URL), `data-model.md`, `features.md`(기획), `implementation.md`(구현 상세)
- `docs/review.md` — 링크 수정 기능 코드 리뷰 기록 (2026-02)
- `docs/url.md` — 초기 URL 설계 메모 (낡음)
- `.claude/skills/commit-guide/` — 커밋 분리·메시지 작성 가이드 (프로젝트 스킬)
