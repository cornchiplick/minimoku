# 붕괴: 스타레일 HoYoLAB 자동 출석체크

매일 **06:40 KST** 에 AWS Lambda 가 HoYoLAB 출석체크를 대신 한다. 성공하면 조용히 끝나고, **실패할
때만** 텔레그램(minimoku Todo 봇)으로 알림이 온다.

| 구성                                        | 위치                                                                                                        |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Lambda 함수 코드 (의존성 없음, Node 22 ESM) | `lambda/hoyolab-checkin/index.mjs`                                                                          |
| 함수 이름                                   | `minimoku-hoyolab-checkin` (ap-northeast-2)                                                                 |
| 실행 트리거                                 | EventBridge 규칙 `minimoku-hoyolab-checkin-daily` — `cron(40 21 * * ? *)` (UTC, = 06:40 KST)                |
| 비밀값                                      | Lambda 환경 변수: `HOYOLAB_COOKIE`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                                |
| 배포                                        | `main` push 시 GitHub Actions `Deploy Lambda` 가 자동 (수동: `cd lambda/hoyolab-checkin && npm run deploy`) |

## 왜 Lambda 인가 (2026-11-10 이관)

처음에는 GitHub Actions 의 `schedule` 로 만들었다. AWS 설정 없이 Secret 만 등록하면 되기 때문이었다.
그런데 **첫 예정 시각(2026-11-10 06:40)에 아예 실행되지 않았다.** 설정·쿠키·스크립트는 모두
정상이었고 (`gh run list` 상 `schedule` 이벤트 실행 0건), GitHub 이 발화시키지 않은 것이 원인이었다.
GitHub 은 **부하가 몰리면 예약 실행이 밀리거나 건너뛸 수 있다**고 공식 문서에 적어 두었고, 밀린
실행을 나중에 보충해 주지도 않는다. 매일 거르면 안 되는 작업에는 맞지 않는다.

minimoku 는 이미 EventBridge + Lambda 로 두 작업을 돌리고 있고 **제시간에 정확히** 실행된다 (게스트
초기화가 04:00:27 에 실행된 로그로 확인). 비용도 늘지 않는다 — 아래 "요금" 참고.

> 처음 Lambda 를 피했던 이유 중 "HoYoLAB 오류가 Todo 알림을 망가뜨릴 수 있다"는 **별도 함수로 분리해
> 해소**했다. 남은 단점은 쿠키 교체 때 콘솔에 들어가야 한다는 것 하나다.

## 요금

**추가 요금 0원.** Lambda 의 무료 한도는 기한이 없고(가입 12개월짜리가 아니다), 지금 사용량이 한참
못 미친다.

|          | 무료 한도     | 2026-10 실사용    | 출석체크 추가분 |
| -------- | ------------- | ----------------- | --------------- |
| 요청     | 월 100만 회   | 44,671회 (4.5%)   | +31회           |
| 실행시간 | 월 40만 GB-초 | 612 GB-초 (0.15%) | +약 12 GB-초    |

2026-10 AWS 청구액 $1.36 은 전부 Amplify(웹앱 호스팅)와 세금이고 **Lambda·EventBridge 몫은 $0.0000**
이다. AWS 크레딧이 2026-08 에 끝나 9월부터 실제 청구 중인데도 그렇다 — 크레딧에 가려진 것이 아니라
원래 무료 구간이다.

## 처음 설정 (1회, 콘솔 작업)

### 1. 쿠키 복사

쿠키가 오래 가도록 **시크릿 창**을 쓴다.

1. 시크릿 창에서 https://www.hoyolab.com 로그인
2. DevTools → Application → Cookies → `https://www.hoyolab.com`
3. `ltoken_v2`, `ltuid_v2`, `ltmid_v2` 값을 아래 형식으로 이어 붙인다
   `ltoken_v2=...; ltuid_v2=...; ltmid_v2=...`
4. **로그아웃하지 말고 창만 닫는다.** 평소 브라우저에서 로그아웃해도 이 쿠키는 살아 있어 보통 몇 달
   간다

### 2. Lambda 함수 생성

AWS 콘솔 → Lambda → 함수 생성 (리전 **ap-northeast-2 서울**)

| 항목      | 값                                                                      |
| --------- | ----------------------------------------------------------------------- |
| 함수 이름 | `minimoku-hoyolab-checkin`                                              |
| 런타임    | Node.js 22.x                                                            |
| 아키텍처  | x86_64 (기본)                                                           |
| 실행 역할 | 새 역할 생성 (기본 Lambda 권한) — DB 를 쓰지 않아 추가 권한이 필요 없다 |

생성 후 **구성** 탭에서:

- **일반 구성** → 메모리 `128` MB, 제한 시간 `10`분 0초 (평소 3초면 끝나지만, 일시적 오류를 1분
  간격으로 3번 재시도하므로 여유를 둔다. 과금은 실제 실행 시간 기준이라 길게 잡아도 손해가 없다)
- **환경 변수** → 3개 추가

  | 키                   | 값                                                         |
  | -------------------- | ---------------------------------------------------------- |
  | `HOYOLAB_COOKIE`     | 1번에서 만든 쿠키 문자열                                   |
  | `TELEGRAM_BOT_TOKEN` | `.env.production` 의 `TELEGRAM_BOT_TOKEN` 과 같은 값       |
  | `TELEGRAM_CHAT_ID`   | `.env.production` 의 `TELEGRAM_ALLOWED_CHAT_ID` 와 같은 값 |

  텔레그램 두 개는 없어도 동작한다 (그때는 CloudWatch 로그에만 남는다).

### 3. IAM 정책에 새 함수 추가 (CI 자동 배포용)

IAM → 정책 → **`MinimokuLambdaDeploy`** → 편집 → JSON 에서 두 군데에 줄을 추가한다.

- 첫 번째 `Resource` 배열에
  `arn:aws:lambda:ap-northeast-2:480415624766:function:minimoku-hoyolab-checkin`
- 두 번째 `Resource` 배열에
  `arn:aws:logs:ap-northeast-2:480415624766:log-group:/aws/lambda/minimoku-hoyolab-checkin:*`

이걸 빼먹으면 CI 배포가 `AccessDenied` 로 실패한다.

### 4. 코드 올리기

`main` 에 push 하면 GitHub Actions 가 자동 배포한다. **함수와 IAM 정책이 먼저 준비돼 있어야 한다** —
없는 함수에는 코드를 올릴 수 없어 CI 가 실패한다.

### 5. 동작 확인

Lambda 콘솔 → **Test** 탭 → 아무 이름으로 테스트 이벤트 생성 (내용은 `{}` 그대로) → Test 실행.
결과에 `"ok": true` 와 함께 로그에 `출석 완료!` 또는 `오늘은 이미 출석했습니다.` 가 보이면 된다.

### 6. 매일 실행 걸기

EventBridge → 규칙 → 규칙 생성

| 항목      | 값                                                     |
| --------- | ------------------------------------------------------ |
| 이름      | `minimoku-hoyolab-checkin-daily`                       |
| 규칙 유형 | 일정                                                   |
| 일정 패턴 | Cron 식 `cron(40 21 * * ? *)` — UTC 기준이라 06:40 KST |
| 대상      | Lambda 함수 → `minimoku-hoyolab-checkin`               |

> 기존 게스트 초기화 규칙(`minimoku-guest-reset-daily`, `cron(0 19 * * ? *)`)과 같은 방식이다.

## 동작

1. `info` 조회 → 이미 출석했으면 종료
2. `sign` 호출. 일시적 오류(HTTP 오류·네트워크)는 **1분 간격으로 최대 3번 재시도**
3. `info` 를 다시 조회해 실제로 반영됐는지 확인

| 상황                                    | 결과                                                                  |
| --------------------------------------- | --------------------------------------------------------------------- |
| retcode `0` / `-5003`(이미 출석)        | 성공, 알림 없음                                                       |
| retcode `-100` (쿠키 만료)              | 즉시 중단 + 알림 → 쿠키를 다시 복사해 환경 변수 `HOYOLAB_COOKIE` 갱신 |
| `data.gt_result.is_risk == true` (캡차) | 즉시 중단 + 알림. **우회하지 않는다** → 그날은 직접 출석              |
| 재시도 후에도 실패, 기타 에러           | 알림                                                                  |

출석 리셋은 UTC+8 자정(KST 01:00)이라, 그 뒤인 06:40 에 실행한다.

**실패해도 함수는 예외를 던지지 않고 `{ok:false}` 를 돌려준다.** 던지면 EventBridge 가 자동 재시도해
같은 알림이 두세 번 오기 때문이다. 실패 사실은 텔레그램 알림과 CloudWatch 의 ERROR 로그로 남는다.

## 쿠키가 만료되면

텔레그램으로 `쿠키가 만료됐습니다 (retcode -100)` 알림이 온다. 위 **1번**으로 쿠키를 새로 복사한 뒤
Lambda 콘솔 → 구성 → 환경 변수에서 `HOYOLAB_COOKIE` 만 바꾸면 된다. 코드 배포는 필요 없다.

## 주의

- 쿠키는 코드·로그에 남기지 않는다. 함수는 쿠키 값을 출력하지 않는다.
- 이 함수는 **DB 를 쓰지 않는다.** Prisma 의존성이 없어 zip 이 8KB 다 (다른 두 함수는 27MB). 그래서
  `deploy.sh` 의 Prisma 엔진 검사는 이 함수에서 자동으로 건너뛴다.
- GitHub Actions 쪽(`.github/workflows/hoyolab-checkin.yml`, `scripts/hoyolab-checkin.mjs`)은
  **Lambda 가 며칠 정상 동작하는 것을 확인할 때까지 보조로 남겨 둔다.** 출석은 멱등이라 둘 다 돌아도
  해가 없다. 확인 후 제거한다.
