# 프런트엔드 포트폴리오 관점 진단

> 작성일: 2026-10-20
> 전제: 지원 분야 **프런트엔드** (풀스택 차선, 백엔드 아님)
> 방법: 로컬 개발 서버를 게스트 계정으로 직접 조작하며 데스크톱(1440px)·모바일(375px) 화면 확인,
> 의존성은 npm registry 실조회, 코드 수치는 grep 집계. 추정이 아닌 확인된 값만 적는다.

---

## 0. 한 줄 결론

**기반(디자인 토큰·다크모드·컴포넌트 체계)은 괜찮은데 완성(반응형·첫인상·검증 도구)이 비어 있다.**
현재 상태로는 채용 담당자가 휴대폰으로 링크를 여는 순간 탈락한다. 반대로 말하면, 고쳐야 할 것이
적고 명확하다.

---

## 1. 치명적 — 반응형이 사실상 없다

### 확인된 사실

| 측정 | 값 |
|---|---|
| 반응형 클래스(`sm:`/`md:`/`lg:`)를 쓰는 파일 | 101개 중 **9개** |
| 그중 shadcn/ui 가 기본 제공한 것 (dialog·calendar·input·button·alertDialog) | 5개 |
| **직접 작성한 코드에서 반응형을 쓰는 파일** | **4개** (홈, DashBoard, jpStudy 2개 — jpStudy 는 비활성) |
| 운영 중인 LinkLocker·PigMoney 의 반응형 처리 | **0** |
| 사이드바 폭 | `w-80` (320px) 하드코딩, 브레이크포인트 없음 (`Sidebar.tsx:18`, `PigMoneySidebar.tsx:121`) |

### 375px 에서 실제로 벌어지는 일

- **`/link`** — 사이드바가 320px 를 차지해 본문에 55px 만 남는다. 링크 목록을 볼 수 없다.
- **`/pigmoney`** — 사이드바가 화면 밖으로 넘치고, 본문이 약 70px 로 눌려 **"지출내역이없습니다" 가 한 글자씩 세로로** 쌓인다.
- **`/` (홈)** — `text-8xl` 제목이 좌우로 잘려 나가고, 메뉴 2개의 라벨("LinkLocker"/"PigMoney")과
  버튼 문구가 서로 겹친다.

### 왜 치명적인가

채용 담당자·면접관은 이력서의 링크를 **휴대폰으로 먼저 연다.** 프런트엔드 지원자의 포트폴리오가
모바일에서 깨지면 그 자리에서 평가가 끝난다. 다른 어떤 장점도 이 하나를 상쇄하지 못한다.

### 최소 수정 방향

사이드바 두 개를 `w-80` → `hidden md:flex` + 모바일 드로어(Sheet)로 바꾸고, 본문 그리드에
브레이크포인트를 넣는 것이 전부다. shadcn/ui 에 Sheet 컴포넌트가 있어 새로 만들 것도 없다.
**레이아웃 파일 2개 + 홈 1개, 체감 반나절.** 투자 대비 효과가 이 문서에서 가장 크다.

---

## 2. 치명적 — 첫 화면이 깨져 있다

홈(`src/app/page.tsx`)은 포트폴리오에서 **가장 먼저 보이는 화면**인데 현재:

1. **데스크톱에서 메뉴가 왼쪽에 몰려 있다.** `grid-cols-5 md:grid-cols-10` 에 항목이 2개뿐이라
   `justify-items-center` 가 각 칸 안에서만 가운데 정렬된다. 1440px 화면에서 거대한 제목 아래
   왼쪽 구석에 작은 아이콘 2개가 붙어 있는 모양이 된다.
2. **아이콘이 플레이스홀더다.** `menu.ts` 의 `imageUrl: ""` 라서 서비스마다 똑같은 햄버거(≡) 모양이
   나온다. 서비스 정체성이 전혀 드러나지 않는다.
3. **버튼 문구가 단어 중간에서 줄바꿈된다** ("로그인 없이 이용하 / 기").
4. 제목만 `text-8xl` 로 크고 나머지는 작아서, 위계가 아니라 **크기 사고**처럼 보인다.

### 방향

항목이 2~3개뿐이라면 그리드가 아니라 **카드 2장을 가운데 배치**하는 편이 낫다. 각 서비스에 색·아이콘·
한 줄 설명을 주고, 호버 상태를 넣으면 그것만으로 인상이 달라진다. `lucide-react` 가 이미 있으니
아이콘은 추가 설치 없이 해결된다.

---

## 3. 의외로 괜찮은 것 — 깎지 말 것

진단이 비판 일색이 되면 오판한다. 아래는 현재 상태로 **유지할 가치가 있는 자산**이다.

- **디자인 토큰 체계** (`globals.css`) — 의미 기반 CSS 변수(`--color-background-primary`,
  `--color-pigmoney-income` 등)를 라이트/다크 양쪽에 정의하고 shadcn/ui 표준 변수에 매핑해 뒀다.
  색을 하드코딩하지 않은 구조라 리디자인이 쉽다. 면접에서 설명할 거리가 된다.
- **다크모드** — `next-themes` 로 실제 동작한다.
- **데스크톱 내부 화면** — `/link`, `/pigmoney`, `/pigmoney/report` 는 사이드바·헤더·빈 상태 일러스트
  까지 갖춰 꽤 정돈돼 있다. "투박하다"는 인상의 원인은 내부 화면이 아니라 **홈과 모바일**이다.
- **로그인 화면** — 카드 중앙 정렬에 OAuth 3종 브랜드 컬러까지 깔끔하다 (평범하지만 흠은 없다).
- **빈 상태 처리** — "추가된 링크가 없습니다", "아래 버튼으로 추가해보세요" 등 빈 화면을 방치하지 않았다.
  신입 포트폴리오에서 자주 빠지는 부분이다.

---

## 4. 프런트엔드 직무에서 비어 보일 것들

| 항목 | 현재 | 평가 영향 |
|---|---|---|
| **테스트** | 0개. jest·vitest·testing-library·playwright 모두 없음 | 프런트엔드 채용에서 가장 흔한 감점. 핵심 컴포넌트 몇 개라도 테스트가 있으면 인상이 크게 다르다 |
| **Storybook** | 없음 | 컴포넌트 체계를 "보여줄" 수단이 없다. `shared/components/atoms` 가 이미 정리돼 있어 붙이기 쉬운 편 |
| **접근성** | `eslint-plugin-jsx-a11y` 는 `next/core-web-vitals` 에 포함돼 돌고 있으나 의도적 작업 흔적 없음. 아이콘 버튼 다수가 `aria-label` 없이 비어 있다 (`read_page` 에서 이름 없는 button 다수 확인) | 키보드 탐색·스크린리더는 프런트엔드 면접 단골 질문 |
| **모션** | `tailwindcss-animate` 외 없음 | 필수는 아니지만, 세련됨의 체감 차이가 가장 큰 영역 |
| **성능 지표** | 측정 이력 없음 | Lighthouse 점수 한 번 찍어 README 에 올리는 것만으로도 "신경 쓴 사람"으로 보인다 |
| **큰 컴포넌트** | `PigMoneyMain.tsx` 402줄 | 분리 근거를 설명할 수 있으면 문제없으나, 리뷰어가 먼저 지적할 지점 |

---

## 5. 기술 스택 노후도 (2026-10-20 npm registry 실조회)

| 패키지 | 현재 | 최신 | 판단 |
|---|---|---|---|
| next | 15.4.6 | **16.4.2** | 메이저 1개 뒤. 프런트엔드 지원자에게 Next 버전은 바로 눈에 띈다 — 올리는 게 좋다 |
| typescript | 5.8.3 | **7.0.2** | 메이저 2개 뒤. 다만 7 은 비교적 최근이라 생태계 호환을 확인하고 움직일 것 |
| prisma | 6.7.0 | 8.0.0-rc | RC 단계이므로 **지금 올리지 말 것**. 6 → 7 안정판 확인 후 판단 |
| zod | 3.25.1 | **4.6.7** | 메이저 1개 뒤. 4 는 API 변경이 있어 스키마 수정 필요 |
| eslint | 9.35.0 | 10.13.0 | 메이저 1개 뒤. flat config 로 이미 넘어가 있지 않아(`.eslintrc.json` 레거시 포맷) 함께 정리 대상 |
| react / react-dom | 19.1.1 | 19.3.1 | 마이너 차이. 문제없음 |
| tailwindcss | 4.1.13 | 4.3.3 | 마이너 차이. 문제없음 |
| zustand, next-auth, react-hook-form | — | — | 마이너 차이. 문제없음 |

**해석**: "낡았다"기보다 **1년 가까이 업데이트를 안 한 상태**다. 치명적으로 낡은 스택(예: Pages Router,
CSS-in-JS 레거시, class 컴포넌트)은 하나도 없다. App Router·React 19·Tailwind 4·서버 액션 조합은
2026 년 기준으로도 현행이다. 버전만 끌어올리면 된다.

단, **`.eslintrc.json` 레거시 포맷**은 ESLint 9 기준으로도 구식이다 (flat config 가 표준). 작은 작업이고
"최신 관행을 따른다"는 신호가 되므로 우선순위가 낮지 않다.

---

## 6. 아키텍처 — 프런트엔드 관점에서

### 지적받을 지점

1. **디렉터리 구조 2종 혼재.** `features/{link,folder,navigation,pigmoney,telegram}` 는 `model/ui`,
   `features/{accumulate,phrases}` 는 `components/organisms|templates`. 리뷰어가 "왜 두 가지냐"고
   물으면 답이 "예전 것이 남아서"가 된다. jpStudy 가 비활성이므로 **코드를 지우는 쪽이 가장 깔끔하다.**
2. **비활성 서비스가 코드에 남아 있다.** jpStudy 라우트 5개, `Phrase` 모델, `accumulate`/`phrases` feature,
   `constants/url.ts` 의 낡은 경로 테이블. 포트폴리오는 "잘 정리된 작은 것"이 "방치된 큰 것"을 이긴다.
3. **프런트엔드 깊이를 보여줄 지점이 적다.** 데이터 흐름이 전부 서버 컴포넌트 + 서버 액션이라
   (아키텍처로는 현행이고 좋지만) 클라이언트 상태 관리·낙관적 업데이트·가상 스크롤·폼 UX 같은
   **프런트엔드 역량을 드러낼 코드가 상대적으로 얇다.** Zustand 는 쓰고 있으나 범위가 좁다.

### 반대로 내세울 지점

- 서버 액션에서 Prisma 직접 조회 + 세션에서만 `userId` 취득 (2026-10-20 보안 수정) — **왜 그렇게
  바꿨는지 설명할 수 있는 결정**이다. 면접에서 쓸 수 있는 이야기.
- GitHub Actions → OIDC → Lambda 자동 배포, Amplify 빌드 설정의 비밀값 제거 — 프런트엔드 지원자가
  인프라까지 다뤘다는 건 가산점이지, 감점이 아니다.

---

## 7. 권장 순서

투자 대비 효과 순. 위 두 개만 해도 인상이 바뀐다.

| 순위 | 작업 | 근거 |
|---|---|---|
| 1 | **반응형 대응** (사이드바 2개 드로어화 + 홈) | 깨진 화면을 고치는 것이 먼저. 반나절 규모 |
| 2 | **홈 화면 재설계** (카드형, 아이콘, 호버) | 첫인상. 하루 규모 |
| 3 | **jpStudy 제거** (라우트·feature·모델·상수) | 구조 혼재와 방치 흔적이 한 번에 사라짐 |
| 4 | **의존성 업데이트** (next 16, zod 4, eslint 10 + flat config) | 버전은 바로 보인다. prisma 8 은 RC 라 보류 |
| 5 | **테스트 도입** (vitest + testing-library, 핵심 3~5개) | 0 → 1 의 인상 차이가 가장 큰 항목 |
| 6 | **접근성 1차** (아이콘 버튼 `aria-label`, 키보드 포커스) | 면접 질문 대비 |
| 7 | Storybook, 모션, Lighthouse 측정 | 여력이 있으면 |

---

## 7-1. 디자인 토큰 상세 감사 (2026-10-20 추가)

`src/app/globals.css` 142줄 전수 확인 결과.

### 군더더기

1. **같은 색을 두 벌로 선언한다.** 커스텀 체계와 shadcn 표준 체계가 평행 공존하며 동일 값을 중복 정의:
   `--color-background-primary`(#ffffff) = `--color-background`, `--color-minimoku`(#2b7fff) = `--color-primary`,
   `--color-background-secondary`(#e5e7eb) = `--color-secondary` = `--color-muted` = `--color-accent`.
2. **`@theme` 블록 36줄이 전부 `--color-x: var(--color-x)` 자기참조다.** 토큰 하나를 추가하려면
   `:root` · `:root.dark` · `@theme` 세 곳을 고쳐야 한다. Tailwind 4 의 `@theme inline` 으로 제거 가능.
3. **커스텀 브레이크포인트 4개(`mobile`/`tablet`/`laptop`/`desktop`)가 선언만 되고 사용처 0곳.**
   코드는 전부 Tailwind 기본 `sm:/md:/lg:` 를 쓴다. `tablet` 주석이 "모바일 최소값"으로 복붙돼 있고,
   `desktop: 1513px` 은 표준(1280/1536)과 어긋나는 근거 없는 값.
4. `--color-background-tertiary` 가 라이트에서 primary 와 같은 #ffffff — 의미가 분화되지 않음.
5. `--color-minimoku-neutral`(#a0a0a0)이 라이트/다크 동일 — 다크에서 대비 부족 소지.
6. `.link-card-shadow` 가 커스텀 클래스로 하드코딩 — shadow 토큰으로 옮기면 유틸리티가 된다.

### 실제 버그 — `dark:` 유틸리티가 앱 토글을 따르지 않는다

- `dark:` 유틸리티를 **19곳 / 4개 파일**에서 사용 (`GuestBanner`, `FolderSortModal`, `DialogProvider`, `dropdown`).
- 그런데 `@custom-variant dark` 설정도 `darkMode` 설정도 없다.
- **Tailwind 4 의 `dark:` 는 기본이 `prefers-color-scheme`(OS 설정)** 인데, 앱은 `ThemeProvider` 가
  `html`/`body` 에 `.dark` 클래스를 토글한다. 두 기준이 어긋나 있다.
- 결과: OS 가 라이트인데 앱 토글을 다크로 두면 **그 19곳만 라이트로 남는다.**
- 수정: `globals.css` 에 `@custom-variant dark (&:where(.dark, .dark *));` 추가.

### 빠진 토큰 — "투박함"의 직접 원인

| 없는 것 | 결과 |
|---|---|
| 타이포그래피 스케일 (size/line-height/tracking) | `text-8xl` 같은 임의 값이 박혀 위계가 무너진다 |
| 간격(spacing) 스케일 | 섹션 간 리듬이 없어 성기게 보인다 |
| radius 토큰 | shadcn 이 기대하는 `--radius` 가 없어 모서리가 제각각 |
| elevation/shadow 체계 | `.link-card-shadow` 하나뿐 |
| motion 토큰 (duration/easing) | 모션 작업의 선행 조건 |

openai.com 류의 인상은 색이 아니라 **타이포 스케일 + 간격 리듬 + 모션**에서 나온다. 토큰 정리가
홈 재설계의 선행 조건인 이유다.

---

## 7-2. 캐시 전략 (2026-10-20 확정)

2026-10-20 보안 수정으로 기존 캐시(자체 API route + `next.tags`)가 제거됐다. 대체 방안은 **Next 16 의
`use cache`** 로 확정한다. 공식 문서 확인 사항:

- `use cache` 디렉티브와 `cacheLife`/`cacheTag` 는 **Next 16 에서 stable** (`unstable_` 접두사 제거)
- `unstable_cache` 는 문서상 **"`use cache` 로 대체됨"**
- `next.config.ts` 에 `cacheComponents: true` 필요
- 캐시 범위 안에서는 `cookies()`/`headers()` 접근 불가 → 세션은 바깥에서 읽고 `userId` 를 인자로 전달

```ts
export async function getLinks(params) {
  const user = await getSessionUser();        // 캐시 밖
  if (!user) throw new Error("로그인이 필요합니다.");
  return getCachedLinks(user.id, params);
}

async function getCachedLinks(userId: number, params) {
  "use cache";
  cacheTag(`links:${userId}`);
  cacheLife("max");
  return db.link.findMany({where: {folder: {userId}}});
}
```

변경 측은 `revalidateTag(\`links:${userId}\`)`. TanStack Query 를 쓰지 않는 대신 서버 캐시를 제대로
쓴다는 선택은 면접에서 설명 가능한 근거가 된다 (공식 문서에 TanStack Query 비교 페이지가 따로 있다).

### 구현하며 바뀐 것 (2026-10-20 구현 후 기록)

위 초안대로 넣었다가 실제로 세 군데가 어긋났다. 기록해 둔다.

1. **`revalidateTag` → `updateTag`.**
   Next 16 의 `revalidateTag(tag, profile)` 는 **지연 갱신**이다 — 옛 값을 한 번 더 내보낸 뒤 뒤에서
   갱신한다. 그래서 변경 직후 새로고침하면 이전 상태가 보였다. 같은 모듈에 있는 `updateTag(tag)` 가
   즉시 만료시키는 쪽이고, 서버 액션 전용이다(Route Handler 에서 부르면 예외). 반대로 Route Handler
   에서는 `revalidateTag` 를 써야 한다.
   근거: `node_modules/next/dist/server/web/spec-extension/revalidate.d.ts` 의 주석과 구현.

2. **렌더 중에는 무효화할 수 없다.**
   `revalidate()` 내부에 `if (workUnitStore.phase === 'render') throw ...` 가 있다. 설정 행이 없으면
   조회 중에 만들어 두던 코드가 이 가드에 걸려, 설정이 없는 사용자는 PigMoney 첫 방문에서 오류 화면을
   보게 됐다. → 조회는 저장된 값이 없으면 **기본값만 돌려주고**, 행은 첫 저장 때 만든다.

3. **`cacheLife("max")` 는 이 앱에 맞지 않는다.**
   `max` 는 재검증 주기가 **30일**이다(`config-shared.js` 의 내장 프로필). 앱을 거치는 변경은
   `updateTag` 로 즉시 반영되지만, **앱 밖에서 일어나는 변경은 태그를 갱신할 방법이 없다** — 게스트
   초기화 Lambda 가 매일 04:00 에 DB 를 직접 다시 채운다. 수명이 30일이면 떠 있는 인스턴스가 어제
   상태를 계속 내보낸다. → `cacheLife("hours")`(재검증 1시간)로 묶었다.

또 하나, 변경 함수에 태그 갱신을 **빠뜨리기 쉽다.** 처음 적용할 때 링크 추가·수정, 폴더 추가·이름 변경
네 곳이 빠져 있었고, 수명이 길어 새 링크가 목록에 영영 나타나지 않았다. `e2e/cache.spec.ts` 가 추가·
즐겨찾기·수정·삭제를 한 번씩 돌며 이걸 막는다.

---

## 7-3. 실행 순서 (확정, 2026-10-20)

의존 관계상 순차 진행. 각 단계 끝에 빌드·배포로 검증한다.

| 단계 | 내용 | 상태 |
|---|---|---|
| 1 | **의존성 업데이트** — Next 16, zod 4, eslint 10 + flat config, react/tailwind 마이너. prisma 는 RC 라 보류 | ✅ |
| 3 | **토큰 정리** — 중복 제거, `@theme inline`, `dark:` 버그 수정, 타이포·간격·radius·shadow·motion 스케일 신설 | ✅ |
| 4 | **반응형 + 홈 랜딩 재설계 + 모션 + 접근성** — 사이드바 드로어화, 홈을 히어로+소개 섹션+푸터 구조로 | ✅ |
| 2 | **캐시 레이어** — `cacheComponents` 활성화, `use cache` + `cacheTag`, 변경 측 `updateTag` | ✅ |
| 5 | **Playwright + Storybook** — Playwright 완료, Storybook 진행 중 | 🔄 |

실제 진행 순서는 2단계를 뒤로 미뤘다. 캡처할 화면이 투박한 채로 홈에 걸릴 수 없어서, 디자인(3·4)을
먼저 끝내고 캐시를 나중에 넣었다.

사용자 요구 사항 메모: 홈의 문제의식은 "openai.com 대비 **너무 텅 비어 보인다**" — 레이아웃 붕괴뿐 아니라
**콘텐츠 밀도** 자체가 부족하다는 뜻. 4단계에서 섹션 구성을 늘리는 방향으로 반영할 것.

---

## 8. 미확인 / 판단 보류

- **데이터가 있는 상태의 화면은 거의 못 봤다.** 게스트 계정이 매일 초기화되어 링크 카드 그리드,
  보고서 차트의 실제 밀도를 확인하지 못했다. 카드 디자인 평가는 보류 상태다.
- **Lighthouse·Core Web Vitals 미측정.** 번들 크기는 빌드 출력 기준 `/pigmoney` 208kB,
  `/link` 217kB, `/pigmoney/report` 216kB (First Load JS) — 과도하진 않으나 측정은 따로 필요하다.
- **접근성은 정적 관찰만 했다.** 실제 스크린리더·키보드 탐색 테스트는 하지 않았다.
