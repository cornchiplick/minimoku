// 붕괴: 스타레일 HoYoLAB 일일 출석체크 Lambda
// EventBridge 가 매일 06:40 KST(= UTC 21:40)에 트리거한다. 출석 리셋이 UTC+8 자정(KST 01:00)이라 그 뒤에 돈다.
//
// 의존성이 없다 — Node 22 의 내장 fetch 만 쓴다. 그래서 빌드도, node_modules 도 없이 이 파일 하나가 곧 zip 이다.
// (다른 두 Lambda 는 Prisma 때문에 27MB 인데 이건 수 KB 다)
//
// 환경변수 (Lambda 콘솔 → 구성 → 환경 변수)
//   HOYOLAB_COOKIE      필수. "ltoken_v2=...; ltuid_v2=...; ltmid_v2=..."
//   TELEGRAM_BOT_TOKEN  선택. 실패 알림용 (minimoku 텔레그램 Todo 봇과 같은 봇)
//   TELEGRAM_CHAT_ID    선택. 알림 받을 chat id
//
// 규칙: ① 쿠키 값은 절대 출력하지 않는다 ② 캡차(is_risk)는 우회하지 않고 알림만 보낸다
//       ③ 실패해도 throw 하지 않고 {ok:false} 를 돌려준다 — 던지면 EventBridge 가 재시도해 같은 알림이 여러 번 온다.
//          실패 사실은 텔레그램 알림과 ERROR 로그로 남는다

const ACT_ID = "e202303301540311";
const API_BASE = "https://sg-public-api.hoyolab.com/event/luna/os";
const RETRY_COUNT = 3; // 첫 시도 실패 후 재시도 횟수
const RETRY_DELAY_MS = 60_000; // 재시도 간격 1분
const REQUEST_TIMEOUT_MS = 15_000;

// HoYoLAB retcode
const RETCODE = {
  OK: 0,
  ALREADY_SIGNED: -5003,
  NOT_LOGGED_IN: -100,
};

// 재시도해도 소용없는 실패 (쿠키 만료·캡차) — 바로 알림
class FatalError extends Error {}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getCookie() {
  const cookie = process.env.HOYOLAB_COOKIE?.trim();
  if (!cookie)
    throw new FatalError(
      "HOYOLAB_COOKIE 가 설정되지 않았습니다. Lambda 콘솔의 환경 변수를 확인해 주세요."
    );
  // 값은 보지 않고 필요한 키가 들어 있는지만 확인
  const missing = ["ltoken_v2", "ltuid_v2"].filter((key) => !cookie.includes(`${key}=`));
  if (missing.length > 0) {
    throw new FatalError(
      `HOYOLAB_COOKIE 에 ${missing.join(", ")} 가 없습니다. 쿠키를 다시 복사해 주세요.`
    );
  }
  return cookie;
}

function buildHeaders(cookie) {
  return {
    Cookie: cookie,
    "x-rpc-signgame": "hkrpg",
    Origin: "https://act.hoyolab.com",
    Referer: "https://act.hoyolab.com/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
  };
}

// HoYoLAB 호출 — HTTP 오류·JSON 이 아닌 응답은 일반 Error (재시도 대상)
async function callApi(path, {method = "GET", cookie, body} = {}) {
  const url = `${API_BASE}/${path}`;
  const response = await fetch(url, {
    method,
    headers: buildHeaders(cookie),
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  }).catch((error) => {
    // "fetch failed" 만으로는 원인을 알 수 없어 cause(ECONNRESET, 타임아웃 등)를 붙인다
    const cause = error.cause?.code ?? error.cause?.message ?? error.name;
    throw new Error(`${path.split("?")[0]} 네트워크 오류 (${cause})`);
  });
  if (!response.ok) throw new Error(`${path} HTTP ${response.status}`);
  const json = await response.json().catch(() => null);
  if (!json || typeof json.retcode !== "number")
    throw new Error(`${path} 응답 형식이 올바르지 않습니다.`);
  return json;
}

// 쿠키 만료는 어느 호출에서 나와도 즉시 중단
function assertLoggedIn(json) {
  if (json.retcode === RETCODE.NOT_LOGGED_IN) {
    throw new FatalError(
      "쿠키가 만료됐습니다 (retcode -100).\n시크릿 창에서 HoYoLAB 에 로그인해 새 쿠키를 복사한 뒤 Lambda 환경 변수 HOYOLAB_COOKIE 를 갱신해 주세요."
    );
  }
}

async function getInfo(cookie) {
  const json = await callApi(`info?act_id=${ACT_ID}&lang=en-us`, {cookie});
  assertLoggedIn(json);
  if (json.retcode !== RETCODE.OK)
    throw new Error(`info 실패: retcode ${json.retcode} (${json.message})`);
  return {isSigned: Boolean(json.data?.is_sign), totalDays: json.data?.total_sign_day ?? 0};
}

// 출석 1회 시도. true = 출석 완료(이미 출석 포함)
async function sign(cookie) {
  const json = await callApi("sign", {
    method: "POST",
    cookie,
    body: {act_id: ACT_ID, lang: "en-us"},
  });
  assertLoggedIn(json);

  // 캡차 요구는 retcode 0 으로도 올 수 있으므로 성공 판정보다 먼저 본다
  if (json.data?.gt_result?.is_risk === true) {
    throw new FatalError(
      "HoYoLAB 이 캡차 인증을 요구했습니다. 자동으로 넘기지 않으니 오늘은 직접 출석해 주세요.\nhttps://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=" +
        ACT_ID
    );
  }
  if (json.retcode === RETCODE.OK || json.retcode === RETCODE.ALREADY_SIGNED) return true;
  throw new Error(`sign 실패: retcode ${json.retcode} (${json.message})`);
}

// 텔레그램 알림 — 설정이 없으면 건너뛴다 (그래도 CloudWatch 로그에는 남는다)
async function notify(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("텔레그램 설정이 없어 알림을 건너뜁니다.");
    return;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({chat_id: chatId, text: `[스타레일 출석체크]\n${text}`}),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    console.log(
      response.ok ? "텔레그램 알림 발송 완료" : `텔레그램 알림 실패: HTTP ${response.status}`
    );
  } catch (error) {
    console.log(`텔레그램 알림 오류: ${error.message}`);
  }
}

// 일시적 오류만 1분 간격으로 재시도한다. 쿠키 만료·캡차(FatalError)는 즉시 중단
async function withRetry(label, task) {
  let lastError;
  for (let attempt = 1; attempt <= RETRY_COUNT + 1; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (error instanceof FatalError) throw error;
      lastError = error;
      console.log(`${label} 시도 ${attempt}회 실패: ${error.message}`);
      if (attempt <= RETRY_COUNT) await sleep(RETRY_DELAY_MS);
    }
  }
  throw new Error(
    `${label}: ${RETRY_COUNT + 1}번 시도했지만 실패했습니다. 마지막 오류: ${lastError.message}`
  );
}

async function checkIn() {
  const cookie = getCookie();

  // 1. 이미 출석했으면 종료
  const before = await withRetry("출석 정보 조회", () => getInfo(cookie));
  if (before.isSigned) {
    console.log(`오늘은 이미 출석했습니다. (누적 ${before.totalDays}일)`);
    return {alreadySigned: true, totalDays: before.totalDays};
  }

  // 2. 출석
  await withRetry("출석", () => sign(cookie));

  // 3. 실제로 반영됐는지 다시 확인
  const after = await withRetry("출석 확인", () => getInfo(cookie));
  if (!after.isSigned)
    throw new Error("출석 요청은 성공했지만 info 에서 출석으로 확인되지 않습니다.");
  console.log(`출석 완료! (누적 ${after.totalDays}일)`);
  return {alreadySigned: false, totalDays: after.totalDays};
}

export const handler = async () => {
  try {
    const result = await checkIn();
    return {ok: true, ...result};
  } catch (error) {
    // 던지지 않는다 — EventBridge 재시도로 같은 알림이 여러 번 오는 것을 막는다
    console.error(`실패: ${error.message}`);
    await notify(`출석 실패\n${error.message}`);
    return {ok: false, error: error.message};
  }
};
