import {defineConfig, devices} from "@playwright/test";

/**
 * E2E 설정.
 *
 * ⚠️ 이 프로젝트는 dev 와 prod 가 같은 Supabase DB 를 쓴다. 따라서 테스트는
 * 실데이터를 건드린다. 모든 테스트는 게스트 계정(매일 04:00 KST 초기화)만
 * 사용하고, 데이터를 만드는 테스트는 고유 제목을 붙인 뒤 끝나면 반드시 지운다.
 * 게스트 계정은 모든 방문자가 공유하므로 동시 실행하지 않는다.
 *
 * E2E_BASE_URL 로 프로덕션(www.minimoku.net)을 가리킬 수도 있지만 권장하지 않는다.
 * Supabase 무료 티어의 커넥션 풀이 15개뿐이라, 로컬 dev 서버가 떠 있는 상태에서
 * 함께 돌리면 "max clients reached in session mode" 로 실제 로그인이 막힌다.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  // 게스트 계정을 공유하므로 병렬로 돌리지 않는다
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
  },
  projects: [
    // 게스트로 로그인해 세션을 저장한다
    {name: "setup", testMatch: /guest\.setup\.ts/},
    {
      name: "desktop",
      use: {...devices["Desktop Chrome"], storageState: "e2e/.auth/guest.json"},
      dependencies: ["setup"],
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "mobile",
      use: {...devices["Pixel 5"], storageState: "e2e/.auth/guest.json"},
      dependencies: ["setup"],
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  // 외부 주소를 지정하면 그쪽으로 붙고, 아니면 로컬 dev 서버를 띄운다
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
