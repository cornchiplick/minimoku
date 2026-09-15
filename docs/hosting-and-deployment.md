# Hosting & Deployment Notes

> 작성일: 2026-09-15
> 배경: CLAUDE.md 검증 세션(2026-09-14 ~ 15)에서 새로 확인된 운영·배포 사실, 호스팅 구조 이해, 대안 검토,
> 그리고 결정 사항을 기록한다. 개발 규칙 자체는 `.claude/CLAUDE.md` 가 정본이고, 이 문서는 그 뒤에 있는
> "왜 그런가"와 "무엇을 검토했나"를 남기는 용도다.

---

## 1. 결정 사항

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-15 | **호스팅은 AWS Amplify Hosting 현행 유지** | 부딪힌 제약은 cron 하나였고 Lambda + EventBridge 로 이미 해결. 개인 규모·저트래픽에서 비용과 수고가 모두 합리적. 서버(OS 패치·TLS·프로세스) 운영 부담을 지고 싶지 않음 |
| 2026-09-15 | Lambda 배포 자동화는 추후 진행 (§6 A안 → B안) | 현재는 수동 zip 업로드. AWS CLI 는 준비됨 |
| 2026-09-15 | 과거 빌드 로그에 남은 비밀값에 대한 **로테이션 보류** | 로그 열람 가능자가 계정 접근자뿐. 재검토 조건은 §3.6 |
| 2026-09-14 | dev/prod 가 같은 Supabase DB 를 쓰는 것은 **의도적 구성** | 무료 티어 1개, 테스트 계정과 실사용 계정이 달라 데이터가 섞이지 않는다는 판단 |

---

## 2. 이번 세션에서 확인된 사실

### 2.1 운영 환경

- 프로덕션 `https://www.minimoku.net` — GitHub `main` push → Amplify 자동 빌드·배포. 레포에 `amplify.yml`
  없음(빌드 설정·환경변수는 Amplify 콘솔 관리).
- `.env` / `.env.development` / `.env.production` 의 `DATABASE_URL` 은 셋 다 동일 (해시 비교로 확인).
  `NEXTAUTH_URL`, `NEXT_PUBLIC_BASE_URL` 만 dev 는 localhost, prod 는 www.minimoku.net.
- `TELEGRAM_*` 환경변수는 `.env.production` 에만 있음.
- 텔레그램 봇 webhook 은 `https://www.minimoku.net/api/telegram/webhook/<SECRET>` 로 **등록 완료 상태**
  (2026-09-14 `getWebhookInfo` 로 확인, pending 0건). Amplify 재배포와 무관하게 유지되며 도메인이나
  `TELEGRAM_WEBHOOK_SECRET` 변경 시에만 재등록.
- AWS CLI 는 2026-09-15 설치·설정 완료: IAM 사용자 `claude-code` + 정책 `MinimokuClaudeOps`, 로컬 프로필
  `minimoku` (`--profile minimoku` / `AWS_PROFILE=minimoku`). Claude 가 Amplify·Lambda·청구를 직접 조회 가능.
- `gh` CLI 는 `cornchiplick` 으로 로그인됨 → GitHub Actions·시크릿 등록은 Claude 가 수행 가능.
- Lambda 두 개(`telegram-notifier`, `guest-reset`)는 `npm run package` 로 zip 을 만들어 **콘솔에서 수동 업로드**
  해 왔음. 함수 이름·리전은 미기재.

### 2.2 CLAUDE.md 감사 결과 (2026-09-14)

기존 CLAUDE.md 는 "LinkLocker 단일 서비스 + AWS/Lambda" 시점 기준이었고, 마지막 갱신(`15c3a45`) 이후 7커밋
(게스트 로그인 전체)이 미반영이었다. 주요 불일치:

- 틀림 (8건): 프로젝트 개요(링크 앱 → 멀티 서비스), `getSessionUser()` 경로, `cn()` 경로, Prisma 모델 목록
  (4개 → 9개), Auth 프로바이더(게스트 누락), feature 구조(2종 혼재 미언급), API 목록, 라우트 그룹 목록
- 누락 (7건): 게스트 모드 전체, 텔레그램 봇, 조회/변경 이원화된 데이터 접근 패턴, shadcn 컴포넌트 위치와
  `components.json` alias 불일치, `docs/`, 환경변수 목록, 이미지 업로드 흐름
- 부수 발견 (2건, 코드 문제): 미들웨어 matcher 가 `/accumulate`·`/quiz` 를 보호하나 실제 경로는
  `/japanese/...`; GET API 4개(`links`, `folders`, `cash-records`, `categories`)가 세션 검증 없이 `?userId=`
  만으로 조회 (별도 작업으로 분리)

→ CLAUDE.md 전면 개정, README.md 정정 (2026-09-14).

---

## 3. Amplify Hosting 이해

### 3.1 "Amplify" 는 두 가지

- **Amplify Hosting** — Git 레포 연결 → 빌드·배포·CDN·도메인·TLS 를 해주는 호스팅. **minimoku 가 쓰는 것.**
- **Amplify 프레임워크(Gen 2 backend)** — 인증·DB·스토리지 백엔드를 코드로 생성하는 도구. **사용 안 함**
  (NextAuth + Prisma + Supabase 로 직접 구성).

### 3.2 `main` push 후 일어나는 일

1. 빌드 컨테이너에서 빌드 실행 (`amplify.yml` 없으면 콘솔 설정/자동 감지 기본값).
2. `.next` 산출물을 **정적 파일 / 서버 코드(Compute) / 이미지 최적화** 로 나눠 배포 매니페스트 생성.
   문서 예시 기준 라우팅: `/*.*` → 정적(없으면 compute fallback), `/*` → compute, `/_amplify/image` → 이미지.
   `computeResources: {runtime: "nodejs22.x", entrypoint: "index.js"}` 형태의 서버리스 Node 런타임.
3. 정적 파일은 CDN(CloudFront), 서버 코드는 **Amplify Hosting compute**(Amplify 관리형 서버리스)로 배포.
   Next.js 12~15 의 SSR·API route·middleware·ISR·app 디렉터리·이미지 최적화 지원 (공식 문서 명시).
4. 도메인·TLS(ACM) 자동, 브랜치별 환경, PR 미리보기.

minimoku 에서: 서버 액션·`/api/*`·`middleware.ts`·NextAuth → compute, `_next/static/*` → CDN.
플랫폼 타입은 `WEB_COMPUTE`(SSR) 여야 함. compute 리소스는 Amplify 관리형이라 내 계정의 Lambda/CloudFront
목록에 별도로 보이지 않는다 (CLI 접근 후 `lambda list-functions` 로 검증 가능 — 미검증).

### 3.3 커스텀 가능 / 불가

**가능** (공식 문서 확인):

| 항목 | 방법 |
|---|---|
| 빌드 명령·Node 버전(`nvm use 22`)·캐시·브랜치 분기 | `amplify.yml` |
| 환경변수 (앱/브랜치 단위) | 콘솔 또는 CLI `update-app` |
| 커스텀 헤더, 리다이렉트/리라이트 | 콘솔 또는 `customHeaders` / `customRules` |
| 스테이징 Basic Auth, 브랜치 자동 빌드, PR 프리뷰 | 콘솔 |
| 빌드 환경 | 커스텀 빌드 이미지(ECR Public), 빌드 인스턴스 메모리(`NODE_OPTIONS`) |
| SSR 코드에 IAM 역할 부여 | `computeRoleArn` |

**불가 / 서버리스 성격상 제약**:

- 런타임 서버 없음 → SSH·상주 프로세스·OS 패키지 설치 불가 → **cron·큐 워커·WebSocket 서버 불가**
  (그래서 Lambda + EventBridge 를 별도로 둔 것)
- 요청 단위 실행 → 콜드스타트, 실행 시간·요청/응답 크기 상한 (정확한 수치 미확인)
- 서버 배포 산출물 크기 제한: 문서상 50MB (Next.js 11 항목에 기재 — 현행 compute 에도 동일한지 미확인)
- CDN·compute 인프라 직접 조작 불가 (Amplify 가 제공하는 설정을 통해서만)
- 빌드 파이프라인이 Amplify 고정 → 테스트 게이트·승인·타 산출물(Lambda zip) 배포는 GitHub Actions 등 별도
- DB 커넥션 풀 없음 → `DATABASE_URL` 이 Supabase **pooler** 주소인 것이 맞는 구성

### 3.4 요금 구조 (2026-09-15, aws.amazon.com/amplify/pricing 확인)

Amplify Hosting 은 **무료 서비스가 아니라 종량제**이며, "무료 구간(Free Tier)"이 별도로 있다.

| 항목 | 단가 | 무료 구간 (월) |
|---|---|---|
| 빌드 (Standard 인스턴스) | $0.01 / 분 | 1,000 분 |
| 저장 (CDN) | $0.023 / GB·월 | 5 GB |
| 전송 (data transfer out) | $0.15 / GB | 15 GB |
| SSR 요청 | $0.30 / 100만 건 | 500,000 건 |
| SSR compute | $0.20 / GB-hour | 100 GB-hours |

무료 구간의 적용 방식은 **계정 생성 시점에 따라 다르다**:

- **2025-07-15 이전 생성 계정**: 위 무료 구간이 "12개월 무료" 형태 (AWS 레거시 Free Tier). 12개월이 지나면
  무료 구간 없이 전액 종량제.
- **2025-07-15 이후 생성 계정**: 크레딧 방식 — 가입 즉시 $100, 활동에 따라 최대 $200. Free plan 은 6개월
  또는 크레딧 소진 시 계정 자동 종료, Paid plan 으로 전환하면 종량제. "30+ 서비스 상시 무료(always free)"
  목록은 양쪽 플랜 모두 유지.

**minimoku 계정이 어느 모델인지, 현재 청구액이 얼마인지는 미확인.** AWS 콘솔 → Billing 에서 확인하거나,
§6.1 의 IAM 정책에 `ce:GetCostAndUsage` 를 추가하면 Claude 가 CLI 로 조회 가능.

참고용 **가정 계산** (실제 청구액 아님): 월 30회 빌드 × 5분 = 150분($1.50) + SSR 요청 10만 건($0.03)
+ compute 2 GB-hours($0.40) + 전송 1 GB($0.15) + 저장 0.5 GB($0.01) ≈ **월 $2 남짓**. 무료 구간 안이면 $0.
즉 무료 구간이 끝나더라도 현재 트래픽 규모에서는 큰 금액이 나오기 어렵다 — 단, 이는 가정이며 실제 사용량을
확인해야 한다.

Lambda 쪽은 별개로, AWS Lambda 는 월 100만 요청·40만 GB-초까지 상시 무료 구간(always free)이 있어
`telegram-notifier` 가 매분 실행(월 약 43,200회)돼도 그 안이다.

### 3.5 무료 구간 조사 결과 (2026-09-15, AWS CLI `--profile minimoku` 로 확인)

**결론: 무료 구간이 아니다. 크레딧 기간이 2026-08 로 끝났고 2026-09 부터 소액이 실제 청구된다.**

| 항목 | 확인 내용 |
|---|---|
| 계정 | `480415624766`, 생성 **2025-08-16** → 2025-07-15 이후 = **크레딧 모델**. `freetier get-account-plan-state` 결과: **PAID / ACTIVE / 잔여 크레딧 $0.00** (2026-09-15 확인) |
| 크레딧 적용 | 2025-09 ~ 2026-08 매일 사용액 전액 상쇄 (13개월 누적 약 $3.5). **2026-09-01 부터 크레딧 적용 0** — 일 단위로 8/31 까지 붙다가 9/1 에 끊김. 누적 $3.5 ≪ $100 이므로 소진이 아니라 **만료** |
| 현재 청구 | 9/1~9/14 사용 $0.20 + 세금(VAT 10%) $0.02 = **$0.22 진행 중**. 최근 12개월 월 사용액 $0.10~0.47 → 앞으로 **월 $0.3~0.5 + 세금** 수준 예상 (사용량 기준 추정) |
| Amplify 프리티어 | `freetier get-free-tier-usage` 에 Amplify 항목 **없음**. 즉 이 계정에서 Amplify 는 첫 달부터 종량 과금이었고 크레딧이 가려 왔던 것 |
| Amplify 비용 구성 (13개월 누적 $3.70) | SSR compute duration **$2.79** (50,247 GB-초 ≈ 14 GB-h, 75%) · 빌드 $0.61 (60.7분, 26회) · 전송 $0.23 (1.5 GB) · 요청 $0.07 (231k 건) · 저장 $0.001 |
| 상시 무료 항목 | Lambda 요청 19.5k/1M, Lambda 259/400k GB-초, EventBridge 19.5k/14M, CloudWatch 로그·지표 — 모두 한도의 0.2% 미만 (9/1~14 기준) |

시사점: 비용의 75% 가 SSR compute 시간이다. 서버 액션이 `fetchAPI` 로 자체 API route 를 다시 호출하는 구조는
한 요청을 두 번의 SSR 요청으로 만들기 때문에 compute 와 요청 수에 그대로 얹힌다 (금액은 미미하지만 구조상 그렇다).

### 3.6 확인된 인프라 (2026-09-15)

| 리소스 | 값 |
|---|---|
| Amplify 앱 | `minimoku`, appId `d30vlh60k6bid7`, 리전 `ap-northeast-2`, 플랫폼 `WEB_COMPUTE`, 기본 도메인 `d30vlh60k6bid7.amplifyapp.com`, 생성 2025-08-24 |
| 브랜치 | `main` (stage PRODUCTION, autoBuild ON, framework "Next.js - SSR"). 빌드 26회, 최근 배포 2026-05-06, 빌드당 약 4분 |
| 빌드 설정 | 콘솔 저장 buildSpec: `npm ci` → **환경변수 17개를 `echo "KEY=값" >> .env` 로 하드코딩** → `prisma generate` → `next build`. 캐시 `.next/cache`, `.npm` |
| 환경변수 | 앱 단위 17개 (`.env.production` 과 동일 키 구성) |
| Lambda | `minimoku-guest-reset` (nodejs22.x, 256MB, 30s) · `telegram-todo-notifier` (nodejs22.x, 128MB, 30s) — 모두 `ap-northeast-2` |
| 트리거 | EventBridge 규칙 `minimoku-guest-reset-daily` = `cron(0 19 * * ? *)` · EventBridge **Scheduler** `telegram-todo-every-minute` = `rate(1 minutes)` (Asia/Seoul) |

**⚠️ buildSpec 에 비밀값이 하드코딩된 문제 → 조치 진행 중 (2026-09-15)**: Amplify 환경변수에도 같은 17개가
등록돼 있는데 buildSpec 이 값을 다시 직접 적고 있었다. `amplify:GetApp` 권한만 있으면 전부 읽히고, Amplify 빌드
로그에도 실행 명령이 그대로 남는다.

조치 순서:
1. ✅ 레포 루트 `amplify.yml` 추가 — `env | grep -E '^(허용 목록 17개)=' >> .env` 로 콘솔 환경변수에서만 가져오고,
   누락 시 빌드를 실패시키는 guard 포함. 로컬 모의 실행 3종(정상·누락·특수문자) 검증. **PR #26** 머지 (2026-09-15 11:30)
2. ✅ 빌드 #27 SUCCEED (3분 51초). 로그에 새 spec 명령만 있고 옛 echo 명령·환경변수 값 없음. 런타임 검증:
   `/api/auth/providers` 4개 로드, `/api/categories?userId=0` → 200 (DB 연결 정상)
3. ✅ 콘솔 buildSpec 을 `amplify.yml` 과 동일 내용으로 교체 (11:42). 콘솔 spec 에 환경변수 값 없음 확인
4. ⏸ **비밀값 로테이션 — 보류 (2026-09-15 결정)**. 과거 빌드 로그 #1~#26 에 이전 명령(값 포함)이 남아 있으나,
   그 로그는 이 AWS 계정에 로그인 가능한 사람(본인 + `claude-code` IAM 사용자)만 볼 수 있고 외부 공개된 적 없음.
   계정이 뚫린 경우엔 어차피 콘솔 환경변수로 현재 값이 보이므로 옛 로그 유무는 차이 없음.
   **재검토 조건**: ① 로그가 외부로 나갔다고 의심될 때(스크린샷·계정 공유 등) ② AWS 계정 침해 의심 시.
   그때 로테이션 대상: NEXTAUTH_SECRET(재로그인 유발), CLOUDFLARE_API_KEY, GitHub/Google/Kakao client secret,
   TELEGRAM_BOT_TOKEN + TELEGRAM_WEBHOOK_SECRET(webhook 재등록 필요), DB 비밀번호(`DATABASE_URL` → Amplify 와
   Lambda 2개 환경변수 모두 갱신).

이후 규칙: 새 환경변수는 **콘솔 등록 + `amplify.yml` 허용 목록** 두 곳을 함께 갱신한다.

---

## 4. 대안 비교 (검토 기록)

minimoku(Next.js SSR + Prisma + cron Lambda) 기준. **S3 + CloudFront 는 정적 export 전용이라 이 앱엔 불가**
(서버 액션·API route·NextAuth·middleware 가 서버 실행 필요).

| 방식 | 자유도 | 운영 부담 | 개인 규모 비용 | 적합성 |
|---|---|---|---|---|
| **Amplify Hosting** (현행) | 낮음 | 거의 없음 | 낮음 | ✅ 채택 유지 |
| S3 + CloudFront | 낮음(정적) | 없음 | 매우 낮음 | ❌ SSR 불가 |
| OpenNext + SST / CDK | 높음(서버리스) | 중 (IaC) | 낮음 | ✅ Amplify 와 같은 구조를 내 계정에 직접 소유 |
| App Runner | 중 (Dockerfile) | 낮음 | 중 | ✅ "Amplify 다음 단계". 컨테이너로 `next start`, HTTPS·스케일 자동 |
| ECS Fargate + ALB | 높음 | 중~높 | 중 | △ 개인 규모엔 과함 |
| EC2 / Lightsail | 최고 (VM) | 높음 | 낮음 | ✅ 인프라 학습용. §5 부담 참고 |
| Elastic Beanstalk | 중~높 | 중 | 중 | △ 예전 세대 PaaS |
| Vercel | 낮음(Next 특화) | 없음 | 무료~ | ✅ 단 AWS 이탈 |
| Fly.io / Railway / Render | 중 (컨테이너) | 낮음 | 낮음 | ✅ |
| VPS + Coolify / Dokploy | 최고 | 중 | 매우 낮음 | ✅ 셀프호스팅 PaaS |

자유도가 올라갈수록 내가 책임지는 목록이 늘어난다: TLS·도메인, 환경변수 주입, 빌드 파이프라인, 로그, 스케일링,
`next/image` 최적화, 무중단 배포. 앱 코드(Prisma·NextAuth·`fetchAPI` 자기호출)는 어느 쪽이든 그대로 간다.

---

## 5. EC2 로 갔을 때의 운영 부담 (검토 기록)

EC2 = AWS 가 빌려주는 리눅스 컴퓨터 한 대. "루틴 작업"보다 **"그 서버의 모든 일을 책임지는 사람이 나 한 명"**
이라는 점이 본질이다.

| 일 | Amplify | EC2 에서 하는 일 | 1회 자동화 후 남는 것 |
|---|---|---|---|
| OS 보안 패치 | AWS 가 처리 | `apt upgrade` 등 직접 | `unattended-upgrades`. 커널 업데이트 후 가끔 재부팅 |
| TLS(HTTPS) 인증서 | ACM 자동 발급·갱신 | Let's Encrypt (90일 만료) | certbot 타이머 또는 **Caddy**(자동). 실패하면 경고 화면 |
| 앱 프로세스 | 요청마다 실행 | `next start` 가 죽거나 재부팅되면 중단 | systemd / pm2 자동 재시작 |
| 배포 | push 하면 끝 | 접속 → pull → build → 재시작 | GitHub Actions + SSH. 작은 인스턴스는 빌드 중 OOM 흔함 |
| 장애 감지 | AWS 가 유지 | 아무도 안 알려줌 | UptimeRobot 등 외부 감시 + 알림 |
| 로그·디스크 | 콘솔 | 파일로 쌓임 → 디스크 풀 장애 | `logrotate` |
| 방화벽·SSH 키 | 해당 없음 | 보안 그룹, 22번 포트, 키 보관 | 1회 설정. 키 분실 시 접속 불가 |
| Node/OS 메이저 업그레이드 | 설정 한 줄 | 직접 설치·검증 | 연 1회 수동 |
| 서버 자체가 죽으면 | AWS 문제 | 새 인스턴스에 재세팅 | 세팅 스크립트 사전 준비 |

체감 비용(경험칙 추정): 초기 세팅에 주말 하나, 자동화 후 월 1~2회 점검, 그리고 **장애 시 원인을 스스로 읽어낼
수 있어야 함**(`journalctl`, `df -h`, 인증서 만료 등). Amplify 요금에는 이 모든 걸 AWS 가 대신 신경 쓰는 값이
포함돼 있다.

만약 나중에 실습하고 싶다면: 운영 중인 www.minimoku.net 은 그대로 두고, 별도 인스턴스에 사본을
`ec2.minimoku.net` 같은 서브도메인으로 올려 한 달 굴려 본 뒤 판단. 서버 관리 없이 자유도만 원하면
컨테이너형 PaaS(App Runner 등)가 §5 의 부담 대부분을 대신한다.

---

## 6. 남은 작업 / 로드맵

### 6.1 AWS CLI 읽기 접근 — ✅ 완료 (2026-09-15). 아래는 재설정 시 절차 기록

2026-09-15 추가 권한 (정책 `MinimokuClaudeOps` 편집): `freetier:GetAccountPlanState`(플랜·크레딧 잔액 조회),
`amplify:UpdateApp`(콘솔 buildSpec 교체용). 아래 JSON 은 추가 후 기준.

1. AWS 콘솔 → IAM → 사용자 생성 (예: `claude-code`, 콘솔 액세스 없음)
2. 아래 정책을 JSON 으로 생성(예: `MinimokuClaudeOps`)해 사용자에 연결. 인프라 읽기 + 청구·프리티어 읽기,
   쓰기는 `lambda:UpdateFunctionCode` 하나만.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "MinimokuInfraRead",
      "Effect": "Allow",
      "Action": [
        "amplify:Get*", "amplify:List*",
        "lambda:Get*", "lambda:List*",
        "events:Describe*", "events:List*",
        "scheduler:Get*", "scheduler:List*",
        "logs:Describe*", "logs:Get*", "logs:FilterLogEvents", "logs:StartQuery", "logs:StopQuery"
      ],
      "Resource": "*"
    },
    {
      "Sid": "BillingAndFreeTierRead",
      "Effect": "Allow",
      "Action": [
        "freetier:GetFreeTierUsage", "freetier:GetAccountPlanState",
        "ce:GetCostAndUsage", "ce:GetCostForecast", "ce:GetDimensionValues",
        "budgets:ViewBudget",
        "account:GetAccountInformation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "AmplifyBuildSpecUpdate",
      "Effect": "Allow",
      "Action": ["amplify:UpdateApp"],
      "Resource": "arn:aws:amplify:ap-northeast-2:480415624766:apps/d30vlh60k6bid7"
    },
    {
      "Sid": "DeployLambda",
      "Effect": "Allow",
      "Action": ["lambda:UpdateFunctionCode"],
      "Resource": "arn:aws:lambda:*:*:function:*"
    }
  ]
}
```

3. 사용자 → 보안 자격 증명 → 액세스 키 생성 (CLI 용도)
4. 로컬: `brew install awscli` 후 **본인 터미널에서** `aws configure --profile minimoku` (키 입력은 직접).
   프로필을 `minimoku` 로 분리하는 이유: 회사 AWS 키와 섞이지 않게.
5. 이후 Claude 는 `--profile minimoku` 로 `aws amplify list-apps`, `get-app`(플랫폼·빌드 설정·환경변수),
   `lambda list-functions`, CloudWatch 로그 조회 수행. **Amplify 환경변수(시크릿 포함)가 Claude 에게 보이게 됨**
   — 키는 `~/.aws/credentials` 에만 두고 레포에 넣지 않는다.

접근 후 첫 작업 — **무료 구간 조사** (✅ 완료, 결과는 §3.5 · 인프라는 §3.6):

1. `aws account get-account-information` → 계정 생성일 → 레거시 12개월 모델 / 2025-07-15 이후 크레딧 모델 판정
2. `aws freetier get-free-tier-usage` → 프리티어 항목별 이번 달 사용량 · 한도 · 유형("12 Months Free" /
   "Always Free"). Amplify 빌드 분·전송·SSR 요청·compute, Lambda 요청 등이 여기 나옴
3. `aws ce get-cost-and-usage` → 최근 월별 청구액과 서비스별 내역 (Cost Explorer 는 콘솔에서 한 번 열어
   활성화돼 있어야 하며, 최초 활성화 후 데이터 반영까지 최대 24시간)
4. `aws amplify list-apps` / `get-app` / `list-jobs` → 플랫폼(`WEB_COMPUTE`), 빌드 횟수·소요 시간, 환경변수
5. `aws lambda list-functions` → 함수명·리전·런타임 → CLAUDE.md 기재

다음 작업: buildSpec 의 하드코딩된 비밀값을 이름 참조로 바꾸고 `amplify.yml` 로 레포에 가져오기 (§3.6 경고).

참고: Billing 콘솔의 "IAM 사용자 및 역할의 결제 정보 액세스 활성화" 설정은 **콘솔 페이지 접근에만 적용**되고
Cost Explorer·Budgets **API 에는 적용되지 않는다** (공식 문서 명시). CLI 조사에는 불필요.

### 6.2 Lambda 배포 자동화

- **A안 — 로컬 원커맨드** (6.1 완료 즉시 가능): 각 Lambda `package.json` 에
  `"deploy": "npm run package && aws lambda update-function-code --function-name <함수명> --zip-file fileb://<zip> --profile minimoku"`
  추가. 이후 "guest-reset 배포해" 한마디로 끝.
- **B안 — GitHub Actions**: `main` push 중 `lambda/guest-reset/**`, `lambda/telegram-notifier/**`,
  **`prisma/schema.prisma`** 변경 시 자동 package → `update-function-code`. `schema.prisma` 를 트리거에 넣는
  이유: zip 에 생성된 Prisma Client 가 포함되므로 스키마 변경 시 두 Lambda 모두 재배포 필요 (수동 흐름에서
  잊기 쉬움). 자격증명은 GitHub OIDC 로 IAM 역할 신뢰(권장, 키 저장 없음) 또는 `gh secret set` 으로 액세스 키
  등록(간단). `lambda/*/package-lock.json` 이 gitignore 라 워크플로에선 `npm ci` 가 아닌 `npm install`.

### 6.3 코드 정리 (CLAUDE.md "알려진 함정" 참조)

- GET API 4개에 세션 인증 추가 — 별도 작업 칩으로 분리됨 (2026-09-14)
- 미들웨어 matcher `/accumulate`·`/quiz` → 실제 경로 `/japanese/...` 불일치 (jpStudy 비활성이라 방치 중)
- `components.json` alias 를 실제 경로(`src/shared/components/atoms`, `shared/lib/utils/commonUtils`)에
  맞추거나, shadcn 추가 시 수동 이동을 규칙으로 유지
