# 붕괴: 스타레일 HoYoLAB 자동 출석체크

매일 **06:40 KST** 에 GitHub Actions 가 HoYoLAB 출석체크를 대신 한다. 성공하면 조용히 끝나고,
**실패할 때만** 텔레그램(minimoku Todo 봇)으로 알림이 온다. 워크플로가 실패로 끝나므로 GitHub 의 실패 메일도 함께 온다.

| 구성 | 위치 |
|---|---|
| 스크립트 (의존성 없음, Node 22) | `scripts/hoyolab-checkin.mjs` |
| 스케줄 워크플로 | `.github/workflows/hoyolab-checkin.yml` — `cron: "40 21 * * *"` (UTC, = 06:40 KST) |
| 비밀값 | 저장소 Secrets: `HOYOLAB_COOKIE`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |

## 왜 GitHub Actions 인가

minimoku 의 기존 스케줄러는 Lambda(`telegram-todo-notifier`, 매분 실행)다. 하지만 쿠키를 Lambda 환경변수에 넣으려면
콘솔에서 함수 설정을 바꿔야 하고, HoYoLAB 쪽 오류가 Todo 알림을 함께 망가뜨릴 수 있다. 하루 1번이면 되는 작업이라
AWS 설정 없이 Secret 만 등록하면 되는 GitHub Actions 로 분리했다. 앱(Amplify)이나 DB 와는 무관하다.

## 처음 설정 (1회)

1. **쿠키 복사** — 쿠키가 오래 가도록 시크릿 창을 쓴다.
   1. 시크릿 창에서 https://www.hoyolab.com 로그인
   2. DevTools → Application → Cookies → `https://www.hoyolab.com`
   3. `ltoken_v2`, `ltuid_v2`, `ltmid_v2` 값을 아래 형식으로 이어 붙인다
      `ltoken_v2=...; ltuid_v2=...; ltmid_v2=...`
   4. **로그아웃하지 말고 창만 닫는다.** 평소 브라우저에서 로그아웃해도 이 쿠키는 살아 있어 보통 몇 달 간다
2. **Secret 등록** — GitHub 저장소 → Settings → Secrets and variables → Actions → New repository secret

   | 이름 | 값 |
   |---|---|
   | `HOYOLAB_COOKIE` | 위에서 만든 쿠키 문자열 |
   | `TELEGRAM_BOT_TOKEN` | `.env.production` 의 `TELEGRAM_BOT_TOKEN` 과 같은 값 |
   | `TELEGRAM_CHAT_ID` | `.env.production` 의 `TELEGRAM_ALLOWED_CHAT_ID` 와 같은 값 |

   텔레그램 두 개를 넣지 않아도 동작한다 (그때는 GitHub 실패 메일만 온다).
3. **확인** — Actions 탭 → "HoYoLAB Check-in" → Run workflow. 로그에 `출석 완료!` 또는 `오늘은 이미 출석했습니다.` 가 보이면 끝.

> `schedule` 은 **기본 브랜치(main)에 있는 워크플로만** 실행된다. main 에 머지돼야 매일 돌기 시작한다.

## 동작

1. `info` 조회 → 이미 출석했으면 종료
2. `sign` 호출. 일시적 오류(HTTP 오류·네트워크)는 **1분 간격으로 최대 3번 재시도**
3. `info` 를 다시 조회해 실제로 반영됐는지 확인

| 상황 | 결과 |
|---|---|
| retcode `0` / `-5003`(이미 출석) | 성공, 알림 없음 |
| retcode `-100` (쿠키 만료) | 즉시 중단 + 알림 → 쿠키를 다시 복사해 `HOYOLAB_COOKIE` 갱신 |
| `data.gt_result.is_risk == true` (캡차) | 즉시 중단 + 알림. **우회하지 않는다** → 그날은 직접 출석 |
| 재시도 후에도 실패, 기타 에러 | 알림 |

출석 리셋은 UTC+8 자정(KST 01:00)이라, 그 뒤인 06:40 에 실행한다. GitHub 스케줄은 수 분~수십 분 늦게 돌 수 있지만
하루 안에만 돌면 되므로 문제없다.

## 주의

- 쿠키는 코드·로그에 남기지 않는다. 스크립트는 쿠키 값을 출력하지 않고, Secret 은 GitHub 이 로그에서 자동 마스킹한다.
- 공개 저장소는 **60일간 커밋이 없으면 스케줄 워크플로가 자동 비활성화**된다. 그러면 Actions 탭에서 다시 Enable 한다.
